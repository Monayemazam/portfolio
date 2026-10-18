<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Message;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin mission control dashboard.
     */
    public function index(Request $request): Response
    {
        $publishedProjectsCount = Project::query()->published()->count();
        $totalProjectsCount = Project::query()->count();
        $unreadMessagesCount = Message::query()->unread()->count();
        $totalMessagesCount = Message::query()->count();
        $skillsCount = Skill::query()->count();
        $mediaCount = Media::query()->count();

        $recentMessages = Message::query()
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'subject', 'read_at', 'created_at']);

        $recentProjects = Project::query()
            ->latest('updated_at')
            ->take(5)
            ->get(['id', 'title', 'slug', 'planet_style', 'is_published', 'updated_at']);

        return Inertia::render('Admin/Dashboard', [
            'counts' => [
                'published_projects' => $publishedProjectsCount,
                'total_projects' => $totalProjectsCount,
                'unread_messages' => $unreadMessagesCount,
                'total_messages' => $totalMessagesCount,
                'skills' => $skillsCount,
                'media' => $mediaCount,
            ],
            'recent_messages' => $recentMessages,
            'recent_projects' => $recentProjects,
            'system' => [
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'server_time' => now()->toIso8601String(),
                'environment' => app()->environment(),
            ],
        ]);
    }
}
