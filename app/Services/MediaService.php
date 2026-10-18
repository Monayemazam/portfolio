<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class MediaService
{
    private ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver);
    }

    /**
     * Store an uploaded file, process images (WebP & thumbnails), and create a Media record.
     */
    public function store(UploadedFile $file, ?string $altText = null): Media
    {
        $disk = 'public';
        $originalName = $file->getClientOriginalName();
        $mime = $file->getMimeType() ?: 'application/octet-stream';
        $sizeBytes = $file->getSize();

        $type = $this->determineMediaType($mime, $originalName);

        $dateDir = 'media/'.date('Y/m');
        $originalPath = $file->store($dateDir, $disk);

        if (! $originalPath) {
            throw new \RuntimeException('Failed to store uploaded file.');
        }

        $webpPath = null;
        $thumbPath = null;
        $width = null;
        $height = null;

        if ($type === 'image') {
            $imageMeta = $this->processImage($disk, $originalPath, $mime);
            $webpPath = $imageMeta['webp_path'];
            $thumbPath = $imageMeta['thumb_path'];
            $width = $imageMeta['width'];
            $height = $imageMeta['height'];
        }

        $media = Media::create([
            'disk' => $disk,
            'path' => $originalPath,
            'webp_path' => $webpPath,
            'thumb_path' => $thumbPath,
            'original_name' => $originalName,
            'mime' => $mime,
            'type' => $type,
            'size_bytes' => $sizeBytes,
            'width' => $width,
            'height' => $height,
            'duration_seconds' => null,
            'alt_text' => $altText,
        ]);

        $this->clearPageCache();

        return $media;
    }

    /**
     * Replace an existing media record's file with a new file.
     */
    public function replace(Media $media, UploadedFile $newFile): Media
    {
        // Remove old files
        $this->deletePhysicalFiles($media);

        $disk = 'public';
        $originalName = $newFile->getClientOriginalName();
        $mime = $newFile->getMimeType() ?: 'application/octet-stream';
        $sizeBytes = $newFile->getSize();
        $type = $this->determineMediaType($mime, $originalName);

        $dateDir = 'media/'.date('Y/m');
        $originalPath = $newFile->store($dateDir, $disk);

        if (! $originalPath) {
            throw new \RuntimeException('Failed to store replacement file.');
        }

        $webpPath = null;
        $thumbPath = null;
        $width = null;
        $height = null;

        if ($type === 'image') {
            $imageMeta = $this->processImage($disk, $originalPath, $mime);
            $webpPath = $imageMeta['webp_path'];
            $thumbPath = $imageMeta['thumb_path'];
            $width = $imageMeta['width'];
            $height = $imageMeta['height'];
        }

        $media->update([
            'disk' => $disk,
            'path' => $originalPath,
            'webp_path' => $webpPath,
            'thumb_path' => $thumbPath,
            'original_name' => $originalName,
            'mime' => $mime,
            'type' => $type,
            'size_bytes' => $sizeBytes,
            'width' => $width,
            'height' => $height,
        ]);

        $this->clearPageCache();

        return $media->fresh();
    }

    /**
     * Update metadata for a media record.
     *
     * @param  array{alt_text?: string|null, original_name?: string}  $data
     */
    public function update(Media $media, array $data): Media
    {
        $media->update(array_filter([
            'alt_text' => $data['alt_text'] ?? $media->alt_text,
            'original_name' => $data['original_name'] ?? $media->original_name,
        ], fn ($val) => $val !== null));

        $this->clearPageCache();

        return $media->fresh();
    }

    /**
     * Delete a media item if it is not in use.
     *
     * @throws ValidationException
     */
    public function delete(Media $media): bool
    {
        $breakdown = $media->getReferencesBreakdown();

        if (count($breakdown) > 0) {
            $message = 'Cannot delete media: referenced by '.implode(', ', $breakdown).'.';
            throw ValidationException::withMessages([
                'media' => [$message],
            ]);
        }

        $this->deletePhysicalFiles($media);
        $result = (bool) $media->delete();

        $this->clearPageCache();

        return $result;
    }

    /**
     * Process an image: extract dimensions, generate a WebP version and thumbnail.
     *
     * @return array{webp_path: ?string, thumb_path: ?string, width: ?int, height: ?int}
     */
    protected function processImage(string $disk, string $path, string $mime): array
    {
        $fullPath = Storage::disk($disk)->path($path);

        if ($mime === 'image/svg+xml') {
            $width = null;
            $height = null;

            if (file_exists($fullPath)) {
                $xml = @simplexml_load_file($fullPath);
                if ($xml && isset($xml['width'], $xml['height'])) {
                    $width = (int) $xml['width'];
                    $height = (int) $xml['height'];
                }
            }

            return [
                'webp_path' => null,
                'thumb_path' => null,
                'width' => $width,
                'height' => $height,
            ];
        }

        try {
            $image = $this->imageManager->decodePath($fullPath);
            $width = $image->width();
            $height = $image->height();

            $dir = pathinfo($path, PATHINFO_DIRNAME);
            $filename = pathinfo($path, PATHINFO_FILENAME);

            // Generate WebP file
            $webpPath = "{$dir}/{$filename}.webp";
            $webpData = (string) $image->encodeUsingFileExtension('webp');
            Storage::disk($disk)->put($webpPath, $webpData);

            // Generate Thumbnail (max 400x400 maintain ratio)
            $thumbPath = "{$dir}/thumb_{$filename}.webp";
            $thumb = clone $image;
            $thumb->scaleDown(400, 400);
            $thumbData = (string) $thumb->encodeUsingFileExtension('webp');
            Storage::disk($disk)->put($thumbPath, $thumbData);

            return [
                'webp_path' => $webpPath,
                'thumb_path' => $thumbPath,
                'width' => $width,
                'height' => $height,
            ];
        } catch (\Throwable $e) {
            // If processing fails, fallback to basic image dimensions if possible
            $sizes = @getimagesize($fullPath);

            return [
                'webp_path' => null,
                'thumb_path' => null,
                'width' => $sizes ? $sizes[0] : null,
                'height' => $sizes ? $sizes[1] : null,
            ];
        }
    }

    /**
     * Delete physical files associated with a media record.
     */
    protected function deletePhysicalFiles(Media $media): void
    {
        $disk = Storage::disk($media->disk);

        if ($media->path && $disk->exists($media->path)) {
            $disk->delete($media->path);
        }

        if ($media->webp_path && $disk->exists($media->webp_path)) {
            $disk->delete($media->webp_path);
        }

        if ($media->thumb_path && $disk->exists($media->thumb_path)) {
            $disk->delete($media->thumb_path);
        }
    }

    /**
     * Determine media type: image, video, or document.
     */
    protected function determineMediaType(string $mime, string $filename): string
    {
        if (str_starts_with($mime, 'image/')) {
            return 'image';
        }

        if (str_starts_with($mime, 'video/')) {
            return 'video';
        }

        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'])) {
            return 'image';
        }

        if (in_array($extension, ['mp4', 'webm', 'ogg', 'mov'])) {
            return 'video';
        }

        return 'document';
    }

    /**
     * Clear the public portfolio page cache on any media modification.
     */
    public function clearPageCache(): void
    {
        Cache::forget('portfolio.page.v1');
    }
}
