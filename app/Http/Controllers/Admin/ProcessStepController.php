<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderProcessStepsRequest;
use App\Http\Requests\Admin\StoreProcessStepRequest;
use App\Http\Requests\Admin\UpdateProcessStepRequest;
use App\Models\ProcessStep;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ProcessStepController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', ProcessStep::class);

        $processSteps = ProcessStep::query()->orderBy('sort_order')->get();

        return Inertia::render('Admin/Process/Index', [
            'processSteps' => $processSteps,
        ]);
    }

    public function store(StoreProcessStepRequest $request): RedirectResponse
    {
        $this->authorize('create', ProcessStep::class);

        $validated = $request->validated();

        if (! isset($validated['sort_order'])) {
            $maxOrder = (int) (ProcessStep::max('sort_order') ?? -1);
            $validated['sort_order'] = $maxOrder + 1;
        }

        ProcessStep::create($validated);

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Process step added successfully.');
    }

    public function update(UpdateProcessStepRequest $request, ProcessStep $processStep): RedirectResponse
    {
        $this->authorize('update', $processStep);

        $processStep->update($request->validated());

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Process step updated successfully.');
    }

    public function destroy(ProcessStep $processStep): RedirectResponse
    {
        $this->authorize('delete', $processStep);

        $title = $processStep->title;
        $processStep->delete();

        Cache::forget('portfolio.page.v1');

        return back()->with('success', "Process step '{$title}' removed.");
    }

    public function togglePublish(ProcessStep $processStep): RedirectResponse
    {
        $this->authorize('update', $processStep);

        $processStep->update(['is_published' => ! $processStep->is_published]);

        Cache::forget('portfolio.page.v1');

        $status = $processStep->is_published ? 'published' : 'draft';

        return back()->with('success', "Process step '{$processStep->title}' is now {$status}.");
    }

    public function reorder(ReorderProcessStepsRequest $request): RedirectResponse
    {
        $this->authorize('viewAny', ProcessStep::class);

        $orders = $request->validated()['orders'];

        foreach ($orders as $item) {
            ProcessStep::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Process steps reordered successfully.');
    }
}
