<?php

namespace App\Http\Requests\Admin;

use App\Models\Project;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = $this->user();

        return $user !== null && $user->isOwner();
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Project|null $project */
        $project = $this->route('project');
        $projectId = $project instanceof Project ? $project->id : null;

        return [
            'title' => ['required', 'string', 'max:150'],
            'slug' => [
                'required',
                'string',
                'max:160',
                'alpha_dash',
                Rule::unique('projects', 'slug')->ignore($projectId),
            ],
            'summary' => ['required', 'string', 'max:300'],
            'description' => ['nullable', 'string'],
            'business_type' => ['nullable', 'string', 'max:150'],
            'role' => ['nullable', 'string', 'max:150'],
            'year' => ['nullable', 'integer', 'between:2000,2100'],
            'live_url' => ['required', 'url', 'starts_with:https://', 'max:255'],
            'planet_style' => ['required', 'in:rocky,station,amber,ringed,ocean,desert,generic'],
            'accent_color' => ['nullable', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/'],
            'cover_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'show_live_preview' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],

            'tags' => ['nullable', 'array'],
            'tags.*.id' => ['nullable', 'integer', 'exists:tags,id'],
            'tags.*.name' => ['nullable', 'string', 'max:60'],
            'tags.*.sort_order' => ['nullable', 'integer', 'min:0'],

            'features' => ['nullable', 'array'],
            'features.*.group_label' => ['required', 'string', 'max:80'],
            'features.*.text' => ['required', 'string', 'max:500'],
            'features.*.sort_order' => ['nullable', 'integer', 'min:0'],

            'media' => ['nullable', 'array'],
            'media.*.media_id' => ['required', 'integer', 'exists:media,id'],
            'media.*.kind' => ['required', 'in:desktop,mobile,video,other'],
            'media.*.caption' => ['nullable', 'string', 'max:200'],
            'media.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'live_url.starts_with' => 'The live URL must be a secure HTTPS link.',
            'slug.unique' => 'This project slug is already taken. Please choose a unique slug.',
            'summary.max' => 'The project summary cannot exceed 300 characters.',
        ];
    }
}
