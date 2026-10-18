<?php

namespace App\Models;

use Database\Factories\SectionFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $key
 * @property string $nav_label
 * @property string|null $eyebrow
 * @property string|null $title
 * @property string|null $subtitle
 * @property int $sort_order
 * @property bool $is_visible
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Section extends Model
{
    /** @use HasFactory<SectionFactory> */
    use HasFactory;

    protected $table = 'sections';

    protected $fillable = [
        'key',
        'nav_label',
        'eyebrow',
        'title',
        'subtitle',
        'sort_order',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_visible' => 'boolean',
        ];
    }

    /**
     * @param  Builder<Section>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order');
    }

    /**
     * @param  Builder<Section>  $query
     */
    public function scopeVisible(Builder $query): void
    {
        $query->where('is_visible', true);
    }
}
