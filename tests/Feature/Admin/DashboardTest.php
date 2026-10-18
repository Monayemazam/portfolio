<?php

use App\Models\User;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('owner can view admin dashboard with correct initial metrics', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Dashboard')
        ->has('counts.published_projects')
        ->has('counts.unread_messages')
        ->has('counts.skills')
        ->has('counts.media')
        ->has('system.php_version')
    );
});
