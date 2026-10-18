<?php

namespace Database\Seeders;

use App\Models\HeroContent;
use App\Models\HeroRole;
use Illuminate\Database\Seeder;

class HeroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hero = HeroContent::firstOrCreate(
            ['name' => 'Monayem Azam'],
            [
                'eyebrow' => 'MISSION 01 / LAUNCH',
                'primary_button_label' => 'View projects',
                'primary_button_url' => '#projects',
                'secondary_button_label' => 'Hire me',
                'secondary_button_url' => '#contact',
            ]
        );

        $roles = [
            ['text' => 'Full-stack web developer', 'sort_order' => 1],
            ['text' => 'Laravel and React engineer', 'sort_order' => 2],
            ['text' => 'UI/UX designer', 'sort_order' => 3],
            ['text' => 'Ecommerce builder', 'sort_order' => 4],
        ];

        foreach ($roles as $role) {
            HeroRole::updateOrCreate(
                [
                    'hero_content_id' => $hero->id,
                    'text' => $role['text'],
                ],
                [
                    'sort_order' => $role['sort_order'],
                ]
            );
        }
    }
}
