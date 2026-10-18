<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectFeature;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'sort_order' => 1,
                'title' => 'Mercury Bangladesh',
                'slug' => 'mercury-bangladesh',
                'summary' => 'Corporate logistics and freight management web application.',
                'description' => 'Corporate logistics website built with Laravel, Vue.js, and MySQL. A high-efficiency management portal engineered for freight handling, route planning, and logistics support.',
                'business_type' => 'Logistics & Freight Services',
                'role' => 'Lead Full-Stack Developer',
                'year' => 2024,
                'live_url' => 'https://mercury-bd.com/',
                'planet_style' => 'rocky',
                'accent_color' => '#94A3B8',
                'is_featured' => false,
                'is_published' => true,
                'tags' => ['Laravel', 'Vue.js', 'MySQL', 'Logistics'],
                'features' => [
                    ['group' => 'Technical', 'text' => 'Fast database-backed architecture using MySQL and Laravel.'],
                    ['group' => 'Technical', 'text' => 'Modular API architecture connecting frontend state with backend services.'],
                    ['group' => 'Content', 'text' => 'Detailed overview of freight solutions, company history, and transport corridors.'],
                    ['group' => 'Content', 'text' => 'Corporate contact channels and regional service directory.'],
                    ['group' => 'General', 'text' => 'Responsive corporate design optimized for desktop and mobile devices.'],
                ],
            ],
            [
                'sort_order' => 2,
                'title' => 'ASN Group',
                'slug' => 'asn-group',
                'summary' => 'Corporate freight forwarding and logistics platform.',
                'description' => 'Corporate website for international freight forwarding services featuring a custom Light-theme "Glass Horizon" design system, dynamic service portals, and a database-driven content dashboard.',
                'business_type' => 'International Freight Forwarding',
                'role' => 'Lead Full-Stack Developer',
                'year' => 2025,
                'live_url' => 'https://www.asngroup-bd.com/',
                'planet_style' => 'station',
                'accent_color' => '#22D3EE',
                'is_featured' => true,
                'is_published' => true,
                'tags' => ['Laravel', 'Vue.js', 'Inertia.js', 'Tailwind CSS', 'MySQL', 'Logistics'],
                'features' => [
                    ['group' => 'Technical', 'text' => 'Modern single-page experience using Laravel 13, Vue 3, and Inertia.js.'],
                    ['group' => 'Technical', 'text' => 'Tailored UI system implemented with Tailwind CSS and DaisyUI.'],
                    ['group' => 'Content', 'text' => 'International freight forwarding service pages and regional network maps.'],
                    ['group' => 'Content', 'text' => 'Inquiry and quote estimation request workflows.'],
                    ['group' => 'Admin', 'text' => 'Full CRUD administrative dashboard for dynamic content updates without code deployments.'],
                ],
            ],
            [
                'sort_order' => 3,
                'title' => 'Tasa',
                'slug' => 'tasa',
                'summary' => 'Handcrafted leather goods store and brand platform.',
                'description' => 'Premium handcrafted leather goods brand platform and ecommerce store from Chattogram, engineered with WordPress and WooCommerce.',
                'business_type' => 'Leather Goods & Fashion Retail',
                'role' => 'Full-Stack Developer & Ecommerce Specialist',
                'year' => 2024,
                'live_url' => 'https://tasa.com.bd/',
                'planet_style' => 'amber',
                'accent_color' => '#B45309',
                'is_featured' => false,
                'is_published' => true,
                'tags' => ['WordPress', 'WooCommerce', 'Ecommerce'],
                'features' => [
                    ['group' => 'Store', 'text' => 'Shop: 6 top categories (Bags, Wallets, Corporate, Fashions, Travels, Accessories) with sub-categories such as Backpack, Briefcase, Laptop Bag, Long Wallet, Bifold, Trifold.'],
                    ['group' => 'Store', 'text' => 'Product cards with sale badges, discount percentages, variant selection, quick view, add to compare, wishlist, star ratings, sold-out labels.'],
                    ['group' => 'Marketing', 'text' => 'Combo offers and gift bundles; special-sale banners; hero slider.'],
                    ['group' => 'Account and checkout', 'text' => 'Cart in Bangladeshi taka, checkout, customer login, registration, password reset, account area.'],
                    ['group' => 'Store', 'text' => 'Live product search with real-time feedback.'],
                    ['group' => 'Content', 'text' => 'Content pages: Our Story, About, Contact, Leather Care, Materials, Shipping and Returns, Terms, Privacy; blog with articles on leather quality and design.'],
                    ['group' => 'Marketing', 'text' => 'Trust blocks: 1-year warranty, honest pricing, sustainable materials, 20,000+ customers counter.'],
                    ['group' => 'Marketing', 'text' => 'Links to the Daraz flagship store, Facebook and Instagram.'],
                    ['group' => 'Technical', 'text' => 'SEO metadata, Open Graph tags and mobile-responsive layout.'],
                ],
            ],
            [
                'sort_order' => 4,
                'title' => 'Tazwar BD',
                'slug' => 'tazwar-bd',
                'summary' => 'Modern fashion lifestyle store and apparel catalogue.',
                'description' => 'Modern fashion and lifestyle apparel store from Chattogram built with WordPress, WooCommerce, and Elementor.',
                'business_type' => 'Fashion & Lifestyle Retail',
                'role' => 'Full-Stack Developer & Store Architect',
                'year' => 2024,
                'live_url' => 'https://tazwarbd.com/',
                'planet_style' => 'ringed',
                'accent_color' => '#A78BFA',
                'is_featured' => false,
                'is_published' => true,
                'tags' => ['WordPress', 'WooCommerce', 'Elementor', 'Ecommerce'],
                'features' => [
                    ['group' => 'Store', 'text' => 'Shop with categories for Polo, Dropshoulder, Coat and Bags, each showing its product count.'],
                    ['group' => 'Store', 'text' => 'Featured products and bestsellers sections with hover image swap.'],
                    ['group' => 'Store', 'text' => 'Variant products, quick view, compare, wishlist, add to cart, sale pricing.'],
                    ['group' => 'Account and checkout', 'text' => 'Cart, customer login, registration and account area.'],
                    ['group' => 'Marketing', 'text' => 'Announcement bar for free shipping, newsletter and FAQ links, social sharing buttons.'],
                    ['group' => 'Marketing', 'text' => 'Facebook pixel tracking, SEO metadata, Open Graph and Twitter cards.'],
                    ['group' => 'Technical', 'text' => 'Mobile-first responsive layout.'],
                ],
            ],
            [
                'sort_order' => 5,
                'title' => 'Sinbad Shipping Lines',
                'slug' => 'sinbad-shipping-lines',
                'summary' => 'Corporate shipping operations and vessel services portal.',
                'description' => 'Corporate maritime and vessel operations portal engineered with Laravel, Vue.js, Tailwind CSS, and MySQL with a custom administrative content dashboard.',
                'business_type' => 'Maritime Shipping & Logistics',
                'role' => 'Lead Full-Stack Developer',
                'year' => 2025,
                'live_url' => 'https://sinbadshippinglines.com/',
                'planet_style' => 'ocean',
                'accent_color' => '#84CC16',
                'is_featured' => true,
                'is_published' => true,
                'tags' => ['Laravel', 'Vue.js', 'Tailwind CSS', 'MySQL', 'Logistics'],
                'features' => [
                    ['group' => 'Content', 'text' => 'Four primary pages: Home, Services, About Us, Contact Us, with modular content sections.'],
                    ['group' => 'Content', 'text' => 'Services coverage: bulk vessel, bulk cargo, container shipping, sea freight, cargo handling, port and logistics support.'],
                    ['group' => 'Content', 'text' => 'International shipping routes connecting China, India, Thailand, Taiwan, Nepal, and Uzbekistan to Bangladesh with cargo type specifications.'],
                    ['group' => 'Content', 'text' => 'Corporate sections: who we are, vision, mission, regional network, customer commitment, licensing and compliance, leadership.'],
                    ['group' => 'Content', 'text' => 'Resources area: shipping guides, industry insights, and maritime news.'],
                    ['group' => 'Admin', 'text' => 'Dashboard where every component is editable with full CRUD capabilities.'],
                    ['group' => 'Technical', 'text' => 'On-page SEO architecture and a corporate design system crafted around the brand\'s lime-green identity.'],
                ],
            ],
            [
                'sort_order' => 6,
                'title' => 'Ayra España',
                'slug' => 'ayra-espana',
                'summary' => 'Electronics and gadget retailer serving Madrid and EU.',
                'description' => 'Multilingual electronics and consumer gadgets ecommerce store based in Madrid, built with WordPress, WooCommerce, and Elementor.',
                'business_type' => 'Consumer Electronics Retail',
                'role' => 'Full-Stack Developer & Ecommerce Architect',
                'year' => 2024,
                'live_url' => 'https://ayraespana.com/',
                'planet_style' => 'desert',
                'accent_color' => '#EF4444',
                'is_featured' => false,
                'is_published' => true,
                'tags' => ['WordPress', 'WooCommerce', 'Elementor', 'Ecommerce'],
                'features' => [
                    ['group' => 'Store', 'text' => 'Spanish and English versions with a language switcher.'],
                    ['group' => 'Store', 'text' => 'Mega-menu with deep categories (Accessories, Laptops, PCs, Smartphones by brand, Tablets, Games, Cameras, Appliances).'],
                    ['group' => 'Store', 'text' => 'Brand pages for 30+ leading consumer electronics brands.'],
                    ['group' => 'Marketing', 'text' => 'Deal sections with countdown timers, promo banners, and a promotional pop-up.'],
                    ['group' => 'Store', 'text' => 'Best-seller tabs and popular-product carousels by category.'],
                    ['group' => 'Store', 'text' => 'Product page extras: colour options, optional extended warranty (up to 4 years), return and exchange notes.'],
                    ['group' => 'Content', 'text' => 'Warranty claim page, contact page, blog, and newsletter signup.'],
                    ['group' => 'Account and checkout', 'text' => 'Euro pricing, wishlist, quick view, cart, and customer accounts.'],
                    ['group' => 'Marketing', 'text' => 'Free-shipping threshold progress bar.'],
                ],
            ],
        ];

        foreach ($projects as $data) {
            $tags = $data['tags'];
            $features = $data['features'];
            unset($data['tags'], $data['features']);

            $project = Project::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );

            // Sync tags
            $tagSyncData = [];
            $tagSort = 1;
            foreach ($tags as $tagName) {
                $tag = Tag::firstOrCreate(
                    ['slug' => Str::slug($tagName)],
                    ['name' => $tagName, 'slug' => Str::slug($tagName)]
                );
                $tagSyncData[$tag->id] = ['sort_order' => $tagSort++];
            }
            $project->tags()->sync($tagSyncData);

            // Seed features
            $featureSort = 1;
            // Clean previous features to prevent duplication on multiple seeds
            $project->features()->delete();
            foreach ($features as $feature) {
                ProjectFeature::create([
                    'project_id' => $project->id,
                    'group_label' => $feature['group'],
                    'text' => $feature['text'],
                    'sort_order' => $featureSort++,
                ]);
            }
        }
    }
}
