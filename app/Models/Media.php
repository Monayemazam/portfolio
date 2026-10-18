<?php

namespace App\Models;

use Database\Factories\MediaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $disk
 * @property string $path
 * @property string|null $webp_path
 * @property string|null $thumb_path
 * @property string $original_name
 * @property string $mime
 * @property string $type
 * @property int $size_bytes
 * @property int|null $width
 * @property int|null $height
 * @property float|null $duration_seconds
 * @property string|null $alt_text
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Media extends Model
{
    /** @use HasFactory<MediaFactory> */
    use HasFactory;

    protected $table = 'media';

    protected $fillable = [
        'disk',
        'path',
        'webp_path',
        'thumb_path',
        'original_name',
        'mime',
        'type',
        'size_bytes',
        'width',
        'height',
        'duration_seconds',
        'alt_text',
    ];

    protected function casts(): array
    {
        return [
            'size_bytes' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'duration_seconds' => 'decimal:2',
        ];
    }

    /**
     * @return HasMany<ProjectMedia, $this>
     */
    public function projectMedia(): HasMany
    {
        return $this->hasMany(ProjectMedia::class, 'media_id');
    }

    /**
     * @return HasMany<Project, $this>
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'cover_media_id');
    }

    /**
     * @return HasMany<Testimonial, $this>
     */
    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class, 'photo_media_id');
    }

    /**
     * @return HasMany<SeoMeta, $this>
     */
    public function seoMeta(): HasMany
    {
        return $this->hasMany(SeoMeta::class, 'og_image_media_id');
    }
}
