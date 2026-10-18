<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderSectionsRequest;
use App\Http\Requests\Admin\UpdateSectionRequest;
use App\Models\Section;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SectionController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Section::class);

        $sections = Section::ordered()->get();

        return Inertia::render('Admin/Sections/Index', [
            'sections' => $sections,
        ]);
    }

    public function update(UpdateSectionRequest $request, Section $section): RedirectResponse
    {
        $this->authorize('update', $section);

        $section->update($request->validated());

        Cache::forget('portfolio.page.v1');

        return back()->with('success', "Section '{$section->nav_label}' updated successfully.");
    }

    public function toggleVisibility(Section $section): RedirectResponse
    {
        $this->authorize('update', $section);

        if (in_array($section->key, ['hero', 'footer'], true) && $section->is_visible) {
            throw ValidationException::withMessages([
                'is_visible' => ["The {$section->key} section cannot be hidden."],
            ]);
        }

        $section->update(['is_visible' => ! $section->is_visible]);

        Cache::forget('portfolio.page.v1');

        $status = $section->is_visible ? 'visible' : 'hidden';

        return back()->with('success', "Section '{$section->nav_label}' is now {$status}.");
    }

    public function reorder(ReorderSectionsRequest $request): RedirectResponse
    {
        $this->authorize('viewAny', Section::class);

        $orders = $request->validated()['orders'];

        foreach ($orders as $item) {
            Section::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Sections reordered successfully.');
    }
}
