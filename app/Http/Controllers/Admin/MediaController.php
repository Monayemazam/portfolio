<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReplaceMediaRequest;
use App\Http\Requests\Admin\UpdateMediaRequest;
use App\Http\Requests\Admin\UploadMediaRequest;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function __construct(
        protected MediaService $mediaService
    ) {}

    /**
     * Display a listing of media items.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $this->authorize('viewAny', Media::class);

        $query = Media::query();

        if ($type = $request->input('type')) {
            if (in_array($type, ['image', 'video', 'document'], true)) {
                $query->where('type', $type);
            }
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('original_name', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%");
            });
        }

        $sort = $request->input('sort', 'newest');
        match ($sort) {
            'oldest' => $query->orderBy('created_at', 'asc'),
            'name' => $query->orderBy('original_name', 'asc'),
            'size' => $query->orderBy('size_bytes', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $perPage = (int) $request->input('per_page', 24);
        $media = $query->paginate($perPage)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json($media);
        }

        return Inertia::render('Admin/Media/Index', [
            'media' => $media,
            'filters' => [
                'type' => $request->input('type', ''),
                'search' => $request->input('search', ''),
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Store a newly uploaded media item or batch of items.
     */
    public function store(UploadMediaRequest $request): RedirectResponse|JsonResponse
    {
        $this->authorize('create', Media::class);

        $uploaded = [];

        if ($request->hasFile('file')) {
            /** @var UploadedFile $file */
            $file = $request->file('file');
            $uploaded[] = $this->mediaService->store($file, $request->input('alt_text'));
        } elseif ($request->hasFile('files')) {
            $files = $request->file('files');
            if (is_array($files)) {
                foreach ($files as $file) {
                    $uploaded[] = $this->mediaService->store($file);
                }
            }
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Files uploaded successfully.',
                'media' => $uploaded,
            ], 201);
        }

        return back()->with('success', count($uploaded).' media file(s) uploaded successfully.');
    }

    /**
     * Update the specified media metadata.
     */
    public function update(UpdateMediaRequest $request, Media $media): RedirectResponse|JsonResponse
    {
        $this->authorize('update', $media);

        /** @var array{alt_text?: string|null, original_name?: string} $validated */
        $validated = $request->validated();
        $updated = $this->mediaService->update($media, $validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Media updated successfully.',
                'media' => $updated,
            ]);
        }

        return back()->with('success', 'Media metadata updated.');
    }

    /**
     * Replace the physical media file while preserving ID and references.
     */
    public function replace(ReplaceMediaRequest $request, Media $media): RedirectResponse|JsonResponse
    {
        $this->authorize('update', $media);

        /** @var UploadedFile $file */
        $file = $request->file('file');
        $replaced = $this->mediaService->replace($media, $file);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Media file replaced successfully.',
                'media' => $replaced,
            ]);
        }

        return back()->with('success', 'Media file replaced successfully.');
    }

    /**
     * Remove the specified media item if not in use.
     */
    public function destroy(Request $request, Media $media): RedirectResponse|JsonResponse
    {
        $this->authorize('delete', $media);

        try {
            $this->mediaService->delete($media);

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Media deleted successfully.']);
            }

            return back()->with('success', 'Media deleted successfully.');
        } catch (ValidationException $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'errors' => $e->errors(),
                ], 422);
            }

            return back()->withErrors($e->errors())->with('error', $e->getMessage());
        }
    }
}
