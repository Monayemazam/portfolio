<?php

use App\Models\Section;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot access sections', function () {
    $response = $this->get('/admin/sections');
    $response->assertRedirect('/login');
});

test('owner can view sections list', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/sections');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Sections/Index')
        ->has('sections')
    );
});

test('owner can update section details', function () {
    $this->actingAs($this->owner);

    $section = Section::where('key', 'projects')->firstOrFail();

    Cache::put('portfolio.page.v1', 'cached_data');

    $response = $this->put("/admin/sections/{$section->id}", [
        'nav_label' => 'Solar Projects',
        'eyebrow' => 'MISSION 04 / EXPEDITIONS',
        'title' => 'Featured Planetary Missions',
        'subtitle' => 'Interactive 3D planets representing commercial production builds.',
        'is_visible' => true,
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $section->refresh();
    expect($section->nav_label)->toBe('Solar Projects');
    expect($section->eyebrow)->toBe('MISSION 04 / EXPEDITIONS');
    expect($section->title)->toBe('Featured Planetary Missions');
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});

test('hiding a section sets is_visible to zero', function () {
    $this->actingAs($this->owner);

    $section = Section::where('key', 'testimonials')->firstOrFail();
    expect($section->is_visible)->toBeTrue();

    $response = $this->patch("/admin/sections/{$section->id}/toggle-visibility");
    $response->assertSessionHasNoErrors();

    $section->refresh();
    expect($section->is_visible)->toBeFalse();
});

test('hero and footer sections cannot be hidden', function () {
    $this->actingAs($this->owner);

    $hero = Section::where('key', 'hero')->firstOrFail();
    $footer = Section::where('key', 'footer')->firstOrFail();

    // Toggle endpoint check for hero
    $response = $this->patch("/admin/sections/{$hero->id}/toggle-visibility");
    $response->assertSessionHasErrors(['is_visible']);
    $hero->refresh();
    expect($hero->is_visible)->toBeTrue();

    // Toggle endpoint check for footer
    $responseFooter = $this->patch("/admin/sections/{$footer->id}/toggle-visibility");
    $responseFooter->assertSessionHasErrors(['is_visible']);
    $footer->refresh();
    expect($footer->is_visible)->toBeTrue();

    // Update endpoint check attempting to set is_visible = false on hero
    $updateResponse = $this->put("/admin/sections/{$hero->id}", [
        'nav_label' => 'Hero',
        'title' => 'Hero',
        'is_visible' => false,
    ]);
    $updateResponse->assertSessionHasErrors(['is_visible']);
    $hero->refresh();
    expect($hero->is_visible)->toBeTrue();
});

test('reordering sections updates sort_order in database', function () {
    $this->actingAs($this->owner);

    $section1 = Section::where('key', 'hero')->firstOrFail();
    $section2 = Section::where('key', 'about')->firstOrFail();

    $response = $this->post('/admin/sections/reorder', [
        'orders' => [
            ['id' => $section2->id, 'sort_order' => 0],
            ['id' => $section1->id, 'sort_order' => 1],
        ],
    ]);

    $response->assertSessionHasNoErrors();

    expect($section2->fresh()->sort_order)->toBe(0);
    expect($section1->fresh()->sort_order)->toBe(1);
});
