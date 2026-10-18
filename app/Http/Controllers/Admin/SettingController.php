<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\Media;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Setting::class);

        $settings = Setting::all();

        // Collect media ids referenced in settings
        $mediaIds = $settings->where('type', 'media')
            ->pluck('value')
            ->filter()
            ->map(fn ($val) => (int) $val)
            ->unique()
            ->values();

        $mediaItems = Media::whereIn('id', $mediaIds)->get()->keyBy('id');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'mediaItems' => $mediaItems,
        ]);
    }

    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $settingsInput = $validated['settings'] ?? [];

        foreach ($settingsInput as $key => $value) {
            Setting::where('key', $key)->update([
                'value' => $value !== null ? (string) $value : null,
            ]);
        }

        Cache::forget('portfolio.page.v1');
        Cache::forget('portfolio.theme_settings');

        return back()->with('success', 'Settings updated successfully.');
    }
}
