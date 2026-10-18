<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        return [
            'title' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'icon' => 'lni-cog',
            'sort_order' => fake()->numberBetween(0, 20),
            'is_published' => true,
        ];
    }
}
