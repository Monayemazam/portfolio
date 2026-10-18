<?php

test('home page loads successfully', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});

test('login page loads successfully', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('app name is configured correctly', function () {
    expect(config('app.name'))->toBe('space-portfolio');
});
