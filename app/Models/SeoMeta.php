<?php

namespace App\Models;

use Database\Factories\SeoMetaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $page
 * @property string $meta_title
 * @property string $meta_description
 * @property int|null $og_image_media_id
 * @property string|null $canonical_url
 * @property string|null $person_job_title
 * @property array<string>|null $person_same_as
 * @property string $robots
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class SeoMeta extends Model
{
    /** @use HasFactory<SeoMetaFactory> */
    use HasFactory;

    protected $table = 'seo_meta';

    protected $fillable = [
        'page',
        'meta_title',
        'meta_description',
        'og_image_media_id',
        'canonical_url',
        'person_job_title',
        'person_same_as',
        'robots',
    ];

    protected function casts(): array
    {
        return [
            'person_same_as' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Media, $this>
     */
    public function ogImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'og_image_media_id');
    }
}
