<?php

namespace Database\Factories;

use App\Models\AboutContent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AboutContent>
 */
class AboutContentFactory extends Factory
{
    protected $model = AboutContent::class;

    public function definition(): array
    {
        return [
            'heading' => 'Mission Briefing',
            'bio' => fake()->paragraph(),
        ];
    }
}
