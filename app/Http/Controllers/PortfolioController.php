<?php

namespace App\Http\Controllers;

use App\Models\AboutContent;
use App\Models\Experience;
use App\Models\HeroContent;
use App\Models\Media;
use App\Models\ProcessStep;
use App\Models\Project;
use App\Models\Section;
use App\Models\SeoMeta;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Skill;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    /**
     * Display the public portfolio page.
     */
    public function index(Request $request): Response
    {
        $portfolioData = Cache::rememberForever('portfolio.page.v1', function () {
            // Eager load testimonials first to know if any are published
            $testimonials = Testimonial::query()
                ->published()
                ->ordered()
                ->with(['photo', 'project'])
                ->get();

            // Sections in database sort_order, respecting is_visible
            // Hide testimonials automatically when no testimonial is published
            $hasTestimonials = $testimonials->isNotEmpty();
            $sections = Section::query()
                ->ordered()
                ->get()
                ->filter(function (Section $section) use ($hasTestimonials) {
                    if ($section->key === 'testimonials' && ! $hasTestimonials) {
                        return false;
                    }

                    if (in_array($section->key, ['hero', 'footer'], true)) {
                        return true;
                    }

                    return (bool) $section->is_visible;
                })
                ->values();

            $hero = HeroContent::query()
                ->with(['roles' => fn ($query) => $query->ordered()])
                ->first();

            $about = AboutContent::query()
                ->with(['facts' => fn ($query) => $query->ordered()])
                ->first();

            $skills = Skill::query()
                ->published()
                ->ordered()
                ->get();

            $projects = Project::query()
                ->published()
                ->ordered()
                ->with([
                    'coverMedia',
                    'tags',
                    'features',
                    'media',
                ])
                ->get();

            $services = Service::query()
                ->published()
                ->ordered()
                ->get();

            $experiences = Experience::query()
                ->published()
                ->ordered()
                ->get();

            $processSteps = ProcessStep::query()
                ->published()
                ->ordered()
                ->get();

            $settingsRows = Setting::query()->get();
            $settingsMap = $settingsRows->pluck('value', 'key')->all();

            // Resolve Media relations for key settings
            $mediaIds = array_values(array_filter([
                $settingsMap['logo_media_id'] ?? null,
                $settingsMap['favicon_media_id'] ?? null,
                $settingsMap['photo_media_id'] ?? null,
                $settingsMap['resume_media_id'] ?? null,
            ]));

            $mediaItems = ! empty($mediaIds)
                ? Media::query()->whereIn('id', $mediaIds)->get()->keyBy('id')
                : collect();

            $settings = [
                ...$settingsMap,
                'logo_media' => isset($settingsMap['logo_media_id']) && $mediaItems->has((int) $settingsMap['logo_media_id'])
                    ? $mediaItems->get((int) $settingsMap['logo_media_id'])?->toArray()
                    : null,
                'favicon_media' => isset($settingsMap['favicon_media_id']) && $mediaItems->has((int) $settingsMap['favicon_media_id'])
                    ? $mediaItems->get((int) $settingsMap['favicon_media_id'])?->toArray()
                    : null,
                'photo_media' => isset($settingsMap['photo_media_id']) && $mediaItems->has((int) $settingsMap['photo_media_id'])
                    ? $mediaItems->get((int) $settingsMap['photo_media_id'])?->toArray()
                    : null,
                'resume_media' => isset($settingsMap['resume_media_id']) && $mediaItems->has((int) $settingsMap['resume_media_id'])
                    ? $mediaItems->get((int) $settingsMap['resume_media_id'])?->toArray()
                    : null,
            ];

            $seo = SeoMeta::query()
                ->where('page', 'home')
                ->with('ogImage')
                ->first();

            return [
                'sections' => $sections->map(fn (Section $s) => $s->toArray())->values()->all(),
                'hero' => $hero?->toArray(),
                'about' => $about?->toArray(),
                'skills' => $skills->map(fn (Skill $s) => $s->toArray())->values()->all(),
                'projects' => $projects->map(fn (Project $p) => $p->toArray())->values()->all(),
                'services' => $services->map(fn (Service $s) => $s->toArray())->values()->all(),
                'experiences' => $experiences->map(fn (Experience $e) => $e->toArray())->values()->all(),
                'processSteps' => $processSteps->map(fn (ProcessStep $p) => $p->toArray())->values()->all(),
                'testimonials' => $testimonials->map(fn (Testimonial $t) => $t->toArray())->values()->all(),
                'settings' => $settings,
                'seo' => $seo?->toArray(),
            ];
        });

        return Inertia::render('Portfolio/Index', $portfolioData);
    }
}
