<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\Project;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    protected $model = Testimonial::class;

    public function definition(): array
    {
        return [
            'quote' => fake()->paragraph(),
            'author_name' => fake()->name(),
            'author_role' => fake()->jobTitle(),
            'company' => fake()->company(),
            'photo_media_id' => Media::factory(),
            'project_id' => Project::factory(),
            'sort_order' => fake()->numberBetween(0, 10),
            'is_published' => false,
        ];
    }
}
