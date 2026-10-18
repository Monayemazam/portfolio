<?php

namespace Database\Factories;

use App\Models\ProcessStep;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProcessStep>
 */
class ProcessStepFactory extends Factory
{
    protected $model = ProcessStep::class;

    public function definition(): array
    {
        return [
            'title' => fake()->word(),
            'description' => fake()->paragraph(),
            'sort_order' => fake()->numberBetween(0, 10),
            'is_published' => true,
        ];
    }
}
