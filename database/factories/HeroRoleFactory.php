<?php

namespace Database\Factories;

use App\Models\HeroContent;
use App\Models\HeroRole;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HeroRole>
 */
class HeroRoleFactory extends Factory
{
    protected $model = HeroRole::class;

    public function definition(): array
    {
        return [
            'hero_content_id' => HeroContent::factory(),
            'text' => fake()->jobTitle(),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
