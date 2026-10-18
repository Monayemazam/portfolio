<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\Project;
use App\Models\ProjectMedia;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectMedia>
 */
class ProjectMediaFactory extends Factory
{
    protected $model = ProjectMedia::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'media_id' => Media::factory(),
            'kind' => fake()->randomElement(['desktop', 'mobile', 'video', 'other']),
            'caption' => fake()->sentence(),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
