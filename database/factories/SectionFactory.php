<?php

namespace Database\Factories;

use App\Models\Section;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Section>
 */
class SectionFactory extends Factory
{
    protected $model = Section::class;

    public function definition(): array
    {
        return [
            'key' => fake()->unique()->slug(2),
            'nav_label' => fake()->word(),
            'eyebrow' => 'MISSION / '.fake()->word(),
            'title' => fake()->words(3, true),
            'subtitle' => fake()->sentence(),
            'sort_order' => fake()->numberBetween(0, 100),
            'is_visible' => true,
        ];
    }
}
