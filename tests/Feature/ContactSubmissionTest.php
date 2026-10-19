<?php

use App\Models\Message;
use Illuminate\Support\Facades\RateLimiter;

beforeEach(function () {
    $this->seed();
    RateLimiter::clear('contact-submission:127.0.0.1');
});

test('public contact form submission stores message in database', function () {
    $payload = [
        'name' => 'Dr. Elena Rostova',
        'email' => 'elena@deepspace-observatory.org',
        'subject' => 'Orbital Systems Integration Inquiry',
        'message' => 'We would love to discuss developing an interactive astrophysics visualization platform using Three.js and Laravel.',
        'company_hp' => '', // honeypot empty
    ];

    $response = $this->post('/contact', $payload);

    $response->assertSessionHas('success');
    
    $this->assertDatabaseHas('messages', [
        'name' => 'Dr. Elena Rostova',
        'email' => 'elena@deepspace-observatory.org',
        'subject' => 'Orbital Systems Integration Inquiry',
        'body' => 'We would love to discuss developing an interactive astrophysics visualization platform using Three.js and Laravel.',
        'read_at' => null,
    ]);
});

test('honeypot field prevents message from being saved', function () {
    $payload = [
        'name' => 'Spam Bot 3000',
        'email' => 'bot@spammer.net',
        'subject' => 'Get rich quick',
        'message' => 'Spam contents',
        'company_hp' => 'I am a spam bot', // honeypot filled!
    ];

    $response = $this->post('/contact', $payload);

    $this->assertDatabaseMissing('messages', [
        'email' => 'bot@spammer.net',
    ]);
});

test('contact form validates required fields', function () {
    $response = $this->post('/contact', [
        'name' => '',
        'email' => 'not-an-email',
        'message' => '',
    ]);

    $response->assertSessionHasErrors(['name', 'email', 'message']);
});
