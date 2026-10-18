<?php

namespace App\Models;

use Database\Factories\ServiceFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $description
 * @property string|null $icon
 * @property int $sort_order
 * @property bool $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Service extends Model
{
    /** @use HasFactory<ServiceFactory> */
    use HasFactory;

    protected $table = 'services';

    protected $fillable = [
        'title',
        'description',
        'icon',
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
     * @param  Builder<Service>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * @param  Builder<Service>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order');
    }
}
