<?php

use App\Models\Skill;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot access skills module', function () {
    $response = $this->get('/admin/skills');
    $response->assertRedirect('/login');
});

test('owner can view skills constellation list', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/skills');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Skills/Index')
        ->has('skills')
        ->has('categories')
    );
});

test('owner can create a new skill in an existing or new category', function () {
    $this->actingAs($this->owner);

    Cache::put('portfolio.page.v1', 'cached_skills');

    $response = $this->post('/admin/skills', [
        'name' => 'Docker & Kubernetes',
        'category' => 'Cloud & DevOps',
        'level' => 85,
        'icon' => 'lni-cloud-network',
        'is_published' => true,
    ]);

    $response->assertSessionHasNoErrors();

    $skill = Skill::where('name', 'Docker & Kubernetes')->first();
    expect($skill)->not->toBeNull();
    expect($skill->category)->toBe('Cloud & DevOps');
    expect($skill->level)->toBe(85);
    expect($skill->is_published)->toBeTrue();
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});

test('owner can update skill attributes', function () {
    $this->actingAs($this->owner);

    $skill = Skill::create([
        'name' => 'Rust',
        'category' => 'Backend',
        'level' => 70,
        'icon' => 'lni-cog',
        'is_published' => true,
    ]);

    $response = $this->put("/admin/skills/{$skill->id}", [
        'name' => 'Rust Systems',
        'category' => 'Backend',
        'level' => 90,
        'icon' => 'lni-cog',
        'is_published' => false,
    ]);

    $response->assertSessionHasNoErrors();

    $skill->refresh();
    expect($skill->name)->toBe('Rust Systems');
    expect($skill->level)->toBe(90);
    expect($skill->is_published)->toBeFalse();
});

test('owner can toggle publish status and delete a skill', function () {
    $this->actingAs($this->owner);

    $skill = Skill::create([
        'name' => 'GraphQL',
        'category' => 'Backend',
        'level' => 80,
        'icon' => 'lni-network',
        'is_published' => true,
    ]);

    // Toggle publish
    $toggle = $this->patch("/admin/skills/{$skill->id}/toggle-publish");
    $toggle->assertSessionHasNoErrors();
    expect($skill->fresh()->is_published)->toBeFalse();

    // Toggle back
    $toggleBack = $this->patch("/admin/skills/{$skill->id}/toggle-publish");
    $toggleBack->assertSessionHasNoErrors();
    expect($skill->fresh()->is_published)->toBeTrue();

    // Delete
    $delete = $this->delete("/admin/skills/{$skill->id}");
    $delete->assertSessionHasNoErrors();
    expect(Skill::find($skill->id))->toBeNull();
});

test('owner can reorder skills within category', function () {
    $this->actingAs($this->owner);

    $skill1 = Skill::create([
        'name' => 'Skill Alpha',
        'category' => 'Design',
        'level' => 80,
        'sort_order' => 0,
    ]);

    $skill2 = Skill::create([
        'name' => 'Skill Beta',
        'category' => 'Design',
        'level' => 85,
        'sort_order' => 1,
    ]);

    $response = $this->post('/admin/skills/reorder', [
        'orders' => [
            ['id' => $skill2->id, 'sort_order' => 0],
            ['id' => $skill1->id, 'sort_order' => 1],
        ],
    ]);

    $response->assertSessionHasNoErrors();
    expect($skill2->fresh()->sort_order)->toBe(0);
    expect($skill1->fresh()->sort_order)->toBe(1);
});

test('skill rejects invalid level or missing name', function () {
    $this->actingAs($this->owner);

    // Level > 100
    $responseOver = $this->post('/admin/skills', [
        'name' => 'Invalid Level Skill',
        'category' => 'Backend',
        'level' => 150,
    ]);
    $responseOver->assertSessionHasErrors(['level']);

    // Negative level
    $responseNeg = $this->post('/admin/skills', [
        'name' => 'Negative Level Skill',
        'category' => 'Backend',
        'level' => -5,
    ]);
    $responseNeg->assertSessionHasErrors(['level']);

    // Missing name
    $responseName = $this->post('/admin/skills', [
        'name' => '',
        'category' => 'Backend',
        'level' => 80,
    ]);
    $responseName->assertSessionHasErrors(['name']);
});
