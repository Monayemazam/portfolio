<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderAboutFactsRequest;
use App\Http\Requests\Admin\StoreAboutFactRequest;
use App\Http\Requests\Admin\UpdateAboutContentRequest;
use App\Http\Requests\Admin\UpdateAboutFactRequest;
use App\Models\AboutContent;
use App\Models\AboutFact;
use App\Models\Media;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', AboutContent::class);

        $about = AboutContent::with(['facts' => fn ($q) => $q->ordered()])->first();

        if (! $about) {
            $about = AboutContent::create([
                'heading' => 'Mission Specialist / About Monayem',
                'bio' => 'Full-stack developer with 5+ years building fast, accessible web applications.',
            ]);
            $about->load(['facts' => fn ($q) => $q->ordered()]);
        }

        $photoMediaId = Setting::where('key', 'photo_media_id')->value('value');
        $resumeMediaId = Setting::where('key', 'resume_media_id')->value('value');

        $photoMedia = $photoMediaId ? Media::find((int) $photoMediaId) : null;
        $resumeMedia = $resumeMediaId ? Media::find((int) $resumeMediaId) : null;

        return Inertia::render('Admin/About/Index', [
            'about' => $about,
            'photoMedia' => $photoMedia,
            'resumeMedia' => $resumeMedia,
        ]);
    }

    public function updateContent(UpdateAboutContentRequest $request): RedirectResponse
    {
        $this->authorize('update', AboutContent::class);

        $about = AboutContent::firstOrFail();
        $about->update($request->validated());

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'About content updated successfully.');
    }

    public function storeFact(StoreAboutFactRequest $request): RedirectResponse
    {
        $this->authorize('update', AboutContent::class);

        $about = AboutContent::firstOrFail();
        $validated = $request->validated();

        if (! isset($validated['sort_order'])) {
            $maxOrder = (int) ($about->facts()->max('sort_order') ?? -1);
            $validated['sort_order'] = $maxOrder + 1;
        }

        $about->facts()->create($validated);

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'About fact/counter added.');
    }

    public function updateFact(UpdateAboutFactRequest $request, AboutFact $fact): RedirectResponse
    {
        $this->authorize('update', AboutContent::class);

        $fact->update($request->validated());

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'About fact/counter updated.');
    }

    public function destroyFact(AboutFact $fact): RedirectResponse
    {
        $this->authorize('update', AboutContent::class);

        $fact->delete();

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'About fact/counter deleted.');
    }

    public function reorderFacts(ReorderAboutFactsRequest $request): RedirectResponse
    {
        $this->authorize('update', AboutContent::class);

        $orders = $request->validated()['orders'];

        foreach ($orders as $item) {
            AboutFact::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'About facts reordered successfully.');
    }
}
