<?php

use App\Models\User;
use Illuminate\Support\Facades\Config;

test('unauthenticated requests to /admin redirect to login', function () {
    $response = $this->get('/admin');

    $response->assertRedirect('/login');
});

test('incorrect credentials are rejected', function () {
    $response = $this->post('/login', [
        'email' => 'wrong@example.com',
        'password' => 'invalid-password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('configured owner can log in successfully', function () {
    Config::set('app.admin.email', 'owner@monayem.com');

    $owner = User::factory()->create([
        'email' => 'owner@monayem.com',
        'password' => 'secret123',
    ]);

    $response = $this->post('/login', [
        'email' => 'owner@monayem.com',
        'password' => 'secret123',
    ]);

    $this->assertAuthenticatedAs($owner);
    $response->assertRedirect('/admin');
});

test('non-owner user cannot access /admin and receives 403', function () {
    Config::set('app.admin.email', 'owner@monayem.com');

    $stranger = User::factory()->create([
        'email' => 'stranger@example.com',
    ]);

    $this->actingAs($stranger);

    $response = $this->get('/admin');

    $response->assertForbidden();
});

test('public registration URL returns 404', function () {
    $response = $this->get('/register');

    $response->assertNotFound();
});
