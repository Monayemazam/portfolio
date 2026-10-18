<?php

namespace Database\Seeders;

use App\Models\SeoMeta;
use Illuminate\Database\Seeder;

class SeoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SeoMeta::updateOrCreate(
            ['page' => 'home'],
            [
                'meta_title' => 'Monayem Azam | Full-Stack Web Developer & Software Engineer',
                'meta_description' => 'Explore the universe of Monayem Azam, full-stack developer specializing in Laravel, React, TypeScript, and high-performance web applications.',
                'og_image_media_id' => null,
                'canonical_url' => (string) config('app.url', 'http://localhost:8000'),
                'person_job_title' => 'Full-Stack Web Developer',
                'person_same_as' => [
                    'https://github.com/monayemazam',
                    'https://linkedin.com/in/monayemazam',
                ],
                'robots' => 'index,follow',
            ]
        );
    }
}
