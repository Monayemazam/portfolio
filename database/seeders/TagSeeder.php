<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            'Laravel',
            'Vue.js',
            'React',
            'TypeScript',
            'PHP',
            'MySQL',
            'WordPress',
            'WooCommerce',
            'Tailwind CSS',
            'Inertia.js',
            'Elementor',
            'Ecommerce',
            'Logistics',
        ];

        foreach ($tags as $name) {
            Tag::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'slug' => Str::slug($name),
                ]
            );
        }
    }
}
