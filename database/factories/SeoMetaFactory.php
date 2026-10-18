<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\SeoMeta;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SeoMeta>
 */
class SeoMetaFactory extends Factory
{
    protected $model = SeoMeta::class;

    public function definition(): array
    {
        return [
            'page' => fake()->unique()->slug(1),
            'meta_title' => fake()->sentence(4),
            'meta_description' => fake()->sentence(10),
            'og_image_media_id' => Media::factory(),
            'canonical_url' => fake()->url(),
            'person_job_title' => 'Full-Stack Developer',
            'person_same_as' => ['https://github.com/monayemazam'],
            'robots' => 'index,follow',
        ];
    }
}
