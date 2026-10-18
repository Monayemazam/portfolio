<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'title' => fake()->unique()->words(2, true),
            'slug' => fake()->unique()->slug(2),
            'summary' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'business_type' => fake()->word(),
            'role' => 'Full-Stack Developer',
            'year' => 2026,
            'live_url' => fake()->url(),
            'planet_style' => fake()->randomElement(['rocky', 'station', 'amber', 'ringed', 'ocean', 'desert', 'generic']),
            'accent_color' => '#22D3EE',
            'cover_media_id' => Media::factory(),
            'show_live_preview' => false,
            'is_featured' => false,
            'is_published' => true,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
