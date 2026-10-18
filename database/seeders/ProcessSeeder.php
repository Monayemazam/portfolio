<?php

namespace Database\Seeders;

use App\Models\ProcessStep;
use Illuminate\Database\Seeder;

class ProcessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $steps = [
            [
                'title' => 'Discover',
                'description' => 'Deep exploration of project objectives, business requirements, target personas, and architectural constraints.',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'title' => 'Design',
                'description' => 'Creating the visual language, design system, interactive wireframes, and responsive layouts for desktop and mobile.',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'title' => 'Build',
                'description' => 'Clean, test-driven engineering across frontend and backend using modern standards, secure patterns, and strict typing.',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'title' => 'Test',
                'description' => 'Rigorous functional testing, cross-browser validation, performance audits, accessibility checks, and security review.',
                'sort_order' => 4,
                'is_published' => true,
            ],
            [
                'title' => 'Launch',
                'description' => 'Production deployment to high-availability servers with SSL certificates, automated backup routines, and CDN caching.',
                'sort_order' => 5,
                'is_published' => true,
            ],
            [
                'title' => 'Support',
                'description' => 'Continuous monitoring, performance tuning, proactive maintenance, and feature enhancements.',
                'sort_order' => 6,
                'is_published' => true,
            ],
        ];

        foreach ($steps as $step) {
            ProcessStep::updateOrCreate(
                ['title' => $step['title']],
                $step
            );
        }
    }
}
