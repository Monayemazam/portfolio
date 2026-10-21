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
        $bio = "I'm Monayem Azam, a Full-Stack Web Developer with over 6 years of experience building digital products and web applications. I love turning ideas into practical, reliable experiences through thoughtful design and engineering. For me, development is more than writing code—it's a passion for creating things that work well and make a difference.";

        if ($about) {
            $about->update([
                'heading' => 'BUILT WITH PURPOSE.',
                'bio' => $bio,
            ]);
        } else {
            $about = AboutContent::create([
                'heading' => 'BUILT WITH PURPOSE.',
                'bio' => $bio,
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
