<?php

namespace App\Models;

use Database\Factories\ExperienceFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $role
 * @property string $company
 * @property Carbon $start_date
 * @property Carbon|null $end_date
 * @property bool $is_current
 * @property string|null $description
 * @property int $sort_order
 * @property bool $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Experience extends Model
{
    /** @use HasFactory<ExperienceFactory> */
    use HasFactory;

    protected $table = 'experiences';

    protected $fillable = [
        'role',
        'company',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    /**
     * @param  Builder<Experience>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * @param  Builder<Experience>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order');
    }
}
