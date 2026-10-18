<?php

use App\Models\ProcessStep;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot access process steps module', function () {
    $response = $this->get('/admin/process');
    $response->assertRedirect('/login');
});

test('owner can view process steps list', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/process');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Process/Index')
        ->has('processSteps')
    );
});

test('owner can create a new process step', function () {
    $this->actingAs($this->owner);

    Cache::put('portfolio.page.v1', 'cached_process');

    $response = $this->post('/admin/process', [
        'title' => '07 / Continuous Telemetry',
        'description' => 'Real-time performance auditing and observability after launch.',
        'is_published' => true,
    ]);

    $response->assertSessionHasNoErrors();

    $step = ProcessStep::where('title', '07 / Continuous Telemetry')->first();
    expect($step)->not->toBeNull();
    expect($step->is_published)->toBeTrue();
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});

test('owner can update a process step', function () {
    $this->actingAs($this->owner);

    $step = ProcessStep::create([
        'title' => 'QA Testing',
        'description' => 'Functional and performance verification.',
        'is_published' => true,
    ]);

    $response = $this->put("/admin/process/{$step->id}", [
        'title' => '04 / Rigorous Verification',
        'description' => 'Automated regression, security auditing and cross-browser testing.',
        'is_published' => true,
    ]);

    $response->assertSessionHasNoErrors();

    $refreshed = $step->fresh();
    expect($refreshed->title)->toBe('04 / Rigorous Verification');
});

test('owner can reorder process steps and changes persist', function () {
    $this->actingAs($this->owner);

    $steps = ProcessStep::orderBy('sort_order')->get();
    expect($steps->count())->toBeGreaterThanOrEqual(2);

    $first = $steps[0];
    $second = $steps[1];

    $response = $this->post('/admin/process/reorder', [
        'orders' => [
            ['id' => $first->id, 'sort_order' => 6],
            ['id' => $second->id, 'sort_order' => 1],
        ],
    ]);

    $response->assertSessionHasNoErrors();
    expect($first->fresh()->sort_order)->toBe(6);
    expect($second->fresh()->sort_order)->toBe(1);
});

test('owner can toggle process step publication status', function () {
    $this->actingAs($this->owner);

    $step = ProcessStep::first();
    expect($step)->not->toBeNull();

    $initialStatus = $step->is_published;
    $this->patch("/admin/process/{$step->id}/toggle-publish");
    expect($step->fresh()->is_published)->toBe(! $initialStatus);
});

test('owner can delete a process step', function () {
    $this->actingAs($this->owner);

    $step = ProcessStep::create([
        'title' => 'Unneeded Step',
        'description' => 'To be deleted.',
        'is_published' => true,
    ]);

    $id = $step->id;
    $response = $this->delete("/admin/process/{$id}");
    $response->assertSessionHasNoErrors();

    expect(ProcessStep::find($id))->toBeNull();
});
