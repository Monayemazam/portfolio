<?php

use App\Models\AboutContent;
use App\Models\HeroContent;
use App\Models\Media;
use App\Models\ProcessStep;
use App\Models\Project;
use App\Models\ProjectFeature;
use App\Models\ProjectMedia;
use App\Models\Section;
use App\Models\Service;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    $this->seed();
});

test('seed counts match database-schema.md section 10 specification', function () {
    expect(Project::count())->toBe(6)
        ->and(Section::count())->toBe(10)
        ->and(Skill::count())->toBe(10)
        ->and(Service::count())->toBe(5)
        ->and(ProcessStep::count())->toBe(6)
        ->and(User::count())->toBe(1);
});

test('every seeded project has planet_style and features', function () {
    $projects = Project::with('features')->get();

    expect($projects)->toHaveCount(6);

    foreach ($projects as $project) {
        expect($project->planet_style)->not->toBeEmpty()
            ->and($project->features->count())->toBeGreaterThan(0);
    }
});

test('hero content and roles relationship works', function () {
    $hero = HeroContent::with('roles')->first();
    expect($hero)->not->toBeNull()
        ->and($hero->roles->count())->toBe(4);

    $role = $hero->roles->first();
    expect($role->heroContent->id)->toBe($hero->id);
});

test('about content and facts relationship works', function () {
    $about = AboutContent::with('facts')->first();
    expect($about)->not->toBeNull()
        ->and($about->facts->count())->toBe(3);

    $fact = $about->facts->first();
    expect($fact->aboutContent->id)->toBe($about->id);
});

test('project relationships with tags, features, and media work', function () {
    $project = Project::with(['tags', 'features'])->first();
    expect($project)->not->toBeNull()
        ->and($project->tags->count())->toBeGreaterThan(0)
        ->and($project->features->count())->toBeGreaterThan(0);

    $tag = $project->tags->first();
    expect($tag->projects->pluck('id'))->toContain($project->id);

    $media = Media::factory()->create();
    $projectMedia = ProjectMedia::create([
        'project_id' => $project->id,
        'media_id' => $media->id,
        'kind' => 'desktop',
        'caption' => 'Screenshot',
        'sort_order' => 1,
    ]);

    expect($project->fresh()->projectMedia->pluck('id'))->toContain($projectMedia->id)
        ->and($projectMedia->media->id)->toBe($media->id);
});

test('project soft delete sets deleted_at and excludes from default queries', function () {
    $project = Project::factory()->create([
        'is_published' => true,
    ]);

    expect($project->deleted_at)->toBeNull();

    $project->delete();

    expect($project->fresh()->deleted_at)->not->toBeNull()
        ->and(Project::find($project->id))->toBeNull()
        ->and(Project::withTrashed()->find($project->id))->not->toBeNull();

    $project->restore();

    expect($project->fresh()->deleted_at)->toBeNull()
        ->and(Project::find($project->id))->not->toBeNull();

    $project->forceDelete();
});

test('deleting media in use fails at database level with foreign key restriction', function () {
    $media = Media::factory()->create();
    $project = Project::factory()->create([
        'cover_media_id' => $media->id,
    ]);

    expect(fn () => $media->delete())
        ->toThrow(QueryException::class);

    $project->cover_media_id = null;
    $project->save();

    expect($media->delete())->toBeTrue();
    $project->forceDelete();
});

test('permanent project delete cascades to features and media', function () {
    $media = Media::factory()->create();
    $project = Project::factory()->create();
    $feature = ProjectFeature::create([
        'project_id' => $project->id,
        'group_label' => 'Technical',
        'text' => 'Cascade test feature',
        'sort_order' => 1,
    ]);
    $pm = ProjectMedia::create([
        'project_id' => $project->id,
        'media_id' => $media->id,
        'kind' => 'desktop',
        'sort_order' => 1,
    ]);

    $project->forceDelete();

    expect(ProjectFeature::find($feature->id))->toBeNull()
        ->and(ProjectMedia::find($pm->id))->toBeNull()
        ->and(Media::find($media->id))->not->toBeNull();

    $media->delete();
});

test('public project query excludes drafts and soft deleted projects', function () {
    $published = Project::factory()->create([
        'is_published' => true,
        'sort_order' => 99,
    ]);
    $draft = Project::factory()->create([
        'is_published' => false,
        'sort_order' => 100,
    ]);
    $deleted = Project::factory()->create([
        'is_published' => true,
        'sort_order' => 101,
    ]);
    $deleted->delete();

    $publicProjectIds = Project::public()->pluck('id')->all();

    expect($publicProjectIds)->toContain($published->id)
        ->and($publicProjectIds)->not->toContain($draft->id)
        ->and($publicProjectIds)->not->toContain($deleted->id);

    $published->forceDelete();
    $draft->forceDelete();
    $deleted->forceDelete();
});

test('check constraint prevents skills level exceeding 100', function () {
    expect(function () {
        DB::statement("INSERT INTO skills (name, category, level, sort_order, is_published, created_at, updated_at) VALUES ('InvalidSkill', 'Test', 150, 0, 1, NOW(), NOW())");
    })->toThrow(QueryException::class);
});

test('check constraint prevents experience end date before start date', function () {
    expect(function () {
        DB::statement("INSERT INTO experiences (role, company, start_date, end_date, is_current, sort_order, is_published, created_at, updated_at) VALUES ('Dev', 'Test', '2026-01-01', '2025-01-01', 0, 0, 1, NOW(), NOW())");
    })->toThrow(QueryException::class);
});
