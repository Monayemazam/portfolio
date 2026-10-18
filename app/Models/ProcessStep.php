<?php

namespace App\Models;

use Database\Factories\ProcessStepFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $description
 * @property int $sort_order
 * @property bool $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ProcessStep extends Model
{
    /** @use HasFactory<ProcessStepFactory> */
    use HasFactory;

    protected $table = 'process_steps';

    protected $fillable = [
        'title',
        'description',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    /**
     * @param  Builder<ProcessStep>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * @param  Builder<ProcessStep>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order');
    }
}
