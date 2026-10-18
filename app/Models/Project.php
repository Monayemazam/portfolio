<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $summary
 * @property string|null $description
 * @property string|null $business_type
 * @property string|null $role
 * @property int|null $year
 * @property string $live_url
 * @property string $planet_style
 * @property string|null $accent_color
 * @property int|null $cover_media_id
 * @property bool $show_live_preview
 * @property bool $is_featured
 * @property bool $is_published
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'projects';

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'description',
        'business_type',
        'role',
        'year',
        'live_url',
        'planet_style',
        'accent_color',
        'cover_media_id',
        'show_live_preview',
        'is_featured',
        'is_published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'show_live_preview' => 'boolean',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return HasMany<ProjectFeature, $this>
     */
    public function features(): HasMany
    {
        return $this->hasMany(ProjectFeature::class, 'project_id');
    }

    /**
     * @return HasMany<ProjectMedia, $this>
     */
    public function projectMedia(): HasMany
    {
        return $this->hasMany(ProjectMedia::class, 'project_id');
    }

    /**
     * @return BelongsToMany<Media, $this>
     */
    public function media(): BelongsToMany
    {
        return $this->belongsToMany(Media::class, 'project_media')
            ->withPivot(['kind', 'caption', 'sort_order'])
            ->withTimestamps();
    }

    /**
     * @return BelongsTo<Media, $this>
     */
    public function coverMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'cover_media_id');
    }

    /**
     * @return BelongsToMany<Tag, $this>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'project_tag')
            ->withPivot(['sort_order']);
    }

    /**
     * @return HasMany<Testimonial, $this>
     */
    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class, 'project_id');
    }

    /**
     * @param  Builder<Project>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * @param  Builder<Project>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order');
    }

    /**
     * @param  Builder<Project>  $query
     */
    public function scopeFeatured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    /**
     * @param  Builder<Project>  $query
     */
    public function scopePublic(Builder $query): void
    {
        $query->where('is_published', true)
            ->whereNull('deleted_at')
            ->orderBy('sort_order');
    }
}
