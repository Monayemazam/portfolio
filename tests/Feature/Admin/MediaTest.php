<?php

use App\Models\Media;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('owner can view media library index page', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/media');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Media/Index')
        ->has('media.data')
    );
});

test('uploading a jpg creates media row with webp and thumbnail on disk', function () {
    $this->actingAs($this->owner);

    $file = UploadedFile::fake()->image('space-station.jpg', 800, 600)->size(1200);

    $response = $this->post('/admin/media', [
        'file' => $file,
        'alt_text' => 'Space station in lunar orbit',
    ]);

    $response->assertSessionHasNoErrors();

    $media = Media::where('original_name', 'space-station.jpg')->first();
    expect($media)->not->toBeNull();
    expect($media->type)->toBe('image');
    expect($media->width)->toBe(800);
    expect($media->height)->toBe(600);
    expect($media->alt_text)->toBe('Space station in lunar orbit');
    expect($media->webp_path)->not->toBeNull();
    expect($media->thumb_path)->not->toBeNull();

    // Verify files exist in storage
    Storage::disk('public')->assertExists($media->path);
    Storage::disk('public')->assertExists($media->webp_path);
    Storage::disk('public')->assertExists($media->thumb_path);
});

test('upload rejects images larger than 5 mb', function () {
    $this->actingAs($this->owner);

    $file = UploadedFile::fake()->image('giant-galaxy.png')->size(6000); // 6 MB

    $response = $this->post('/admin/media', [
        'file' => $file,
    ]);

    $response->assertSessionHasErrors('file');
});

test('media metadata can be updated', function () {
    $this->actingAs($this->owner);

    $media = Media::factory()->create([
        'original_name' => 'original.jpg',
        'alt_text' => 'Old alt text',
    ]);

    $response = $this->put("/admin/media/{$media->id}", [
        'original_name' => 'updated-satellite.jpg',
        'alt_text' => 'Deep space probe satellite',
    ]);

    $response->assertSessionHasNoErrors();
    $media->refresh();

    expect($media->original_name)->toBe('updated-satellite.jpg');
    expect($media->alt_text)->toBe('Deep space probe satellite');
});

test('media file can be replaced while preserving record id', function () {
    $this->actingAs($this->owner);

    $oldFile = UploadedFile::fake()->image('first.jpg', 400, 400);
    $this->post('/admin/media', ['file' => $oldFile]);
    $media = Media::where('original_name', 'first.jpg')->firstOrFail();
    $oldPath = $media->path;

    $newFile = UploadedFile::fake()->image('second.png', 1000, 800);
    $response = $this->post("/admin/media/{$media->id}/replace", [
        'file' => $newFile,
    ]);

    $response->assertSessionHasNoErrors();
    $media->refresh();

    expect($media->original_name)->toBe('second.png');
    expect($media->width)->toBe(1000);
    expect($media->height)->toBe(800);
    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists($media->path);
});

test('deleting referenced media is rejected with 422 and explanatory message', function () {
    $this->actingAs($this->owner);

    $file = UploadedFile::fake()->image('cover.jpg', 600, 400);
    $this->post('/admin/media', ['file' => $file]);
    $media = Media::where('original_name', 'cover.jpg')->firstOrFail();

    // Reference the media in a project cover
    $project = Project::factory()->create(['cover_media_id' => $media->id]);

    $response = $this->delete("/admin/media/{$media->id}");

    $response->assertSessionHasErrors('media');
    $this->assertDatabaseHas('media', ['id' => $media->id]);
});

test('deleting unused media removes row and all files from disk', function () {
    $this->actingAs($this->owner);

    $file = UploadedFile::fake()->image('unused.jpg', 500, 500);
    $this->post('/admin/media', ['file' => $file]);
    $media = Media::where('original_name', 'unused.jpg')->firstOrFail();

    $path = $media->path;
    $webpPath = $media->webp_path;
    $thumbPath = $media->thumb_path;

    Storage::disk('public')->assertExists($path);

    $response = $this->delete("/admin/media/{$media->id}");

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('media', ['id' => $media->id]);

    Storage::disk('public')->assertMissing($path);
    if ($webpPath) {
        Storage::disk('public')->assertMissing($webpPath);
    }
    if ($thumbPath) {
        Storage::disk('public')->assertMissing($thumbPath);
    }
});

test('media actions clear portfolio page cache key', function () {
    $this->actingAs($this->owner);
    Cache::put('portfolio.page.v1', 'cached-content', 3600);

    $file = UploadedFile::fake()->image('cache-test.jpg', 300, 300);
    $this->post('/admin/media', ['file' => $file]);

    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});
