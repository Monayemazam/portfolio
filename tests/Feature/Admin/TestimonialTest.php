<?php

use App\Models\Media;
use App\Models\Project;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot access testimonials module', function () {
    $response = $this->get('/admin/testimonials');
    $response->assertRedirect('/login');
});

test('owner can view testimonials list', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/testimonials');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Testimonials/Index')
        ->has('testimonials')
        ->has('projects')
    );
});

test('testimonials must default to unpublished upon creation', function () {
    $this->actingAs($this->owner);

    Cache::put('portfolio.page.v1', 'cached_testimonials');

    $response = $this->post('/admin/testimonials', [
        'quote' => 'Monayem delivered an exceptional high-performance portal on time and with immaculate code.',
        'author_name' => 'Dr. Marcus Vance',
        'author_role' => 'VP of Engineering',
        'company' => 'Starlight Logistics',
    ]);

    $response->assertSessionHasNoErrors();

    $testimonial = Testimonial::where('author_name', 'Dr. Marcus Vance')->first();
    expect($testimonial)->not->toBeNull();
    // Must default to unpublished
    expect($testimonial->is_published)->toBeFalse();
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});

test('unpublished testimonials are excluded from public queries', function () {
    $published = Testimonial::create([
        'quote' => 'Live public endorsement.',
        'author_name' => 'Alice Verified',
        'is_published' => true,
    ]);

    $unpublished = Testimonial::create([
        'quote' => 'Hidden draft testimonial.',
        'author_name' => 'Bob Pending',
        'is_published' => false,
    ]);

    $publicTestimonials = Testimonial::published()->get();

    expect($publicTestimonials->pluck('id')->toArray())->toContain($published->id);
    expect($publicTestimonials->pluck('id')->toArray())->not->toContain($unpublished->id);
});

test('owner can attach photo media and link project to testimonial', function () {
    $this->actingAs($this->owner);

    $media = Media::factory()->create();
    $project = Project::first();
    expect($project)->not->toBeNull();

    $response = $this->post('/admin/testimonials', [
        'quote' => 'Outstanding delivery of the Mercury Bangladesh operations platform.',
        'author_name' => 'Tariq Ahmed',
        'author_role' => 'Operations Director',
        'company' => 'Mercury BD',
        'photo_media_id' => $media->id,
        'project_id' => $project->id,
        'is_published' => true,
    ]);

    $response->assertSessionHasNoErrors();

    $testimonial = Testimonial::where('author_name', 'Tariq Ahmed')->first();
    expect($testimonial)->not->toBeNull();
    expect($testimonial->photo_media_id)->toBe($media->id);
    expect($testimonial->project_id)->toBe($project->id);
    expect($testimonial->project->title)->toBe($project->title);
});

test('owner can update testimonial and reorder', function () {
    $this->actingAs($this->owner);

    $t1 = Testimonial::create([
        'quote' => 'First review.',
        'author_name' => 'Reviewer 1',
        'sort_order' => 0,
        'is_published' => false,
    ]);

    $t2 = Testimonial::create([
        'quote' => 'Second review.',
        'author_name' => 'Reviewer 2',
        'sort_order' => 1,
        'is_published' => true,
    ]);

    // Update
    $updateResponse = $this->put("/admin/testimonials/{$t1->id}", [
        'quote' => 'Updated review text.',
        'author_name' => 'Reviewer 1 Updated',
        'author_role' => 'CEO',
        'company' => 'Acme Corp',
        'is_published' => true,
    ]);
    $updateResponse->assertSessionHasNoErrors();
    expect($t1->fresh()->author_name)->toBe('Reviewer 1 Updated');
    expect($t1->fresh()->is_published)->toBeTrue();

    // Reorder
    $reorderResponse = $this->post('/admin/testimonials/reorder', [
        'orders' => [
            ['id' => $t1->id, 'sort_order' => 5],
            ['id' => $t2->id, 'sort_order' => 0],
        ],
    ]);
    $reorderResponse->assertSessionHasNoErrors();
    expect($t1->fresh()->sort_order)->toBe(5);
    expect($t2->fresh()->sort_order)->toBe(0);
});

test('owner can delete a testimonial', function () {
    $this->actingAs($this->owner);

    $t = Testimonial::create([
        'quote' => 'Temporary testimonial.',
        'author_name' => 'To Be Removed',
        'is_published' => false,
    ]);

    $id = $t->id;
    $response = $this->delete("/admin/testimonials/{$id}");
    $response->assertSessionHasNoErrors();

    expect(Testimonial::find($id))->toBeNull();
});
