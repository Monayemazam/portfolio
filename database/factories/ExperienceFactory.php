<?php

namespace Database\Factories;

use App\Models\Experience;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Experience>
 */
class ExperienceFactory extends Factory
{
    protected $model = Experience::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-5 years', '-1 year');
        $endDate = fake()->dateTimeBetween($startDate, 'now');

        return [
            'role' => fake()->jobTitle(),
            'company' => fake()->company(),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'is_current' => false,
            'description' => fake()->paragraph(),
            'sort_order' => fake()->numberBetween(0, 10),
            'is_published' => true,
        ];
    }
}
