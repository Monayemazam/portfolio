<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General
            [
                'group' => 'general',
                'key' => 'site_title',
                'value' => 'Monayem Azam | Full-Stack Web Developer',
                'type' => 'string',
                'label' => 'Site Title',
            ],
            [
                'group' => 'general',
                'key' => 'site_tagline',
                'value' => 'Full-Stack Web Developer turning ideas into practical, reliable digital products.',
                'type' => 'string',
                'label' => 'Site Tagline',
            ],
            [
                'group' => 'general',
                'key' => 'logo_media_id',
                'value' => null,
                'type' => 'media',
                'label' => 'Logo Media ID',
            ],
            [
                'group' => 'general',
                'key' => 'favicon_media_id',
                'value' => null,
                'type' => 'media',
                'label' => 'Favicon Media ID',
            ],
            [
                'group' => 'general',
                'key' => 'photo_media_id',
                'value' => null,
                'type' => 'media',
                'label' => 'Profile Photo Media ID',
            ],

            // Theme
            [
                'group' => 'theme',
                'key' => 'default_theme',
                'value' => 'dark',
                'type' => 'string',
                'label' => 'Default Theme',
            ],
            [
                'group' => 'theme',
                'key' => 'dark_primary',
                'value' => '#F15A24',
                'type' => 'color',
                'label' => 'Dark Theme Primary',
            ],
            [
                'group' => 'theme',
                'key' => 'dark_secondary',
                'value' => '#173C32',
                'type' => 'color',
                'label' => 'Dark Theme Secondary',
            ],
            [
                'group' => 'theme',
                'key' => 'dark_accent',
                'value' => '#D5F34A',
                'type' => 'color',
                'label' => 'Dark Theme Accent',
            ],
            [
                'group' => 'theme',
                'key' => 'light_primary',
                'value' => '#F15A24',
                'type' => 'color',
                'label' => 'Light Theme Primary',
            ],
            [
                'group' => 'theme',
                'key' => 'light_secondary',
                'value' => '#173C32',
                'type' => 'color',
                'label' => 'Light Theme Secondary',
            ],
            [
                'group' => 'theme',
                'key' => 'light_accent',
                'value' => '#D5F34A',
                'type' => 'color',
                'label' => 'Light Theme Accent',
            ],

            // Effects
            [
                'group' => 'effects',
                'key' => 'animation_level',
                'value' => 'full',
                'type' => 'string',
                'label' => 'Animation Level',
            ],

            // Contact
            [
                'group' => 'contact',
                'key' => 'contact_email',
                'value' => null,
                'type' => 'email',
                'label' => 'Contact Email',
            ],
            [
                'group' => 'contact',
                'key' => 'contact_phone',
                'value' => null,
                'type' => 'string',
                'label' => 'Contact Phone',
            ],
            [
                'group' => 'contact',
                'key' => 'whatsapp_number',
                'value' => null,
                'type' => 'string',
                'label' => 'WhatsApp Number',
            ],
            [
                'group' => 'contact',
                'key' => 'booking_url',
                'value' => null,
                'type' => 'url',
                'label' => 'Booking URL',
            ],

            // Social
            [
                'group' => 'social',
                'key' => 'github_url',
                'value' => null,
                'type' => 'url',
                'label' => 'GitHub URL',
            ],
            [
                'group' => 'social',
                'key' => 'linkedin_url',
                'value' => null,
                'type' => 'url',
                'label' => 'LinkedIn URL',
            ],
            [
                'group' => 'social',
                'key' => 'facebook_url',
                'value' => null,
                'type' => 'url',
                'label' => 'Facebook URL',
            ],
            [
                'group' => 'social',
                'key' => 'x_url',
                'value' => null,
                'type' => 'url',
                'label' => 'X (Twitter) URL',
            ],
            [
                'group' => 'social',
                'key' => 'youtube_url',
                'value' => null,
                'type' => 'url',
                'label' => 'YouTube URL',
            ],

            // Files
            [
                'group' => 'files',
                'key' => 'resume_media_id',
                'value' => null,
                'type' => 'media',
                'label' => 'Resume File Media ID',
            ],

            // Analytics
            [
                'group' => 'analytics',
                'key' => 'analytics_provider',
                'value' => 'none',
                'type' => 'string',
                'label' => 'Analytics Provider',
            ],
            [
                'group' => 'analytics',
                'key' => 'analytics_id',
                'value' => null,
                'type' => 'string',
                'label' => 'Analytics ID',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
