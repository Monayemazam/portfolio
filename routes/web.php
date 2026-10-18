<?php

use App\Http\Controllers\Admin\AboutController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\HeroController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\ProcessStepController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\SeoController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortfolioController::class, 'index'])->name('home');

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

        // Projects
        Route::post('projects/reorder', [ProjectController::class, 'reorder'])->name('projects.reorder');
        Route::post('projects/{id}/restore', [ProjectController::class, 'restore'])->name('projects.restore');
        Route::delete('projects/{id}/force-delete', [ProjectController::class, 'forceDelete'])->name('projects.force-delete');
        Route::patch('projects/{project}/toggle-publish', [ProjectController::class, 'togglePublish'])->name('projects.toggle-publish');
        Route::patch('projects/{project}/toggle-featured', [ProjectController::class, 'toggleFeatured'])->name('projects.toggle-featured');
        Route::resource('projects', ProjectController::class);

        // Services
        Route::post('services/reorder', [ServiceController::class, 'reorder'])->name('services.reorder');
        Route::patch('services/{service}/toggle-publish', [ServiceController::class, 'togglePublish'])->name('services.toggle-publish');
        Route::resource('services', ServiceController::class)->except(['create', 'show', 'edit']);

        // Experience
        Route::post('experience/reorder', [ExperienceController::class, 'reorder'])->name('experience.reorder');
        Route::patch('experience/{experience}/toggle-publish', [ExperienceController::class, 'togglePublish'])->name('experience.toggle-publish');
        Route::resource('experience', ExperienceController::class)->except(['create', 'show', 'edit']);

        // Process Steps
        Route::post('process/reorder', [ProcessStepController::class, 'reorder'])->name('process.reorder');
        Route::patch('process/{processStep}/toggle-publish', [ProcessStepController::class, 'togglePublish'])->name('process.toggle-publish');
        Route::resource('process', ProcessStepController::class)
            ->parameters(['process' => 'processStep'])
            ->except(['create', 'show', 'edit']);

        // Testimonials
        Route::post('testimonials/reorder', [TestimonialController::class, 'reorder'])->name('testimonials.reorder');
        Route::patch('testimonials/{testimonial}/toggle-publish', [TestimonialController::class, 'togglePublish'])->name('testimonials.toggle-publish');
        Route::resource('testimonials', TestimonialController::class)->except(['create', 'show', 'edit']);

        // SEO
        Route::get('seo', [SeoController::class, 'index'])->name('seo.index');
        Route::put('seo', [SeoController::class, 'update'])->name('seo.update');

        // Messages
        Route::get('messages', [MessageController::class, 'index'])->name('messages.index');
        Route::patch('messages/{message}/read', [MessageController::class, 'markRead'])->name('messages.read');
        Route::patch('messages/{message}/unread', [MessageController::class, 'markUnread'])->name('messages.unread');
        Route::delete('messages/{message}', [MessageController::class, 'destroy'])->name('messages.destroy');
    });
});

Route::redirect('dashboard', '/admin');

require __DIR__.'/settings.php';
