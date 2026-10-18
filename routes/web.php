<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MediaController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'owner'])->group(function () {
    Route::get('admin', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::post('media/{media}/replace', [MediaController::class, 'replace'])->name('media.replace');
        Route::resource('media', MediaController::class)
            ->parameters(['media' => 'media'])
            ->except(['create', 'show', 'edit']);
    });
});

Route::redirect('dashboard', '/admin');

require __DIR__.'/settings.php';
