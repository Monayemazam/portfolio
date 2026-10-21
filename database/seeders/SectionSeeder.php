<?php

namespace Database\Seeders;

use App\Models\Section;
use Illuminate\Database\Seeder;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = [
            [
                'key' => 'hero',
                'nav_label' => 'Launch',
                'eyebrow' => 'MISSION 01 / LAUNCH',
                'title' => 'Monayem Azam',
                'subtitle' => 'Full-Stack Web Developer & Engineer',
                'sort_order' => 1,
                'is_visible' => true,
            ],
            [
                'key' => 'about',
                'nav_label' => 'Briefing',
                'eyebrow' => 'MISSION 02 / BRIEFING',
                'title' => 'About Me',
                'subtitle' => 'Designing and building reliable, scalable digital solutions.',
                'sort_order' => 2,
                'is_visible' => true,
            ],
            [
                'key' => 'skills',
                'nav_label' => 'Capabilities',
                'eyebrow' => 'CAPABILITIES / 01',
                'title' => "WHAT I KNOW.\nWHAT I BUILD.",
                'subtitle' => 'A focused toolkit for engineering, launching, and growing digital products.',
                'sort_order' => 3,
                'is_visible' => true,
            ],
            [
                'key' => 'projects',
                'nav_label' => 'Solar System',
                'eyebrow' => 'MISSION 04 / SOLAR SYSTEM',
                'title' => 'Featured Projects',
                'subtitle' => 'Live web applications and production platforms.',
                'sort_order' => 4,
                'is_visible' => true,
            ],
            [
                'key' => 'services',
                'nav_label' => 'Stations',
                'eyebrow' => 'MISSION 05 / STATIONS',
                'title' => 'Services',
                'subtitle' => 'Specialized engineering and design capabilities.',
                'sort_order' => 5,
                'is_visible' => true,
            ],
            [
                'key' => 'experience',
                'nav_label' => 'Flight Log',
                'eyebrow' => 'MISSION 06 / FLIGHT LOG',
                'title' => 'Experience',
                'subtitle' => 'Career trajectory and production milestones.',
                'sort_order' => 6,
                'is_visible' => true,
            ],
            [
                'key' => 'process',
                'nav_label' => 'Sequence',
                'eyebrow' => 'MISSION 07 / SEQUENCE',
                'title' => 'Development Process',
                'subtitle' => 'Disciplined launch sequence from discovery to continuous support.',
                'sort_order' => 7,
                'is_visible' => true,
            ],
            [
                'key' => 'testimonials',
                'nav_label' => 'Transmissions',
                'eyebrow' => 'MISSION 08 / TRANSMISSIONS',
                'title' => 'Transmissions',
                'subtitle' => 'Client feedback and reviews.',
                'sort_order' => 8,
                'is_visible' => true,
            ],
            [
                'key' => 'contact',
                'nav_label' => 'Open Channel',
                'eyebrow' => 'MISSION 09 / OPEN CHANNEL',
                'title' => 'Contact',
                'subtitle' => 'Open frequency for inquiries and collaborations.',
                'sort_order' => 9,
                'is_visible' => true,
            ],
            [
                'key' => 'footer',
                'nav_label' => 'Landing',
                'eyebrow' => 'MISSION 10 / LANDING',
                'title' => 'Mission Complete',
                'subtitle' => 'Monayem Azam Space Portfolio.',
                'sort_order' => 10,
                'is_visible' => true,
            ],
        ];

        foreach ($sections as $section) {
            Section::updateOrCreate(
                ['key' => $section['key']],
                $section
            );
        }
    }
}
