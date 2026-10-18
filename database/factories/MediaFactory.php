<?php

namespace Database\Factories;

use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Media>
 */
class MediaFactory extends Factory
{
    protected $model = Media::class;

    public function definition(): array
    {
        return [
            'disk' => 'public',
            'path' => 'uploads/'.fake()->uuid().'.jpg',
            'webp_path' => 'uploads/'.fake()->uuid().'.webp',
            'thumb_path' => 'uploads/thumbs/'.fake()->uuid().'.webp',
            'original_name' => fake()->word().'.jpg',
            'mime' => 'image/jpeg',
            'type' => 'image',
            'size_bytes' => fake()->numberBetween(10000, 500000),
            'width' => 1920,
            'height' => 1080,
            'duration_seconds' => null,
            'alt_text' => fake()->sentence(),
        ];
    }
}
