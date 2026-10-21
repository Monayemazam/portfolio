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
        $hero = HeroContent::first();
        if ($hero) {
            $hero->update([
                'name' => 'Monayem Azam',
                'eyebrow' => 'FULL-STACK WEB DEVELOPER',
                'primary_button_label' => 'View Projects',
                'primary_button_url' => '#projects',
                'secondary_button_label' => 'Contact Me',
                'secondary_button_url' => '#contact',
            ]);
        } else {
            $hero = HeroContent::create([
                'name' => 'Monayem Azam',
                'eyebrow' => 'FULL-STACK WEB DEVELOPER',
                'primary_button_label' => 'View Projects',
                'primary_button_url' => '#projects',
                'secondary_button_label' => 'Contact Me',
                'secondary_button_url' => '#contact',
            ]);
        }

        // Clean up any extra or demo roles
        HeroRole::where('hero_content_id', $hero->id)->delete();

        $roles = [
            ['text' => 'Full-Stack Web Developer', 'sort_order' => 1],
            ['text' => 'Laravel & React Engineer', 'sort_order' => 2],
            ['text' => 'UI/UX & Frontend Designer', 'sort_order' => 3],
            ['text' => 'Ecommerce & Digital Product Builder', 'sort_order' => 4],
        ];

        foreach ($roles as $role) {
            HeroRole::create([
                'hero_content_id' => $hero->id,
                'text' => $role['text'],
                'sort_order' => $role['sort_order'],
            ]);
        }
    }
}
