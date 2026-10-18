<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'Full-stack web applications',
                'description' => 'End-to-end web applications engineered with Laravel, React, and Vue.js with responsive architectures, secure APIs, and intuitive user interfaces.',
                'icon' => 'lni-display',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'title' => 'CMS development',
                'description' => 'Custom, modular content management systems tailored to unique business workflows with complete CRUD capabilities and role-based permissions.',
                'icon' => 'lni-layers',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'title' => 'Ecommerce platforms',
                'description' => 'High-conversion online stores with optimized carts, multi-currency support, payment gateways, and real-time inventory management.',
                'icon' => 'lni-cart-full',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'title' => 'WordPress websites',
                'description' => 'Bespoke WordPress and WooCommerce builds with custom themes, high-speed performance, clean code, and zero page-builder bloat.',
                'icon' => 'lni-wordpress',
                'sort_order' => 4,
                'is_published' => true,
            ],
            [
                'title' => 'UI/UX design',
                'description' => 'Modern design systems, user journeys, wireframes, and high-fidelity interactive prototypes designed with attention to visual hierarchy.',
                'icon' => 'lni-layout',
                'sort_order' => 5,
                'is_published' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['title' => $service['title']],
                $service
            );
        }
    }
}
