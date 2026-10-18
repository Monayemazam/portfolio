<?php

use App\Http\Controllers\Admin\AboutController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HeroController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SkillController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'owner'])->group(function () {
    Route::get('admin', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Media Library
        Route::post('media/{media}/replace', [MediaController::class, 'replace'])->name('media.replace');
        Route::resource('media', MediaController::class)
            ->parameters(['media' => 'media'])
            ->except(['create', 'show', 'edit']);

        // Settings
        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [SettingController::class, 'update'])->name('settings.update');

        // Sections
        Route::get('sections', [SectionController::class, 'index'])->name('sections.index');
        Route::put('sections/{section}', [SectionController::class, 'update'])->name('sections.update');
        Route::patch('sections/{section}/toggle-visibility', [SectionController::class, 'toggleVisibility'])->name('sections.toggle-visibility');
        Route::post('sections/reorder', [SectionController::class, 'reorder'])->name('sections.reorder');

        // Hero
        Route::get('hero', [HeroController::class, 'index'])->name('hero.index');
        Route::put('hero', [HeroController::class, 'updateContent'])->name('hero.update');
        Route::post('hero/roles', [HeroController::class, 'storeRole'])->name('hero.roles.store');
        Route::put('hero/roles/{role}', [HeroController::class, 'updateRole'])->name('hero.roles.update');
        Route::delete('hero/roles/{role}', [HeroController::class, 'destroyRole'])->name('hero.roles.destroy');
        Route::post('hero/roles/reorder', [HeroController::class, 'reorderRoles'])->name('hero.roles.reorder');

        // About
        Route::get('about', [AboutController::class, 'index'])->name('about.index');
        Route::put('about', [AboutController::class, 'updateContent'])->name('about.update');
        Route::post('about/facts', [AboutController::class, 'storeFact'])->name('about.facts.store');
        Route::put('about/facts/{fact}', [AboutController::class, 'updateFact'])->name('about.facts.update');
        Route::delete('about/facts/{fact}', [AboutController::class, 'destroyFact'])->name('about.facts.destroy');
        Route::post('about/facts/reorder', [AboutController::class, 'reorderFacts'])->name('about.facts.reorder');

        // Skills
        Route::post('skills/reorder', [SkillController::class, 'reorder'])->name('skills.reorder');
        Route::patch('skills/{skill}/toggle-publish', [SkillController::class, 'togglePublish'])->name('skills.toggle-publish');
        Route::resource('skills', SkillController::class)->except(['create', 'show', 'edit']);
    });
});

Route::redirect('dashboard', '/admin');

require __DIR__.'/settings.php';
