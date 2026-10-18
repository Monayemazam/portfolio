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
        $skills = [
            // Backend
            [
                'name' => 'Laravel',
                'category' => 'Backend',
                'level' => 95,
                'icon' => 'lni-laravel',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'name' => 'PHP',
                'category' => 'Backend',
                'level' => 90,
                'icon' => 'lni-php',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'name' => 'MySQL',
                'category' => 'Backend',
                'level' => 88,
                'icon' => 'lni-database',
                'sort_order' => 3,
                'is_published' => true,
            ],

            // Frontend
            [
                'name' => 'Vue.js',
                'category' => 'Frontend',
                'level' => 90,
                'icon' => 'lni-vuejs',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'name' => 'React',
                'category' => 'Frontend',
                'level' => 88,
                'icon' => 'lni-react',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'name' => 'TypeScript',
                'category' => 'Frontend',
                'level' => 85,
                'icon' => 'lni-code-alt',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'name' => 'UI/UX design',
                'category' => 'Frontend',
                'level' => 82,
                'icon' => 'lni-layout',
                'sort_order' => 4,
                'is_published' => true,
            ],

            // Platforms
            [
                'name' => 'WordPress',
                'category' => 'Platforms',
                'level' => 92,
                'icon' => 'lni-wordpress',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'name' => 'Ecommerce',
                'category' => 'Platforms',
                'level' => 88,
                'icon' => 'lni-cart',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'name' => 'GitHub',
                'category' => 'Platforms',
                'level' => 90,
                'icon' => 'lni-github-original',
                'sort_order' => 3,
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
