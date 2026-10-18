<?php

use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    $this->seed();
    Config::set('app.admin.email', 'owner@monayem.com');
    $this->owner = User::factory()->create(['email' => 'owner@monayem.com']);
});

test('guest cannot access messages inbox', function () {
    $response = $this->get('/admin/messages');
    $response->assertRedirect('/login');
});

test('owner can view messages inbox', function () {
    $this->actingAs($this->owner);

    $response = $this->get('/admin/messages');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Messages/Index')
        ->has('messages')
        ->has('counts')
    );
});

test('inserting a test message by SQL shows it in inbox as unread and updates count', function () {
    $this->actingAs($this->owner);

    // Insert directly into MySQL
    DB::table('messages')->insert([
        'name' => 'Commander Shepard',
        'email' => 'shepard@normandy.space',
        'subject' => 'Normandy Systems Telemetry Consultation',
        'body' => 'Need advice on quantum entanglement communication arrays and Laravel backend microservices.',
        'ip_address' => '192.168.1.100',
        'read_at' => null,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->get('/admin/messages');
    $response->assertOk();

    // Verify unread count matches database query
    $unreadCount = Message::query()->unread()->count();
    expect($unreadCount)->toBeGreaterThanOrEqual(1);

    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Messages/Index')
        ->where('counts.unread', $unreadCount)
        ->has('messages')
    );

    $emails = collect($response->original->getData()['page']['props']['messages'])->pluck('email');
    expect($emails)->toContain('shepard@normandy.space');
});

test('owner can mark message as read and unread', function () {
    $this->actingAs($this->owner);

    $msg = Message::create([
        'name' => 'Garrus Vakarian',
        'email' => 'garrus@citadel.space',
        'subject' => 'Calibrations Inquiry',
        'body' => 'Can you calibrate the solar system rendering pipeline?',
        'read_at' => null,
    ]);

    expect($msg->read_at)->toBeNull();

    // Mark as read
    $readResponse = $this->patch("/admin/messages/{$msg->id}/read");
    $readResponse->assertSessionHasNoErrors();
    expect($msg->fresh()->read_at)->not->toBeNull();

    // Mark as unread
    $unreadResponse = $this->patch("/admin/messages/{$msg->id}/unread");
    $unreadResponse->assertSessionHasNoErrors();
    expect($msg->fresh()->read_at)->toBeNull();
});

test('owner can delete a message', function () {
    $this->actingAs($this->owner);

    $msg = Message::create([
        'name' => 'Spam Bot',
        'email' => 'spam@junk.com',
        'body' => 'Unwanted inquiry.',
    ]);

    $id = $msg->id;
    $response = $this->delete("/admin/messages/{$id}");
    $response->assertSessionHasNoErrors();

    expect(Message::find($id))->toBeNull();
});

test('owner can filter inbox by unread and read status', function () {
    $this->actingAs($this->owner);

    $readMsg = Message::create([
        'name' => 'Read User',
        'email' => 'read@example.com',
        'body' => 'Read body',
        'read_at' => now(),
    ]);

    $unreadMsg = Message::create([
        'name' => 'Unread User',
        'email' => 'unread@example.com',
        'body' => 'Unread body',
        'read_at' => null,
    ]);

    $unreadResponse = $this->get('/admin/messages?filter=unread');
    $unreadResponse->assertOk();
    $unreadEmails = collect($unreadResponse->original->getData()['page']['props']['messages'])->pluck('email');
    expect($unreadEmails)->toContain('unread@example.com');
    expect($unreadEmails)->not->toContain('read@example.com');

    $readResponse = $this->get('/admin/messages?filter=read');
    $readResponse->assertOk();
    $readEmails = collect($readResponse->original->getData()['page']['props']['messages'])->pluck('email');
    expect($readEmails)->toContain('read@example.com');
    expect($readEmails)->not->toContain('unread@example.com');
});
