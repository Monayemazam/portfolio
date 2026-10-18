<?php

use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot access services module', function () {
    $response = $this->get('/admin/services');
    $response->assertRedirect('/login');
});

test('owner can view services list', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/services');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Services/Index')
        ->has('services')
    );
});

test('owner can create a new service', function () {
    $this->actingAs($this->owner);

    Cache::put('portfolio.page.v1', 'cached_page');

    $response = $this->post('/admin/services', [
        'title' => 'High-Performance API Architecture',
        'description' => 'Designing low-latency REST and GraphQL architectures with caching and queue workers.',
        'icon' => 'lni-cloud-network',
        'is_published' => true,
    ]);

    $response->assertSessionHasNoErrors();

    $service = Service::where('title', 'High-Performance API Architecture')->first();
    expect($service)->not->toBeNull();
    expect($service->icon)->toBe('lni-cloud-network');
    expect($service->is_published)->toBeTrue();
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});

test('owner can update service attributes', function () {
    $this->actingAs($this->owner);

    $service = Service::create([
        'title' => 'DevOps Automation',
        'description' => 'CI/CD pipeline architecture.',
        'icon' => 'lni-cogs',
        'is_published' => true,
    ]);

    $response = $this->put("/admin/services/{$service->id}", [
        'title' => 'DevOps & Cloud Automation',
        'description' => 'CI/CD pipelines with zero-downtime deployment strategies.',
        'icon' => 'lni-cloud-check',
        'is_published' => false,
    ]);

    $response->assertSessionHasNoErrors();

    $refreshed = $service->fresh();
    expect($refreshed->title)->toBe('DevOps & Cloud Automation');
    expect($refreshed->is_published)->toBeFalse();
});

test('owner can reorder services and changes persist', function () {
    $this->actingAs($this->owner);

    $services = Service::orderBy('sort_order')->get();
    expect($services->count())->toBeGreaterThanOrEqual(2);

    $first = $services[0];
    $second = $services[1];

    $response = $this->post('/admin/services/reorder', [
        'orders' => [
            ['id' => $first->id, 'sort_order' => 8],
            ['id' => $second->id, 'sort_order' => 2],
        ],
    ]);

    $response->assertSessionHasNoErrors();
    expect($first->fresh()->sort_order)->toBe(8);
    expect($second->fresh()->sort_order)->toBe(2);
});

test('owner can toggle service publication status', function () {
    $this->actingAs($this->owner);

    $service = Service::first();
    expect($service)->not->toBeNull();

    $initialStatus = $service->is_published;
    $this->patch("/admin/services/{$service->id}/toggle-publish");
    expect($service->fresh()->is_published)->toBe(! $initialStatus);
});

test('owner can delete a service', function () {
    $this->actingAs($this->owner);

    $service = Service::create([
        'title' => 'Temporary Service',
        'description' => 'Will be deleted.',
        'is_published' => true,
    ]);

    $id = $service->id;
    $response = $this->delete("/admin/services/{$id}");
    $response->assertSessionHasNoErrors();

    expect(Service::find($id))->toBeNull();
});

test('service validation rejects missing required fields', function () {
    $this->actingAs($this->owner);

    $response = $this->post('/admin/services', [
        'title' => '',
        'description' => '',
    ]);

    $response->assertSessionHasErrors(['title', 'description']);
});
