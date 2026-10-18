<?php

namespace App\Models;

use Database\Factories\HeroContentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $eyebrow
 * @property string $name
 * @property string $primary_button_label
 * @property string $primary_button_url
 * @property string $secondary_button_label
 * @property string $secondary_button_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class HeroContent extends Model
{
    /** @use HasFactory<HeroContentFactory> */
    use HasFactory;

    protected $table = 'hero_content';

    protected $fillable = [
        'eyebrow',
        'name',
        'primary_button_label',
        'primary_button_url',
        'secondary_button_label',
        'secondary_button_url',
    ];

    /**
     * @return HasMany<HeroRole, $this>
     */
    public function roles(): HasMany
    {
        return $this->hasMany(HeroRole::class, 'hero_content_id');
    }
}
