<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderSkillsRequest;
use App\Http\Requests\Admin\StoreSkillRequest;
use App\Http\Requests\Admin\UpdateSkillRequest;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SkillController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Skill::class);

        $skills = Skill::ordered()->get();
        $categories = Skill::select('category')->distinct()->pluck('category')->values();

        return Inertia::render('Admin/Skills/Index', [
            'skills' => $skills,
            'categories' => $categories,
        ]);
    }

    public function store(StoreSkillRequest $request): RedirectResponse
    {
        $this->authorize('create', Skill::class);

        $validated = $request->validated();

        if (! isset($validated['sort_order'])) {
            $maxOrder = (int) (Skill::where('category', $validated['category'])->max('sort_order') ?? -1);
            $validated['sort_order'] = $maxOrder + 1;
        }

        if (! isset($validated['is_published'])) {
            $validated['is_published'] = true;
        }

        Skill::create($validated);

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Skill created successfully.');
    }

    public function update(UpdateSkillRequest $request, Skill $skill): RedirectResponse
    {
        $this->authorize('update', $skill);

        $skill->update($request->validated());

        Cache::forget('portfolio.page.v1');

        return back()->with('success', "Skill '{$skill->name}' updated.");
    }

    public function destroy(Skill $skill): RedirectResponse
    {
        $this->authorize('delete', $skill);

        $skill->delete();

        Cache::forget('portfolio.page.v1');

        return back()->with('success', "Skill '{$skill->name}' deleted.");
    }

    public function togglePublish(Skill $skill): RedirectResponse
    {
        $this->authorize('update', $skill);

        $skill->update(['is_published' => ! $skill->is_published]);

        Cache::forget('portfolio.page.v1');

        $status = $skill->is_published ? 'published' : 'draft';

        return back()->with('success', "Skill '{$skill->name}' is now {$status}.");
    }

    public function reorder(ReorderSkillsRequest $request): RedirectResponse
    {
        $this->authorize('viewAny', Skill::class);

        $orders = $request->validated()['orders'];

        foreach ($orders as $item) {
            Skill::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Skills reordered successfully.');
    }
}
