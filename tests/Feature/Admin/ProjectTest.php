<?php

use App\Models\Media;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot access projects management', function () {
    $response = $this->get('/admin/projects');
    $response->assertRedirect('/login');
});

test('owner can view projects list with status filters', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/projects');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Projects/Index')
        ->has('projects')
        ->has('counts')
        ->where('status', 'all')
    );
});

test('owner can filter projects by published, draft, and trash', function () {
    $this->actingAs($this->owner);

    // Published filter
    $responsePub = $this->get('/admin/projects?status=published');
    $responsePub->assertOk();
    $responsePub->assertInertia(fn ($page) => $page
        ->component('Admin/Projects/Index')
        ->where('status', 'published')
    );

    // Draft filter
    $responseDraft = $this->get('/admin/projects?status=draft');
    $responseDraft->assertOk();
    $responseDraft->assertInertia(fn ($page) => $page
        ->component('Admin/Projects/Index')
        ->where('status', 'draft')
    );

    // Trash filter
    $responseTrash = $this->get('/admin/projects?status=trash');
    $responseTrash->assertOk();
    $responseTrash->assertInertia(fn ($page) => $page
        ->component('Admin/Projects/Index')
        ->where('status', 'trash')
    );
});

test('creating a seventh project adds exactly one project and correct associated feature, media, and tag records', function () {
    $this->actingAs($this->owner);

    $initialCount = Project::whereNull('deleted_at')->count();
    expect($initialCount)->toBe(6);

    $media = Media::factory()->create([
        'type' => 'image',
        'mime' => 'image/webp',
    ]);

    Cache::put('portfolio.page.v1', 'cached_solar_data');

    $response = $this->post('/admin/projects', [
        'title' => 'Cosmic Nebula Engine',
        'slug' => 'cosmic-nebula-engine',
        'summary' => 'Real-time WebGL celestial simulation engine for deep space exploration showcase.',
        'description' => 'Detailed architecture using Three.js and custom shaders with low power fallbacks.',
        'business_type' => 'Astrophysics Research',
        'role' => 'Lead Graphics Engineer',
        'year' => 2025,
        'live_url' => 'https://nebula.monayem.space',
        'planet_style' => 'station',
        'accent_color' => '#38BDF8',
        'cover_media_id' => $media->id,
        'show_live_preview' => true,
        'is_featured' => true,
        'is_published' => true,
        'tags' => [
            ['name' => 'Three.js'],
            ['name' => 'WebGL'],
            ['name' => 'TypeScript'],
        ],
        'features' => [
            [
                'group_label' => 'Rendering Engine',
                'text' => 'Procedural procedural shaders with LOD tessellation',
                'sort_order' => 0,
            ],
            [
                'group_label' => 'Rendering Engine',
                'text' => 'Lenis smooth lerp integration',
                'sort_order' => 1,
            ],
            [
                'group_label' => 'Admin Controls',
                'text' => 'Real-time orbital telemetry monitoring',
                'sort_order' => 2,
            ],
        ],
        'media' => [
            [
                'media_id' => $media->id,
                'kind' => 'desktop',
                'caption' => 'Primary cockpit viewport',
                'sort_order' => 0,
            ],
        ],
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.projects.index'));

    expect(Project::whereNull('deleted_at')->count())->toBe(7);

    $project = Project::where('slug', 'cosmic-nebula-engine')->first();
    expect($project)->not->toBeNull();
    expect($project->title)->toBe('Cosmic Nebula Engine');
    expect($project->planet_style)->toBe('station');
    expect($project->is_featured)->toBeTrue();
    expect($project->is_published)->toBeTrue();
    expect($project->show_live_preview)->toBeTrue();
    expect($project->cover_media_id)->toBe($media->id);

    // Check tags
    expect($project->tags)->toHaveCount(3);
    expect($project->tags->pluck('name')->toArray())->toContain('Three.js', 'WebGL', 'TypeScript');

    // Check features
    expect($project->features)->toHaveCount(3);
    $features = $project->features()->orderBy('sort_order')->get();
    expect($features[0]->group_label)->toBe('Rendering Engine');
    expect($features[0]->text)->toBe('Procedural procedural shaders with LOD tessellation');
    expect($features[2]->group_label)->toBe('Admin Controls');

    // Check media
    expect($project->projectMedia)->toHaveCount(1);
    expect($project->projectMedia->first()->media_id)->toBe($media->id);
    expect($project->projectMedia->first()->kind)->toBe('desktop');
    expect($project->projectMedia->first()->caption)->toBe('Primary cockpit viewport');

    // Cache key cleared
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});

test('duplicate slugs are rejected', function () {
    $this->actingAs($this->owner);

    $existing = Project::first();
    expect($existing)->not->toBeNull();

    $response = $this->post('/admin/projects', [
        'title' => 'Another Project',
        'slug' => $existing->slug,
        'summary' => 'Duplicate slug test project.',
        'live_url' => 'https://example.com',
        'planet_style' => 'generic',
    ]);

    $response->assertSessionHasErrors(['slug']);
});

test('invalid non-https live url is rejected', function () {
    $this->actingAs($this->owner);

    $response = $this->post('/admin/projects', [
        'title' => 'Insecure Link Project',
        'slug' => 'insecure-link-project',
        'summary' => 'Insecure HTTP link test.',
        'live_url' => 'http://insecure-domain.com',
        'planet_style' => 'generic',
    ]);

    $response->assertSessionHasErrors(['live_url']);
});

test('summary exceeding 300 characters is rejected', function () {
    $this->actingAs($this->owner);

    $longSummary = str_repeat('A', 301);

    $response = $this->post('/admin/projects', [
        'title' => 'Long Summary Project',
        'slug' => 'long-summary-project',
        'summary' => $longSummary,
        'live_url' => 'https://example.com',
        'planet_style' => 'generic',
    ]);

    $response->assertSessionHasErrors(['summary']);
});

test('all six seeded projects can be edited and saved without data loss', function () {
    $this->actingAs($this->owner);

    $seededProjects = Project::whereNull('deleted_at')->with(['tags', 'features'])->get();
    expect($seededProjects)->toHaveCount(6);

    foreach ($seededProjects as $project) {
        $editResponse = $this->get("/admin/projects/{$project->id}/edit");
        $editResponse->assertOk();

        $tagsPayload = $project->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name])->toArray();
        $featuresPayload = $project->features->map(fn ($f) => [
            'group_label' => $f->group_label,
            'text' => $f->text,
            'sort_order' => $f->sort_order,
        ])->toArray();

        $originalTitle = $project->title;
        $updatedSummary = $project->summary.' (Verified)';

        $updateResponse = $this->put("/admin/projects/{$project->id}", [
            'title' => $originalTitle,
            'slug' => $project->slug,
            'summary' => substr($updatedSummary, 0, 300),
            'description' => $project->description,
            'business_type' => $project->business_type,
            'role' => $project->role,
            'year' => $project->year,
            'live_url' => $project->live_url,
            'planet_style' => $project->planet_style,
            'accent_color' => $project->accent_color,
            'cover_media_id' => $project->cover_media_id,
            'show_live_preview' => $project->show_live_preview,
            'is_featured' => $project->is_featured,
            'is_published' => $project->is_published,
            'tags' => $tagsPayload,
            'features' => $featuresPayload,
        ]);

        $updateResponse->assertSessionHasNoErrors();
        $updateResponse->assertRedirect(route('admin.projects.index'));

        $refreshed = $project->fresh();
        expect($refreshed->title)->toBe($originalTitle);
        expect($refreshed->tags->count())->toBe($project->tags->count());
        expect($refreshed->features->count())->toBe($project->features->count());
    }
});

test('reordering persists after a reload', function () {
    $this->actingAs($this->owner);

    $projects = Project::whereNull('deleted_at')->orderBy('sort_order')->get();
    expect($projects->count())->toBeGreaterThanOrEqual(2);

    $first = $projects[0];
    $second = $projects[1];

    $response = $this->post('/admin/projects/reorder', [
        'orders' => [
            ['id' => $first->id, 'sort_order' => 5],
            ['id' => $second->id, 'sort_order' => 1],
        ],
    ]);

    $response->assertSessionHasNoErrors();

    // Verify database reload
    expect($first->fresh()->sort_order)->toBe(5);
    expect($second->fresh()->sort_order)->toBe(1);
});

test('soft deletion, restoration, and permanent deletion follow schema rules', function () {
    $this->actingAs($this->owner);

    $project = Project::whereNull('deleted_at')->first();
    expect($project)->not->toBeNull();
    $id = $project->id;
    $title = $project->title;

    // 1. Permanent delete must NOT be allowed when NOT trashed
    $prematureForceDelete = $this->delete("/admin/projects/{$id}/force-delete");
    $prematureForceDelete->assertNotFound();

    // 2. Soft delete
    Cache::put('portfolio.page.v1', 'cached_page');
    $deleteResponse = $this->delete("/admin/projects/{$id}");
    $deleteResponse->assertSessionHasNoErrors();

    $trashedProject = Project::withTrashed()->find($id);
    expect($trashedProject)->not->toBeNull();
    expect($trashedProject->trashed())->toBeTrue();
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();

    // 3. Restore
    $restoreResponse = $this->post("/admin/projects/{$id}/restore");
    $restoreResponse->assertSessionHasNoErrors();

    $restoredProject = Project::find($id);
    expect($restoredProject)->not->toBeNull();
    expect($restoredProject->trashed())->toBeFalse();

    // 4. Soft delete again, then permanent force delete
    $this->delete("/admin/projects/{$id}");
    expect(Project::onlyTrashed()->find($id))->not->toBeNull();

    $forceDeleteResponse = $this->delete("/admin/projects/{$id}/force-delete");
    $forceDeleteResponse->assertSessionHasNoErrors();

    expect(Project::withTrashed()->find($id))->toBeNull();
});

test('public project query excludes drafts and trashed projects', function () {
    $media = Media::factory()->create();

    $activePublished = Project::create([
        'title' => 'Active Orbit',
        'slug' => 'active-orbit',
        'summary' => 'Active published showcase.',
        'live_url' => 'https://active.example.com',
        'planet_style' => 'ocean',
        'is_published' => true,
        'sort_order' => 10,
    ]);

    $draftProject = Project::create([
        'title' => 'Secret Draft Orbit',
        'slug' => 'secret-draft-orbit',
        'summary' => 'Hidden draft project.',
        'live_url' => 'https://draft.example.com',
        'planet_style' => 'desert',
        'is_published' => false,
        'sort_order' => 11,
    ]);

    $trashedProject = Project::create([
        'title' => 'Decommissioned Orbit',
        'slug' => 'decommissioned-orbit',
        'summary' => 'Decommissioned soft-deleted project.',
        'live_url' => 'https://trashed.example.com',
        'planet_style' => 'rocky',
        'is_published' => true,
        'sort_order' => 12,
    ]);
    $trashedProject->delete();

    $publicProjects = Project::public()->get();

    expect($publicProjects->pluck('id')->toArray())->toContain($activePublished->id);
    expect($publicProjects->pluck('id')->toArray())->not->toContain($draftProject->id);
    expect($publicProjects->pluck('id')->toArray())->not->toContain($trashedProject->id);
});

test('owner can toggle project publish and featured status', function () {
    $this->actingAs($this->owner);

    $project = Project::whereNull('deleted_at')->first();
    expect($project)->not->toBeNull();

    $initialPublish = $project->is_published;
    $this->patch("/admin/projects/{$project->id}/toggle-publish");
    expect($project->fresh()->is_published)->toBe(! $initialPublish);

    $initialFeatured = $project->is_featured;
    $this->patch("/admin/projects/{$project->id}/toggle-featured");
    expect($project->fresh()->is_featured)->toBe(! $initialFeatured);
});
