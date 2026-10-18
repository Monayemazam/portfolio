<?php

namespace App\Models;

use Database\Factories\HeroRoleFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $hero_content_id
 * @property string $text
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class HeroRole extends Model
{
    /** @use HasFactory<HeroRoleFactory> */
    use HasFactory;

    protected $table = 'hero_roles';

    protected $fillable = [
        'hero_content_id',
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
     * @return BelongsTo<HeroContent, $this>
     */
    public function heroContent(): BelongsTo
    {
        return $this->belongsTo(HeroContent::class, 'hero_content_id');
    }

    /**
     * @param  Builder<HeroRole>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order');
    }
}
