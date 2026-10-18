<?php

namespace App\Models;

use Database\Factories\AboutFactFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $about_content_id
 * @property string $kind
 * @property string $label
 * @property string $value
 * @property string|null $suffix
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class AboutFact extends Model
{
    /** @use HasFactory<AboutFactFactory> */
    use HasFactory;

    protected $table = 'about_facts';

    protected $fillable = [
        'about_content_id',
        'kind',
        'label',
        'value',
        'suffix',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<AboutContent, $this>
     */
    public function aboutContent(): BelongsTo
    {
        return $this->belongsTo(AboutContent::class, 'about_content_id');
    }

    /**
     * @param  Builder<AboutFact>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order');
    }
}
