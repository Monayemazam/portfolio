<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database in strict dependency order.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SettingSeeder::class,
            SectionSeeder::class,
            SeoSeeder::class,
            HeroSeeder::class,
            AboutSeeder::class,
            SkillSeeder::class,
            ServiceSeeder::class,
            ProcessSeeder::class,
            TagSeeder::class,
            ProjectSeeder::class,
        ]);
    }
}
