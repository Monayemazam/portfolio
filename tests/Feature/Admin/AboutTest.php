<?php

use App\Models\AboutContent;
use App\Models\AboutFact;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot access about module', function () {
    $response = $this->get('/admin/about');
    $response->assertRedirect('/login');
});

test('owner can view about module', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/about');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/About/Index')
        ->has('about')
    );
});

test('owner can update about content', function () {
    $this->actingAs($this->owner);

    Cache::put('portfolio.page.v1', 'cached_about');

    $response = $this->put('/admin/about', [
        'heading' => 'Mission Specialist / Monayem Azam',
        'bio' => 'Senior full-stack engineer with expertise in mission-critical applications and spatial design.',
    ]);

    $response->assertSessionHasNoErrors();

    $about = AboutContent::firstOrFail();
    expect($about->heading)->toBe('Mission Specialist / Monayem Azam');
    expect($about->bio)->toContain('Senior full-stack engineer');
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});

test('owner can create, update, reorder and delete facts and counters', function () {
    $this->actingAs($this->owner);

    // 1. Create counter
    $createCounter = $this->post('/admin/about/facts', [
        'kind' => 'counter',
        'label' => 'Production Web Builds',
        'value' => '40',
        'suffix' => '+',
    ]);
    $createCounter->assertSessionHasNoErrors();

    $counter = AboutFact::where('label', 'Production Web Builds')->first();
    expect($counter)->not->toBeNull();
    expect($counter->kind)->toBe('counter');
    expect($counter->suffix)->toBe('+');

    // 2. Create fact
    $createFact = $this->post('/admin/about/facts', [
        'kind' => 'fact',
        'label' => 'Orbital Base',
        'value' => 'Dhaka, Bangladesh',
    ]);
    $createFact->assertSessionHasNoErrors();

    $fact = AboutFact::where('label', 'Orbital Base')->first();
    expect($fact)->not->toBeNull();
    expect($fact->kind)->toBe('fact');

    // 3. Update item
    $updateFact = $this->put("/admin/about/facts/{$fact->id}", [
        'kind' => 'fact',
        'label' => 'Orbital Base',
        'value' => 'Worldwide Remote',
        'suffix' => null,
    ]);
    $updateFact->assertSessionHasNoErrors();
    expect($fact->fresh()->value)->toBe('Worldwide Remote');

    // 4. Reorder
    $reorder = $this->post('/admin/about/facts/reorder', [
        'orders' => [
            ['id' => $fact->id, 'sort_order' => 0],
            ['id' => $counter->id, 'sort_order' => 1],
        ],
    ]);
    $reorder->assertSessionHasNoErrors();
    expect($fact->fresh()->sort_order)->toBe(0);
    expect($counter->fresh()->sort_order)->toBe(1);

    // 5. Delete
    $delete = $this->delete("/admin/about/facts/{$fact->id}");
    $delete->assertSessionHasNoErrors();
    expect(AboutFact::find($fact->id))->toBeNull();
});

test('about rejects invalid inputs', function () {
    $this->actingAs($this->owner);

    // Empty bio
    $response = $this->put('/admin/about', [
        'heading' => 'Test Heading',
        'bio' => '',
    ]);
    $response->assertSessionHasErrors(['bio']);

    // Invalid kind
    $responseFact = $this->post('/admin/about/facts', [
        'kind' => 'invalid_kind',
        'label' => 'Test',
        'value' => '123',
    ]);
    $responseFact->assertSessionHasErrors(['kind']);
});
