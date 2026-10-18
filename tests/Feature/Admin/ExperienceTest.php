<?php

use App\Models\Experience;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot access experience module', function () {
    $response = $this->get('/admin/experience');
    $response->assertRedirect('/login');
});

test('owner can view experience timeline list', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/experience');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Experience/Index')
        ->has('experiences')
    );
});

test('owner can create an experience record with start and end dates', function () {
    $this->actingAs($this->owner);

    Cache::put('portfolio.page.v1', 'cached_exp');

    $response = $this->post('/admin/experience', [
        'role' => 'Senior Backend Engineer',
        'company' => 'AeroSpace Solutions Inc',
        'start_date' => '2021-03-01',
        'end_date' => '2023-08-31',
        'is_current' => false,
        'description' => 'Architected distributed event messaging and microservices.',
        'is_published' => true,
    ]);

    $response->assertSessionHasNoErrors();

    $exp = Experience::where('company', 'AeroSpace Solutions Inc')->first();
    expect($exp)->not->toBeNull();
    expect($exp->role)->toBe('Senior Backend Engineer');
    expect($exp->is_current)->toBeFalse();
    expect($exp->start_date->format('Y-m-d'))->toBe('2021-03-01');
    expect($exp->end_date->format('Y-m-d'))->toBe('2023-08-31');
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});

test('current role stores end_date as NULL when is_current is true', function () {
    $this->actingAs($this->owner);

    $response = $this->post('/admin/experience', [
        'role' => 'Principal Architect',
        'company' => 'Current Orbital Labs',
        'start_date' => '2023-09-01',
        'end_date' => '2024-01-01', // Provided but should be cleared because is_current is true
        'is_current' => true,
        'description' => 'Leading the core flight systems and telemetry engines.',
        'is_published' => true,
    ]);

    $response->assertSessionHasNoErrors();

    $exp = Experience::where('company', 'Current Orbital Labs')->first();
    expect($exp)->not->toBeNull();
    expect($exp->is_current)->toBeTrue();
    expect($exp->end_date)->toBeNull();
});

test('end date earlier than start date is rejected', function () {
    $this->actingAs($this->owner);

    $response = $this->post('/admin/experience', [
        'role' => 'Software Engineer',
        'company' => 'Time Traveler Corp',
        'start_date' => '2024-06-01',
        'end_date' => '2023-01-01', // Earlier than start date!
        'is_current' => false,
    ]);

    $response->assertSessionHasErrors(['end_date']);
});

test('owner can update an experience record', function () {
    $this->actingAs($this->owner);

    $exp = Experience::create([
        'role' => 'Frontend Developer',
        'company' => 'WebStudio',
        'start_date' => '2020-01-01',
        'end_date' => '2021-01-01',
        'is_current' => false,
        'is_published' => true,
    ]);

    $response = $this->put("/admin/experience/{$exp->id}", [
        'role' => 'Senior Frontend Developer',
        'company' => 'WebStudio Global',
        'start_date' => '2020-01-01',
        'is_current' => true, // Switch to current role
        'end_date' => '',
        'is_published' => true,
    ]);

    $response->assertSessionHasNoErrors();

    $refreshed = $exp->fresh();
    expect($refreshed->role)->toBe('Senior Frontend Developer');
    expect($refreshed->company)->toBe('WebStudio Global');
    expect($refreshed->is_current)->toBeTrue();
    expect($refreshed->end_date)->toBeNull();
});

test('owner can reorder experience timeline and changes persist', function () {
    $this->actingAs($this->owner);

    $e1 = Experience::create([
        'role' => 'Role A',
        'company' => 'Company A',
        'start_date' => '2019-01-01',
        'sort_order' => 0,
        'is_published' => true,
    ]);

    $e2 = Experience::create([
        'role' => 'Role B',
        'company' => 'Company B',
        'start_date' => '2020-01-01',
        'sort_order' => 1,
        'is_published' => true,
    ]);

    $response = $this->post('/admin/experience/reorder', [
        'orders' => [
            ['id' => $e1->id, 'sort_order' => 10],
            ['id' => $e2->id, 'sort_order' => 3],
        ],
    ]);

    $response->assertSessionHasNoErrors();
    expect($e1->fresh()->sort_order)->toBe(10);
    expect($e2->fresh()->sort_order)->toBe(3);
});

test('owner can delete an experience record', function () {
    $this->actingAs($this->owner);

    $exp = Experience::create([
        'role' => 'Temporary Role',
        'company' => 'Old Agency',
        'start_date' => '2018-01-01',
        'is_published' => true,
    ]);

    $id = $exp->id;
    $response = $this->delete("/admin/experience/{$id}");
    $response->assertSessionHasNoErrors();

    expect(Experience::find($id))->toBeNull();
});
