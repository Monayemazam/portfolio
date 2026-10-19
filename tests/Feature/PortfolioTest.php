<?php

use App\Models\AboutFact;
use App\Models\HeroContent;
use App\Models\HeroRole;
use App\Models\Media;
use App\Models\Project;
use App\Models\Section;
use App\Models\Setting;
use App\Models\Skill;
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

test('changing animation_level setting updates props on public page', function () {
    Setting::where('key', 'animation_level')->update(['value' => 'light']);
    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('settings.animation_level', 'light')
    );

    Setting::where('key', 'animation_level')->update(['value' => 'off']);
    Cache::forget('portfolio.page.v1');

    $response2 = $this->get('/');
    $response2->assertOk();
    $response2->assertInertia(fn ($page) => $page
        ->where('settings.animation_level', 'off')
    );
});

test('adding a skill in database reflects on public page after cache clear', function () {
    Skill::create([
        'name' => 'Next.js Space Station',
        'category' => 'Frontend',
        'level' => 92,
        'icon' => 'React',
        'sort_order' => 99,
        'is_published' => true,
    ]);
    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $response->assertOk();
    $props = $response->original->getData()['page']['props'];
    $skills = collect($props['skills']);
    expect($skills->contains(fn ($s) => $s['name'] === 'Next.js Space Station' && $s['level'] === 92))->toBeTrue();
});

test('editing a hero role updates public page hero roles after reload', function () {
    $firstRole = HeroRole::first();
    expect($firstRole)->not->toBeNull();

    $firstRole->update(['text' => 'Orbital Systems Architect']);
    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $response->assertOk();
    $props = $response->original->getData()['page']['props'];
    $roles = collect($props['hero']['roles']);
    expect($roles->contains(fn ($r) => $r['text'] === 'Orbital Systems Architect'))->toBeTrue();
});

test('editing a counter value updates public page facts after reload', function () {
    $counter = AboutFact::where('kind', 'counter')->first();
    expect($counter)->not->toBeNull();

    $counter->update([
        'value' => '42',
        'suffix' => '+',
    ]);
    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $response->assertOk();
    $props = $response->original->getData()['page']['props'];
    $facts = collect($props['about']['facts']);
    expect($facts->contains(fn ($f) => $f['id'] === $counter->id && $f['value'] === '42'))->toBeTrue();
});

test('resume media is null when resume_media_id is null', function () {
    Setting::where('key', 'resume_media_id')->update(['value' => null]);
    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('settings.resume_media', null)
    );
});

test('resume media resolves when resume_media_id is configured', function () {
    $media = Media::create([
        'disk' => 'public',
        'path' => 'documents/flight-resume.pdf',
        'original_name' => 'flight-resume.pdf',
        'mime' => 'application/pdf',
        'type' => 'document',
        'size_bytes' => 102400,
        'alt_text' => 'Flight Resume',
    ]);

    Setting::where('key', 'resume_media_id')->update(['value' => (string) $media->id]);
    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('settings.resume_media.id', $media->id)
        ->where('settings.resume_media.type', 'document')
    );
});

test('all six seeded projects are returned in sort_order on public portfolio page', function () {
    $response = $this->get('/');
    $response->assertOk();

    $props = $response->original->getData()['page']['props'];
    $projects = collect($props['projects']);

    expect($projects)->toHaveCount(6);

    $sortOrders = $projects->pluck('sort_order')->all();
    $expectedSorted = $sortOrders;
    sort($expectedSorted);
    expect($sortOrders)->toEqual($expectedSorted);

    $slugs = $projects->pluck('slug')->all();
    expect($slugs)->toContain('asn-group')
        ->and($slugs)->toContain('mercury-bangladesh')
        ->and($slugs)->toContain('tasa')
        ->and($slugs)->toContain('tazwar-bd')
        ->and($slugs)->toContain('sinbad-shipping-lines')
        ->and($slugs)->toContain('ayra-espana');
});

test('unpublishing a project removes it from public projects list after cache clear', function () {
    $asn = Project::where('slug', 'asn-group')->first();
    expect($asn)->not->toBeNull();

    $asn->update(['is_published' => false]);
    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $response->assertOk();
    $props = $response->original->getData()['page']['props'];
    $slugs = collect($props['projects'])->pluck('slug')->all();

    expect($slugs)->not->toContain('asn-group')
        ->and($slugs)->toHaveCount(5);
});

test('publishing a new project with generic style adds it to public projects', function () {
    $newProject = Project::create([
        'title' => 'Nebula Analytics Platform',
        'slug' => 'nebula-analytics',
        'summary' => 'Cosmic big-data telemetry and reporting platform.',
        'description' => 'Real-time solar telemetry streaming architecture.',
        'business_type' => 'Enterprise SaaS',
        'role' => 'Lead Engineer',
        'year' => 2025,
        'live_url' => 'https://nebula.example.com',
        'planet_style' => 'generic',
        'accent_color' => '#A855F7',
        'show_live_preview' => false,
        'is_featured' => false,
        'is_published' => true,
        'sort_order' => 10,
    ]);

    Cache::forget('portfolio.page.v1');

    $response = $this->get('/');
    $response->assertOk();
    $props = $response->original->getData()['page']['props'];
    $projects = collect($props['projects']);

    expect($projects->pluck('slug')->all())->toContain('nebula-analytics');
    $nebula = $projects->firstWhere('slug', 'nebula-analytics');
    expect($nebula['planet_style'])->toBe('generic')
        ->and($nebula['accent_color'])->toBe('#A855F7');
});

test('project detail data includes grouped features, tags, and valid destination live_url', function () {
    $response = $this->get('/');
    $response->assertOk();
    $props = $response->original->getData()['page']['props'];
    $projects = collect($props['projects']);

    $asn = $projects->firstWhere('slug', 'asn-group');
    expect($asn)->not->toBeNull()
        ->and($asn['live_url'])->toBeString()->and(filter_var($asn['live_url'], FILTER_VALIDATE_URL))->not->toBeFalse()
        ->and($asn['features'])->toBeArray()->and(count($asn['features']))->toBeGreaterThan(0);

    // Verify all features have group_label, text, and sort_order
    foreach ($asn['features'] as $feature) {
        expect($feature)->toHaveKeys(['group_label', 'text', 'sort_order'])
            ->and($feature['text'])->toBeString()->not->toBeEmpty();
    }
});
