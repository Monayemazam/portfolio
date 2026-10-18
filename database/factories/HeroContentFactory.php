<?php

namespace Database\Factories;

use App\Models\HeroContent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HeroContent>
 */
class HeroContentFactory extends Factory
{
    protected $model = HeroContent::class;

    public function definition(): array
    {
        return [
            'eyebrow' => 'MISSION 01 / LAUNCH',
            'name' => 'Monayem Azam',
            'primary_button_label' => 'View projects',
            'primary_button_url' => '#projects',
            'secondary_button_label' => 'Hire me',
            'secondary_button_url' => '#contact',
        ];
    }
}
