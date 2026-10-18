<?php

use App\Models\HeroContent;
use App\Models\HeroRole;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot access hero module', function () {
    $response = $this->get('/admin/hero');
    $response->assertRedirect('/login');
});

test('owner can view hero module', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/hero');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Hero/Index')
        ->has('hero')
    );
});

test('owner can update hero content', function () {
    $this->actingAs($this->owner);

    Cache::put('portfolio.page.v1', 'cached_hero');

    $response = $this->put('/admin/hero', [
        'eyebrow' => 'MISSION 01 / ORBITAL DEPLOYMENT',
        'name' => 'Monayem Azam',
        'primary_button_label' => 'Explore Missions',
        'primary_button_url' => '#projects',
        'secondary_button_label' => 'Communicate',
        'secondary_button_url' => '#contact',
    ]);

    $response->assertSessionHasNoErrors();

    $hero = HeroContent::firstOrFail();
    expect($hero->eyebrow)->toBe('MISSION 01 / ORBITAL DEPLOYMENT');
    expect($hero->primary_button_label)->toBe('Explore Missions');
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});

test('owner can create, update, reorder and delete hero role lines', function () {
    $this->actingAs($this->owner);

    // 1. Create role
    $createResponse = $this->post('/admin/hero/roles', [
        'text' => 'AI System Architect',
    ]);
    $createResponse->assertSessionHasNoErrors();

    $role = HeroRole::where('text', 'AI System Architect')->first();
    expect($role)->not->toBeNull();

    // 2. Update role
    $updateResponse = $this->put("/admin/hero/roles/{$role->id}", [
        'text' => 'Senior Full-Stack Space Engineer',
    ]);
    $updateResponse->assertSessionHasNoErrors();
    expect($role->fresh()->text)->toBe('Senior Full-Stack Space Engineer');

    // 3. Reorder
    $role2 = HeroRole::create([
        'hero_content_id' => $role->hero_content_id,
        'text' => 'UI/UX Visual Designer',
        'sort_order' => 5,
    ]);

    $reorderResponse = $this->post('/admin/hero/roles/reorder', [
        'orders' => [
            ['id' => $role2->id, 'sort_order' => 0],
            ['id' => $role->id, 'sort_order' => 1],
        ],
    ]);
    $reorderResponse->assertSessionHasNoErrors();
    expect($role2->fresh()->sort_order)->toBe(0);
    expect($role->fresh()->sort_order)->toBe(1);

    // 4. Delete
    $deleteResponse = $this->delete("/admin/hero/roles/{$role->id}");
    $deleteResponse->assertSessionHasNoErrors();
    expect(HeroRole::find($role->id))->toBeNull();
});

test('hero content rejects invalid input', function () {
    $this->actingAs($this->owner);

    $response = $this->put('/admin/hero', [
        'name' => '', // Required
        'primary_button_label' => '',
        'primary_button_url' => '',
        'secondary_button_label' => '',
        'secondary_button_url' => '',
    ]);

    $response->assertSessionHasErrors(['name', 'primary_button_label']);
});
