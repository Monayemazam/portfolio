<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderExperiencesRequest;
use App\Http\Requests\Admin\StoreExperienceRequest;
use App\Http\Requests\Admin\UpdateExperienceRequest;
use App\Models\Experience;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ExperienceController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Experience::class);

        $experiences = Experience::query()->orderBy('sort_order')->get();

        return Inertia::render('Admin/Experience/Index', [
            'experiences' => $experiences,
        ]);
    }

    public function store(StoreExperienceRequest $request): RedirectResponse
    {
        $this->authorize('create', Experience::class);

        $validated = $request->validated();

        if (! empty($validated['is_current'])) {
            $validated['end_date'] = null;
        }

        if (! isset($validated['sort_order'])) {
            $maxOrder = (int) (Experience::max('sort_order') ?? -1);
            $validated['sort_order'] = $maxOrder + 1;
        }

        Experience::create($validated);

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Experience record added successfully.');
    }

    public function update(UpdateExperienceRequest $request, Experience $experience): RedirectResponse
    {
        $this->authorize('update', $experience);

        $validated = $request->validated();

        if (! empty($validated['is_current'])) {
            $validated['end_date'] = null;
        }

        $experience->update($validated);

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Experience record updated successfully.');
    }

    public function destroy(Experience $experience): RedirectResponse
    {
        $this->authorize('delete', $experience);

        $role = $experience->role;
        $company = $experience->company;
        $experience->delete();

        Cache::forget('portfolio.page.v1');

        return back()->with('success', "Experience '{$role} at {$company}' removed.");
    }

    public function togglePublish(Experience $experience): RedirectResponse
    {
        $this->authorize('update', $experience);

        $experience->update(['is_published' => ! $experience->is_published]);

        Cache::forget('portfolio.page.v1');

        $status = $experience->is_published ? 'published' : 'draft';

        return back()->with('success', "Experience entry is now {$status}.");
    }

    public function reorder(ReorderExperiencesRequest $request): RedirectResponse
    {
        $this->authorize('viewAny', Experience::class);

        $orders = $request->validated()['orders'];

        foreach ($orders as $item) {
            Experience::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Experience timeline reordered successfully.');
    }
}
