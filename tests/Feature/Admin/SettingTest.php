<?php

use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot view settings', function () {
    $response = $this->get('/admin/settings');
    $response->assertRedirect('/login');
});

test('owner can view settings screen', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/settings');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Settings/Index')
        ->has('settings')
    );
});

test('owner can update settings and cache is cleared', function () {
    $this->actingAs($this->owner);

    Cache::put('portfolio.page.v1', 'cached_portfolio_data');
    expect(Cache::has('portfolio.page.v1'))->toBeTrue();

    $response = $this->put('/admin/settings', [
        'settings' => [
            'site_title' => 'Monayem Azam - Lead Space Engineer',
            'default_theme' => 'dark',
            'dark_primary' => '#8B5CF6',
            'animation_level' => 'light',
            'contact_email' => 'monayem@example.com',
            'whatsapp_number' => '8801711223344',
            'booking_url' => 'https://cal.com/monayem',
            'github_url' => 'https://github.com/monayem',
        ],
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    // Verify database updates
    expect(Setting::where('key', 'site_title')->value('value'))->toBe('Monayem Azam - Lead Space Engineer');
    expect(Setting::where('key', 'default_theme')->value('value'))->toBe('dark');
    expect(Setting::where('key', 'dark_primary')->value('value'))->toBe('#8B5CF6');
    expect(Setting::where('key', 'animation_level')->value('value'))->toBe('light');
    expect(Setting::where('key', 'whatsapp_number')->value('value'))->toBe('8801711223344');
    expect(Setting::where('key', 'booking_url')->value('value'))->toBe('https://cal.com/monayem');

    // Verify cache was forgotten
    expect(Cache::has('portfolio.page.v1'))->toBeFalse();
});

test('invalid settings are rejected without changing database records', function () {
    $this->actingAs($this->owner);

    // Initial value
    Setting::where('key', 'whatsapp_number')->update(['value' => '123456789']);

    // Attempt invalid WhatsApp number with letters
    $response = $this->put('/admin/settings', [
        'settings' => [
            'whatsapp_number' => 'invalid-phone-abc',
        ],
    ]);

    $response->assertSessionHasErrors(['settings.whatsapp_number']);
    expect(Setting::where('key', 'whatsapp_number')->value('value'))->toBe('123456789');

    // Attempt non-https booking URL
    $response2 = $this->put('/admin/settings', [
        'settings' => [
            'booking_url' => 'http://insecure-site.com',
        ],
    ]);

    $response2->assertSessionHasErrors(['settings.booking_url']);

    // Attempt invalid animation level
    $response3 = $this->put('/admin/settings', [
        'settings' => [
            'animation_level' => 'hyperdrive',
        ],
    ]);

    $response3->assertSessionHasErrors(['settings.animation_level']);
});
