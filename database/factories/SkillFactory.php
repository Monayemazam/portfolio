<?php

namespace Database\Factories;

use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Skill>
 */
class SkillFactory extends Factory
{
    protected $model = Skill::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'category' => fake()->randomElement(['Backend', 'Frontend', 'Platforms', 'Design']),
            'level' => fake()->numberBetween(0, 100),
            'icon' => 'lni-code',
            'sort_order' => fake()->numberBetween(0, 20),
            'is_published' => true,
        ];
    }
}
