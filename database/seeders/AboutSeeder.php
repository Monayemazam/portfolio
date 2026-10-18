<?php

namespace Database\Seeders;

use App\Models\AboutContent;
use App\Models\AboutFact;
use Illuminate\Database\Seeder;

class AboutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $about = AboutContent::firstOrCreate(
            ['heading' => 'Mission Briefing'],
            [
                'bio' => 'Full-stack software engineer with deep expertise in modern web architectures including Laravel, React, Vue.js, and TypeScript. Dedicated to engineering robust backends, immersive frontends, and reliable business-critical systems.',
            ]
        );

        $facts = [
            [
                'kind' => 'counter',
                'label' => 'Production Projects',
                'value' => '6',
                'suffix' => '+',
                'sort_order' => 1,
            ],
            [
                'kind' => 'counter',
                'label' => 'Years Experience',
                'value' => '3',
                'suffix' => '+',
                'sort_order' => 2,
            ],
            [
                'kind' => 'counter',
                'label' => 'Happy Clients',
                'value' => '10',
                'suffix' => '+',
                'sort_order' => 3,
            ],
        ];

        foreach ($facts as $fact) {
            AboutFact::updateOrCreate(
                [
                    'about_content_id' => $about->id,
                    'label' => $fact['label'],
                ],
                $fact
            );
        }
    }
}
