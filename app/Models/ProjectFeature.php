<?php

namespace App\Models;

use Database\Factories\ProjectFeatureFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $project_id
 * @property string $group_label
 * @property string $text
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ProjectFeature extends Model
{
    /** @use HasFactory<ProjectFeatureFactory> */
    use HasFactory;

    protected $table = 'project_features';

    protected $fillable = [
        'project_id',
        'group_label',
        'text',
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
     * @param  Builder<ProjectFeature>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order');
    }
}
