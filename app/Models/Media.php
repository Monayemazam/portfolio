<?php

namespace App\Models;

use Database\Factories\MediaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

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
     * @var list<string>
     */
    protected $appends = [
        'url',
        'webp_url',
        'thumb_url',
        'reference_count',
        'is_in_use',
        'formatted_size',
    ];

    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function getWebpUrlAttribute(): ?string
    {
        return $this->webp_path
            ? Storage::disk($this->disk)->url($this->webp_path)
            : null;
    }

    public function getThumbUrlAttribute(): ?string
    {
        if ($this->thumb_path) {
            return Storage::disk($this->disk)->url($this->thumb_path);
        }

        if ($this->type === 'image') {
            return $this->webp_url ?? $this->url;
        }

        return null;
    }

    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->size_bytes;

        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2).' MB';
        }

        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 1).' KB';
        }

        return $bytes.' B';
    }

    public function getReferenceCountAttribute(): int
    {
        return $this->calculateReferenceCount();
    }

    public function getIsInUseAttribute(): bool
    {
        return $this->calculateReferenceCount() > 0;
    }

    /**
     * Calculate total references across all tables according to database-schema.md section 10.
     */
    public function calculateReferenceCount(): int
    {
        $projectMediaCount = $this->projectMedia()->count();
        $coverCount = $this->projects()->count();
        $testimonialCount = $this->testimonials()->count();
        $seoCount = $this->seoMeta()->count();
        $settingCount = Setting::query()
            ->whereIn('key', ['logo_media_id', 'favicon_media_id', 'photo_media_id', 'resume_media_id'])
            ->where('value', (string) $this->id)
            ->count();

        return $projectMediaCount + $coverCount + $testimonialCount + $seoCount + $settingCount;
    }

    /**
     * Get a human-readable list of what references this media item.
     *
     * @return array<string>
     */
    public function getReferencesBreakdown(): array
    {
        $reasons = [];

        $projectMediaCount = $this->projectMedia()->count();
        if ($projectMediaCount > 0) {
            $reasons[] = "{$projectMediaCount} project gallery item(s)";
        }

        $coverCount = $this->projects()->count();
        if ($coverCount > 0) {
            $reasons[] = "{$coverCount} project cover image(s)";
        }

        $testimonialCount = $this->testimonials()->count();
        if ($testimonialCount > 0) {
            $reasons[] = "{$testimonialCount} testimonial author photo(s)";
        }

        $seoCount = $this->seoMeta()->count();
        if ($seoCount > 0) {
            $reasons[] = "{$seoCount} SEO Open Graph image(s)";
        }

        $settings = Setting::query()
            ->whereIn('key', ['logo_media_id', 'favicon_media_id', 'photo_media_id', 'resume_media_id'])
            ->where('value', (string) $this->id)
            ->pluck('label')
            ->all();

        foreach ($settings as $label) {
            $reasons[] = "Site setting: {$label}";
        }

        return $reasons;
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
