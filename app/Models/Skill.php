<?php

namespace App\Models;

use Database\Factories\SkillFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $category
 * @property int $level
 * @property string|null $icon
 * @property int $sort_order
 * @property bool $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Skill extends Model
{
    /** @use HasFactory<SkillFactory> */
    use HasFactory;

    protected $table = 'skills';

    protected $fillable = [
        'name',
        'category',
        'level',
        'icon',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'level' => 'integer',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    /**
     * @param  Builder<Skill>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * @param  Builder<Skill>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order');
    }
}
