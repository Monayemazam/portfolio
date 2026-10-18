<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectFeature;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectFeature>
 */
class ProjectFeatureFactory extends Factory
{
    protected $model = ProjectFeature::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'group_label' => fake()->randomElement(['Store', 'Content', 'Account and checkout', 'Marketing', 'Admin', 'Technical']),
            'text' => fake()->sentence(),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
