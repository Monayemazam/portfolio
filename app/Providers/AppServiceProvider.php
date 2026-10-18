<?php

namespace App\Providers;

use App\Models\Setting;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        View::composer('app', function ($view) {
            try {
                $settings = Cache::rememberForever('portfolio.theme_settings', function () {
                    if (! Schema::hasTable('settings')) {
                        return [];
                    }

                    return Setting::query()
                        ->whereIn('key', [
                            'default_theme',
                            'dark_primary',
                            'dark_secondary',
                            'dark_accent',
                            'light_primary',
                            'light_secondary',
                            'light_accent',
                        ])
                        ->pluck('value', 'key')
                        ->all();
                });

                $view->with('themeSettings', $settings);
            } catch (\Throwable) {
                $view->with('themeSettings', []);
            }
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
