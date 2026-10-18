<?php

namespace App\Models;

use Database\Factories\AboutContentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $heading
 * @property string $bio
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class AboutContent extends Model
{
    /** @use HasFactory<AboutContentFactory> */
    use HasFactory;

    protected $table = 'about_content';

    protected $fillable = [
        'heading',
        'bio',
    ];

    /**
     * @return HasMany<AboutFact, $this>
     */
    public function facts(): HasMany
    {
        return $this->hasMany(AboutFact::class, 'about_content_id');
    }
}
