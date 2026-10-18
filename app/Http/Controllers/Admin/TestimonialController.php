<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderTestimonialsRequest;
use App\Http\Requests\Admin\StoreTestimonialRequest;
use App\Http\Requests\Admin\UpdateTestimonialRequest;
use App\Models\Project;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Testimonial::class);

        $testimonials = Testimonial::query()
            ->with(['photo', 'project:id,title,slug'])
            ->orderBy('sort_order')
            ->get();

        $projects = Project::query()
            ->whereNull('deleted_at')
            ->orderBy('title')
            ->get(['id', 'title', 'slug']);

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => $testimonials,
            'projects' => $projects,
        ]);
    }

    public function store(StoreTestimonialRequest $request): RedirectResponse
    {
        $this->authorize('create', Testimonial::class);

        $validated = $request->validated();

        if (! isset($validated['is_published'])) {
            $validated['is_published'] = false;
        }

        if (! isset($validated['sort_order'])) {
            $maxOrder = (int) (Testimonial::max('sort_order') ?? -1);
            $validated['sort_order'] = $maxOrder + 1;
        }

        Testimonial::create($validated);

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Testimonial added (defaults to unpublished).');
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $this->authorize('update', $testimonial);

        $testimonial->update($request->validated());

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Testimonial updated successfully.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $this->authorize('delete', $testimonial);

        $author = $testimonial->author_name;
        $testimonial->delete();

        Cache::forget('portfolio.page.v1');

        return back()->with('success', "Testimonial by '{$author}' removed.");
    }

    public function togglePublish(Testimonial $testimonial): RedirectResponse
    {
        $this->authorize('update', $testimonial);

        $testimonial->update(['is_published' => ! $testimonial->is_published]);

        Cache::forget('portfolio.page.v1');

        $status = $testimonial->is_published ? 'published' : 'hidden';

        return back()->with('success', "Testimonial is now {$status}.");
    }

    public function reorder(ReorderTestimonialsRequest $request): RedirectResponse
    {
        $this->authorize('viewAny', Testimonial::class);

        $orders = $request->validated()['orders'];

        foreach ($orders as $item) {
            Testimonial::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Testimonials reordered successfully.');
    }
}
