<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Safely update legacy abbreviations without creating duplicate records
        $legacyJs = Skill::where('name', 'JS')->first();
        if ($legacyJs) {
            $legacyJs->update([
                'name' => 'JavaScript',
                'category' => 'Engineering',
                'icon' => 'lni-code-alt',
                'level' => 90,
            ]);
        }

        $legacyUi = Skill::where('name', 'UI/UX design')->first();
        if ($legacyUi) {
            $legacyUi->update([
                'name' => 'UI/UX Design',
                'category' => 'Creative & Marketing',
            ]);
        }

        $skills = [
            // 01. ENGINEERING
            [
                'name' => 'PHP',
                'category' => 'Engineering',
                'level' => 92,
                'icon' => 'lni-php',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'name' => 'Laravel',
                'category' => 'Engineering',
                'level' => 95,
                'icon' => 'lni-laravel',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'name' => 'JavaScript',
                'category' => 'Engineering',
                'level' => 90,
                'icon' => 'lni-code-alt',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'name' => 'Vue.js',
                'category' => 'Engineering',
                'level' => 90,
                'icon' => 'lni-vuejs',
                'sort_order' => 4,
                'is_published' => true,
            ],
            [
                'name' => 'React',
                'category' => 'Engineering',
                'level' => 88,
                'icon' => 'lni-react',
                'sort_order' => 5,
                'is_published' => true,
            ],
            [
                'name' => 'TypeScript',
                'category' => 'Engineering',
                'level' => 88,
                'icon' => 'lni-code-alt',
                'sort_order' => 6,
                'is_published' => true,
            ],
            [
                'name' => 'HTML & CSS',
                'category' => 'Engineering',
                'level' => 94,
                'icon' => 'lni-code',
                'sort_order' => 7,
                'is_published' => true,
            ],
            [
                'name' => 'Tailwind CSS',
                'category' => 'Engineering',
                'level' => 92,
                'icon' => 'lni-layout',
                'sort_order' => 8,
                'is_published' => true,
            ],
            [
                'name' => 'MySQL',
                'category' => 'Engineering',
                'level' => 88,
                'icon' => 'lni-database',
                'sort_order' => 9,
                'is_published' => true,
            ],
            [
                'name' => 'WordPress',
                'category' => 'Engineering',
                'level' => 92,
                'icon' => 'lni-wordpress',
                'sort_order' => 10,
                'is_published' => true,
            ],
            [
                'name' => 'WooCommerce',
                'category' => 'Engineering',
                'level' => 88,
                'icon' => 'lni-cart',
                'sort_order' => 11,
                'is_published' => true,
            ],

            // 02. DEPLOYMENT & GROWTH
            [
                'name' => 'cPanel Deployment',
                'category' => 'Deployment & Growth',
                'level' => 90,
                'icon' => 'lni-server',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'name' => 'hPanel Deployment',
                'category' => 'Deployment & Growth',
                'level' => 88,
                'icon' => 'lni-cloud-network',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'name' => 'SEO',
                'category' => 'Deployment & Growth',
                'level' => 88,
                'icon' => 'lni-stats-up',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'name' => 'Website Deployment & Hosting',
                'category' => 'Deployment & Growth',
                'level' => 90,
                'icon' => 'lni-website',
                'sort_order' => 4,
                'is_published' => true,
            ],
            [
                'name' => 'GitHub',
                'category' => 'Deployment & Growth',
                'level' => 90,
                'icon' => 'lni-github-original',
                'sort_order' => 5,
                'is_published' => true,
            ],
            [
                'name' => 'Ecommerce',
                'category' => 'Deployment & Growth',
                'level' => 88,
                'icon' => 'lni-cart',
                'sort_order' => 6,
                'is_published' => true,
            ],

            // 03. CREATIVE & MARKETING
            [
                'name' => 'UI/UX Design',
                'category' => 'Creative & Marketing',
                'level' => 86,
                'icon' => 'lni-layout',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'name' => 'Graphic Design',
                'category' => 'Creative & Marketing',
                'level' => 88,
                'icon' => 'lni-brush',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'name' => 'Content Creation',
                'category' => 'Creative & Marketing',
                'level' => 85,
                'icon' => 'lni-pen',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'name' => 'Video Editing',
                'category' => 'Creative & Marketing',
                'level' => 82,
                'icon' => 'lni-video',
                'sort_order' => 4,
                'is_published' => true,
            ],
            [
                'name' => 'Facebook Ads',
                'category' => 'Creative & Marketing',
                'level' => 86,
                'icon' => 'lni-bullhorn',
                'sort_order' => 5,
                'is_published' => true,
            ],
            [
                'name' => 'Facebook Meta Pixel',
                'category' => 'Creative & Marketing',
                'level' => 88,
                'icon' => 'lni-code-alt',
                'sort_order' => 6,
                'is_published' => true,
            ],
        ];

        foreach ($skills as $skill) {
            Skill::updateOrCreate(
                ['name' => $skill['name']],
                $skill
            );
        }
    }
}
