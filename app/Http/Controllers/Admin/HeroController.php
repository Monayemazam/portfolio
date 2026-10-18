<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderHeroRolesRequest;
use App\Http\Requests\Admin\StoreHeroRoleRequest;
use App\Http\Requests\Admin\UpdateHeroContentRequest;
use App\Http\Requests\Admin\UpdateHeroRoleRequest;
use App\Models\HeroContent;
use App\Models\HeroRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HeroController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', HeroContent::class);

        $hero = HeroContent::with(['roles' => fn ($q) => $q->ordered()])->first();

        if (! $hero) {
            $hero = HeroContent::create([
                'eyebrow' => 'MISSION 01 / LAUNCH',
                'name' => 'Monayem Azam',
                'primary_button_label' => 'View projects',
                'primary_button_url' => '#projects',
                'secondary_button_label' => 'Hire me',
                'secondary_button_url' => '#contact',
            ]);
            $hero->load(['roles' => fn ($q) => $q->ordered()]);
        }

        return Inertia::render('Admin/Hero/Index', [
            'hero' => $hero,
        ]);
    }

    public function updateContent(UpdateHeroContentRequest $request): RedirectResponse
    {
        $this->authorize('update', HeroContent::class);

        $hero = HeroContent::firstOrFail();
        $hero->update($request->validated());

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Hero content updated successfully.');
    }

    public function storeRole(StoreHeroRoleRequest $request): RedirectResponse
    {
        $this->authorize('update', HeroContent::class);

        $hero = HeroContent::firstOrFail();
        $validated = $request->validated();

        if (! isset($validated['sort_order'])) {
            $maxOrder = (int) ($hero->roles()->max('sort_order') ?? -1);
            $validated['sort_order'] = $maxOrder + 1;
        }

        $hero->roles()->create($validated);

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Hero role added.');
    }

    public function updateRole(UpdateHeroRoleRequest $request, HeroRole $role): RedirectResponse
    {
        $this->authorize('update', HeroContent::class);

        $role->update($request->validated());

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Hero role updated.');
    }

    public function destroyRole(HeroRole $role): RedirectResponse
    {
        $this->authorize('update', HeroContent::class);

        $role->delete();

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Hero role deleted.');
    }

    public function reorderRoles(ReorderHeroRolesRequest $request): RedirectResponse
    {
        $this->authorize('update', HeroContent::class);

        $orders = $request->validated()['orders'];

        foreach ($orders as $item) {
            HeroRole::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('portfolio.page.v1');

        return back()->with('success', 'Hero roles reordered successfully.');
    }
}
