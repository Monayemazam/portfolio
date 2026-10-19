<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Models\Message;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class ContactController extends Controller
{
    /**
     * Handle incoming contact form submission.
     */
    public function store(StoreMessageRequest $request): RedirectResponse|JsonResponse
    {
        $ip = $request->ip() ?? 'unknown';
        $limiterKey = 'contact-submission:' . $ip;

        // Rate limit: 5 submissions per hour per IP
        if (RateLimiter::tooManyAttempts($limiterKey, 5)) {
            $seconds = RateLimiter::availableIn($limiterKey);
            $minutes = ceil($seconds / 60);

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => "Too many submissions. Please try again in {$minutes} minutes.",
                ], 429);
            }

            return back()->withErrors([
                'rate_limit' => "Transmission frequency limit reached. Please retry in {$minutes} minutes.",
            ]);
        }

        // Honeypot check: silently accept without saving if bot filled it
        if (! empty($request->input('company_hp'))) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Transmission received.']);
            }
            return back()->with('success', 'Thank you! Your message has been received.');
        }

        RateLimiter::hit($limiterKey, 3600);

        $validated = $request->validated();

        $message = Message::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'] ?? 'Website Inquiry',
            'body' => $validated['message'],
            'ip_address' => $ip,
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
            'read_at' => null,
        ]);

        // Attempt notification email if contact_email is configured
        $contactEmail = Setting::where('key', 'contact_email')->value('value');
        if ($contactEmail && filter_var($contactEmail, FILTER_VALIDATE_EMAIL)) {
            try {
                Mail::raw(
                    "You received a new message from {$message->name} ({$message->email}):\n\nSubject: {$message->subject}\n\nMessage:\n{$message->body}",
                    function ($mail) use ($contactEmail, $message) {
                        $mail->to($contactEmail)
                            ->subject("Portfolio Message: {$message->subject}")
                            ->replyTo($message->email, $message->name);
                    }
                );
            } catch (\Throwable $e) {
                Log::warning('Could not send contact notification email: ' . $e->getMessage());
            }
        }

        $successText = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';

        if ($request->wantsJson()) {
            return response()->json(['message' => $successText, 'id' => $message->id]);
        }

        return back()->with('success', $successText);
    }
}
