<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Message::class);

        $filter = $request->query('filter', 'all');
        $search = $request->query('q');

        $query = match ($filter) {
            'unread' => Message::query()->unread(),
            'read' => Message::query()->read(),
            default => Message::query(),
        };

        if ($search) {
            $query->where(function ($sub) use ($search) {
                $sub->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%");
            });
        }

        $messages = $query->latest()->get();

        $counts = [
            'all' => Message::count(),
            'unread' => Message::unread()->count(),
            'read' => Message::read()->count(),
        ];

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
            'filter' => $filter,
            'search' => $search ?? '',
            'counts' => $counts,
            'selectedId' => $request->query('selected') ? (int) $request->query('selected') : null,
        ]);
    }

    public function markRead(Message $message): RedirectResponse
    {
        $this->authorize('update', $message);

        $message->update(['read_at' => now()]);

        return back()->with('success', 'Message marked as read.');
    }

    public function markUnread(Message $message): RedirectResponse
    {
        $this->authorize('update', $message);

        $message->update(['read_at' => null]);

        return back()->with('success', 'Message marked as unread.');
    }

    public function destroy(Message $message): RedirectResponse
    {
        $this->authorize('delete', $message);

        $name = $message->name;
        $message->delete();

        return back()->with('success', "Message from '{$name}' deleted.");
    }
}
