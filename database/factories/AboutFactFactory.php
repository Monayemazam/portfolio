<?php

namespace Database\Factories;

use App\Models\AboutContent;
use App\Models\AboutFact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AboutFact>
 */
class AboutFactFactory extends Factory
{
    protected $model = AboutFact::class;

    public function definition(): array
    {
        return [
            'about_content_id' => AboutContent::factory(),
            'kind' => fake()->randomElement(['fact', 'counter']),
            'label' => fake()->word(),
            'value' => (string) fake()->numberBetween(1, 100),
            'suffix' => '+',
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
