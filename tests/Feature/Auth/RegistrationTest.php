<?php

test('public registration URL returns 404', function () {
    $response = $this->get('/register');

    $response->assertNotFound();
});

test('posting to registration endpoint returns 404', function () {
    $response = $this->post('/register', [
        'name' => 'Stranger',
        'email' => 'stranger@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertNotFound();
});
