<?php

namespace App\Models;

use Database\Factories\ProjectMediaFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $project_id
 * @property int $media_id
 * @property string $kind
 * @property string|null $caption
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ProjectMedia extends Model
{
    /** @use HasFactory<ProjectMediaFactory> */
    use HasFactory;

    protected $table = 'project_media';

    protected $fillable = [
        'project_id',
        'media_id',
        'kind',
        'caption',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    /**
     * @return BelongsTo<Media, $this>
     */
    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id');
    }

    /**
     * @param  Builder<ProjectMedia>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order');
    }
}
