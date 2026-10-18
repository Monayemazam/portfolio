<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSeoMetaRequest;
use App\Models\SeoMeta;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SeoController extends Controller
{
    public function index(): Response
    {
        $seo = SeoMeta::query()
            ->with('ogImage')
            ->firstOrCreate(
                ['page' => 'home'],
                [
                    'meta_title' => 'Monayem Azam | Full-Stack Web Developer & Solutions Architect',
                    'meta_description' => 'Full-stack developer specialising in Laravel, React, Vue.js, and high-performance web applications.',
                    'robots' => 'index,follow',
                    'person_job_title' => 'Full-Stack Web Developer',
                    'person_same_as' => [],
                ]
            );

        $this->authorize('view', $seo);

        return Inertia::render('Admin/Seo/Index', [
            'seo' => $seo,
        ]);
    }

    public function update(UpdateSeoMetaRequest $request): RedirectResponse
    {
        $seo = SeoMeta::firstOrCreate(['page' => 'home']);
        $this->authorize('update', $seo);

        $validated = $request->validated();

        if (isset($validated['person_same_as']) && is_array($validated['person_same_as'])) {
            $validated['person_same_as'] = array_values(array_filter(
                $validated['person_same_as'],
                fn ($url) => ! empty(trim((string) $url))
            ));
        }

        $seo->update($validated);

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'SEO & Structured Data metadata updated successfully.');
    }
}
