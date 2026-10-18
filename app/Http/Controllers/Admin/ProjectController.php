<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderProjectsRequest;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Models\Project;
use App\Models\ProjectFeature;
use App\Models\ProjectMedia;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Project::class);

        $status = $request->query('status', 'all');
        $search = $request->query('q');

        $query = match ($status) {
            'trash' => Project::onlyTrashed(),
            'published' => Project::whereNull('deleted_at')->published(),
            'draft' => Project::whereNull('deleted_at')->where('is_published', false),
            default => Project::whereNull('deleted_at'),
        };

        if ($search) {
            $query->where(function ($sub) use ($search) {
                $sub->where('title', 'like', "%{$search}%")
                    ->orWhere('summary', 'like', "%{$search}%")
                    ->orWhere('business_type', 'like', "%{$search}%");
            });
        }

        $projects = $query->with(['coverMedia', 'tags' => fn ($q) => $q->orderBy('project_tag.sort_order')])
            ->orderBy('sort_order')
            ->get();

        $counts = [
            'all' => Project::whereNull('deleted_at')->count(),
            'published' => Project::whereNull('deleted_at')->published()->count(),
            'draft' => Project::whereNull('deleted_at')->where('is_published', false)->count(),
            'trash' => Project::onlyTrashed()->count(),
        ];

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'status' => $status,
            'search' => $search ?? '',
            'counts' => $counts,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Project::class);

        $availableTags = Tag::orderBy('name')->get();

        return Inertia::render('Admin/Projects/Form', [
            'project' => null,
            'availableTags' => $availableTags,
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $this->authorize('create', Project::class);

        $validated = $request->validated();

        DB::transaction(function () use ($validated, &$project) {
            $projectData = collect($validated)->except(['tags', 'features', 'media'])->toArray();

            if (! isset($projectData['sort_order'])) {
                $maxOrder = (int) (Project::whereNull('deleted_at')->max('sort_order') ?? -1);
                $projectData['sort_order'] = $maxOrder + 1;
            }

            /** @var Project $project */
            $project = Project::create($projectData);

            // Save tags
            if (! empty($validated['tags'])) {
                $tagSyncData = [];
                foreach ($validated['tags'] as $idx => $tagItem) {
                    $tagId = $tagItem['id'] ?? null;
                    if (! $tagId && ! empty($tagItem['name'])) {
                        $tag = Tag::firstOrCreate(
                            ['name' => $tagItem['name']],
                            ['slug' => Str::slug($tagItem['name'])]
                        );
                        $tagId = $tag->id;
                    }
                    if ($tagId) {
                        $tagSyncData[$tagId] = ['sort_order' => $tagItem['sort_order'] ?? $idx];
                    }
                }
                $project->tags()->sync($tagSyncData);
            }

            // Save features
            if (! empty($validated['features'])) {
                foreach ($validated['features'] as $idx => $feat) {
                    ProjectFeature::create([
                        'project_id' => $project->id,
                        'group_label' => $feat['group_label'] ?? 'General',
                        'text' => $feat['text'],
                        'sort_order' => $feat['sort_order'] ?? $idx,
                    ]);
                }
            }

            // Save media
            if (! empty($validated['media'])) {
                foreach ($validated['media'] as $idx => $med) {
                    ProjectMedia::create([
                        'project_id' => $project->id,
                        'media_id' => $med['media_id'],
                        'kind' => $med['kind'] ?? 'desktop',
                        'caption' => $med['caption'] ?? null,
                        'sort_order' => $med['sort_order'] ?? $idx,
                    ]);
                }
            }
        });

        Cache::forget('portfolio.page.v1');

        return redirect()->route('admin.projects.index')->with('success', "Project '{$project->title}' created successfully.");
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        $project->load([
            'coverMedia',
            'tags' => fn ($q) => $q->orderBy('project_tag.sort_order'),
            'features' => fn ($q) => $q->orderBy('sort_order'),
            'projectMedia' => fn ($q) => $q->with('media')->orderBy('sort_order'),
        ]);

        $availableTags = Tag::orderBy('name')->get();

        return Inertia::render('Admin/Projects/Form', [
            'project' => $project,
            'availableTags' => $availableTags,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $project) {
            $projectData = collect($validated)->except(['tags', 'features', 'media'])->toArray();
            $project->update($projectData);

            // Sync tags
            $tagSyncData = [];
            if (! empty($validated['tags'])) {
                foreach ($validated['tags'] as $idx => $tagItem) {
                    $tagId = $tagItem['id'] ?? null;
                    if (! $tagId && ! empty($tagItem['name'])) {
                        $tag = Tag::firstOrCreate(
                            ['name' => $tagItem['name']],
                            ['slug' => Str::slug($tagItem['name'])]
                        );
                        $tagId = $tag->id;
                    }
                    if ($tagId) {
                        $tagSyncData[$tagId] = ['sort_order' => $tagItem['sort_order'] ?? $idx];
                    }
                }
            }
            $project->tags()->sync($tagSyncData);

            // Sync features
            $project->features()->delete();
            if (! empty($validated['features'])) {
                foreach ($validated['features'] as $idx => $feat) {
                    ProjectFeature::create([
                        'project_id' => $project->id,
                        'group_label' => $feat['group_label'] ?? 'General',
                        'text' => $feat['text'],
                        'sort_order' => $feat['sort_order'] ?? $idx,
                    ]);
                }
            }

            // Sync media
            $project->projectMedia()->delete();
            if (! empty($validated['media'])) {
                foreach ($validated['media'] as $idx => $med) {
                    ProjectMedia::create([
                        'project_id' => $project->id,
                        'media_id' => $med['media_id'],
                        'kind' => $med['kind'] ?? 'desktop',
                        'caption' => $med['caption'] ?? null,
                        'sort_order' => $med['sort_order'] ?? $idx,
                    ]);
                }
            }
        });

        Cache::forget('portfolio.page.v1');

        return redirect()->route('admin.projects.index')->with('success', "Project '{$project->title}' updated successfully.");
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        Cache::forget('portfolio.page.v1');

        return back()->with('success', "Project '{$project->title}' moved to trash.");
    }

    public function restore(int $id): RedirectResponse
    {
        $project = Project::onlyTrashed()->findOrFail($id);
        $this->authorize('restore', $project);

        $project->restore();

        Cache::forget('portfolio.page.v1');

        return back()->with('success', "Project '{$project->title}' restored successfully.");
    }

    public function forceDelete(int $id): RedirectResponse
    {
        $project = Project::onlyTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $project);

        $title = $project->title;
        $project->forceDelete();

        Cache::forget('portfolio.page.v1');

        return back()->with('success', "Project '{$title}' permanently deleted.");
    }

    public function togglePublish(Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $project->update(['is_published' => ! $project->is_published]);

        Cache::forget('portfolio.page.v1');

        $status = $project->is_published ? 'published' : 'draft';

        return back()->with('success', "Project '{$project->title}' is now {$status}.");
    }

    public function toggleFeatured(Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $project->update(['is_featured' => ! $project->is_featured]);

        Cache::forget('portfolio.page.v1');

        $status = $project->is_featured ? 'featured' : 'standard';

        return back()->with('success', "Project '{$project->title}' is now {$status}.");
    }

    public function reorder(ReorderProjectsRequest $request): RedirectResponse
    {
        $this->authorize('viewAny', Project::class);

        $orders = $request->validated()['orders'];

        foreach ($orders as $item) {
            Project::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Projects reordered successfully.');
    }
}
