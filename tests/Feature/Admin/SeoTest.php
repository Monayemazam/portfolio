<?php

use App\Models\Media;
use App\Models\SeoMeta;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot access seo settings', function () {
    $response = $this->get('/admin/seo');
    $response->assertRedirect('/login');
});

test('owner can view seo editor with loaded home meta', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/seo');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Seo/Index')
        ->has('seo')
    );
});

test('owner can update seo metadata and values persist in seo_meta table', function () {
    $this->actingAs($this->owner);

    $media = Media::factory()->create(['type' => 'image']);
    Cache::put('portfolio.page.v1', 'cached_seo');

    $response = $this->put('/admin/seo', [
        'meta_title' => 'Monayem Azam | Elite Solutions Architect',
        'meta_description' => 'Portfolio of Monayem Azam. Full-stack engineering, high-scale architectures, and custom WebGL celestial experiences.',
        'og_image_media_id' => $media->id,
        'canonical_url' => 'https://monayem.space',
        'person_job_title' => 'Senior Solutions Architect',
        'person_same_as' => [
            'https://github.com/monayem',
            'https://linkedin.com/in/monayem',
        ],
        'robots' => 'index,follow',
    ]);

    $response->assertSessionHasNoErrors();

    $seo = SeoMeta::where('page', 'home')->first();
    expect($seo)->not->toBeNull();
    expect($seo->meta_title)->toBe('Monayem Azam | Elite Solutions Architect');
    expect($seo->meta_description)->toContain('Portfolio of Monayem Azam');
    expect($seo->person_job_title)->toBe('Senior Solutions Architect');
    expect($seo->person_same_as)->toBe([
        'https://github.com/monayem',
        'https://linkedin.com/in/monayem',
    ]);
    expect($seo->og_image_media_id)->toBe($media->id);
    expect($seo->robots)->toBe('index,follow');
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});

test('seo validation rejects title over 70 chars or description over 170 chars', function () {
    $this->actingAs($this->owner);

    $longTitle = str_repeat('T', 71);
    $longDesc = str_repeat('D', 171);

    $response = $this->put('/admin/seo', [
        'meta_title' => $longTitle,
        'meta_description' => $longDesc,
        'robots' => 'index,follow',
    ]);

    $response->assertSessionHasErrors(['meta_title', 'meta_description']);
});
