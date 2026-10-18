<?php

use App\Models\HeroContent;
use App\Models\Section;
use App\Models\Setting;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    $this->seed();
    Cache::forget('portfolio.page.v1');
    Cache::forget('portfolio.theme_settings');
});

test('public portfolio page is accessible at / and renders Portfolio/Index', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Portfolio/Index')
        ->has('sections')
        ->has('hero')
        ->has('about')
        ->has('skills')
        ->has('projects')
        ->has('services')
        ->has('experiences')
        ->has('processSteps')
        ->has('testimonials')
        ->has('settings')
        ->has('seo')
    );
});

test('portfolio page caches data under portfolio.page.v1', function () {
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();

    $this->get('/');

    expect(Cache::has('portfolio.page.v1'))->toBeTrue();
    $cached = Cache::get('portfolio.page.v1');
    expect($cached)->toBeArray()
        ->and($cached)->toHaveKeys(['sections', 'hero', 'about', 'skills', 'projects', 'services', 'experiences', 'processSteps', 'testimonials', 'settings', 'seo']);
});

test('changing database content changes public page after cache clear', function () {
    $hero = HeroContent::first();
    expect($hero)->not->toBeNull();

    $this->get('/');

    // Update database row
    $hero->update(['name' => 'COMMANDER MONAYEM']);
    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Portfolio/Index')
        ->where('hero.name', 'COMMANDER MONAYEM')
    );
});

test('hiding a section removes it from rendered sections', function () {
    $skillsSection = Section::where('key', 'skills')->first();
    expect($skillsSection)->not->toBeNull();

    // Verify initially present
    $response = $this->get('/');
    $props = $response->original->getData()['page']['props'];
    $keys = collect($props['sections'])->pluck('key')->all();
    expect($keys)->toContain('skills');

    // Hide section
    $skillsSection->update(['is_visible' => false]);
    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $props = $response->original->getData()['page']['props'];
    $keys = collect($props['sections'])->pluck('key')->all();
    expect($keys)->not->toContain('skills');
});

test('reordering sections changes public section order', function () {
    $aboutSection = Section::where('key', 'about')->first();
    $heroSection = Section::where('key', 'hero')->first();
    expect($aboutSection)->not->toBeNull()
        ->and($heroSection)->not->toBeNull();

    // Move about before hero
    $aboutSection->update(['sort_order' => 0]);
    $heroSection->update(['sort_order' => 1]);
    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $props = $response->original->getData()['page']['props'];
    $keys = collect($props['sections'])->pluck('key')->all();

    expect($keys[0])->toBe('about')
        ->and($keys[1])->toBe('hero');
});

test('testimonials section is hidden when no testimonial is published', function () {
    // Unpublish all testimonials
    Testimonial::query()->update(['is_published' => false]);
    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $props = $response->original->getData()['page']['props'];
    $keys = collect($props['sections'])->pluck('key')->all();

    expect($keys)->not->toContain('testimonials')
        ->and($props['testimonials'])->toBeEmpty();
});

test('theme settings are passed to app view and page props', function () {
    Setting::where('key', 'default_theme')->update(['value' => 'dark']);
    Setting::where('key', 'dark_primary')->update(['value' => '#8B5CF6']);
    Cache::forget('portfolio.page.v1');
    Cache::forget('portfolio.theme_settings');

    $response = $this->get('/');
    $response->assertOk();
    $response->assertViewHas('themeSettings', function ($settings) {
        return isset($settings['default_theme']) && $settings['default_theme'] === 'dark';
    });

    $response->assertInertia(fn ($page) => $page
        ->where('settings.default_theme', 'dark')
        ->where('settings.dark_primary', '#8B5CF6')
    );
});
