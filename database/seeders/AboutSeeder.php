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
        $about = AboutContent::first();
        if ($about) {
            $about->update([
                'heading' => 'BUILT WITH PURPOSE.',
                'bio' => "I'm Monayem Azam, a Full-Stack Web Developer with 6+ years of experience building digital experiences and web applications. I enjoy turning ideas into practical, reliable products, combining thoughtful design with solid engineering. With 50+ satisfied clients and 10+ live projects, I bring a passion for creating digital solutions that work in the real world.",
            ]);
        } else {
            $about = AboutContent::create([
                'heading' => 'BUILT WITH PURPOSE.',
                'bio' => "I'm Monayem Azam, a Full-Stack Web Developer with 6+ years of experience building digital experiences and web applications. I enjoy turning ideas into practical, reliable products, combining thoughtful design with solid engineering. With 50+ satisfied clients and 10+ live projects, I bring a passion for creating digital solutions that work in the real world.",
            ]);
        }

        // Clean up any extra or demo facts
        AboutFact::where('about_content_id', $about->id)->delete();

        $facts = [
            [
                'kind' => 'counter',
                'label' => 'Experience',
                'value' => '6',
                'suffix' => '+ years',
                'sort_order' => 1,
            ],
            [
                'kind' => 'counter',
                'label' => 'Satisfied Clients',
                'value' => '50',
                'suffix' => '+',
                'sort_order' => 2,
            ],
            [
                'kind' => 'counter',
                'label' => 'Live Projects',
                'value' => '10',
                'suffix' => '+',
                'sort_order' => 3,
            ],
        ];

        foreach ($facts as $fact) {
            AboutFact::create([
                'about_content_id' => $about->id,
                ...$fact,
            ]);
        }
    }
}
