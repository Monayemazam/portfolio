<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderServicesRequest;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Service::class);

        $services = Service::query()->orderBy('sort_order')->get();

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
        ]);
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $this->authorize('create', Service::class);

        $validated = $request->validated();

        if (! isset($validated['sort_order'])) {
            $maxOrder = (int) (Service::max('sort_order') ?? -1);
            $validated['sort_order'] = $maxOrder + 1;
        }

        Service::create($validated);

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Service created successfully.');
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $this->authorize('update', $service);

        $service->update($request->validated());

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Service updated successfully.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $this->authorize('delete', $service);

        $title = $service->title;
        $service->delete();

        Cache::forget('portfolio.page.v1');

        return back()->with('success', "Service '{$title}' deleted successfully.");
    }

    public function togglePublish(Service $service): RedirectResponse
    {
        $this->authorize('update', $service);

        $service->update(['is_published' => ! $service->is_published]);

        Cache::forget('portfolio.page.v1');

        $status = $service->is_published ? 'published' : 'draft';

        return back()->with('success', "Service '{$service->title}' is now {$status}.");
    }

    public function reorder(ReorderServicesRequest $request): RedirectResponse
    {
        $this->authorize('viewAny', Service::class);

        $orders = $request->validated()['orders'];

        foreach ($orders as $item) {
            Service::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Services reordered successfully.');
    }
}
