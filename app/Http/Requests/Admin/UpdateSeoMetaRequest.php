<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSeoMetaRequest extends FormRequest
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
        return [
            'meta_title' => ['required', 'string', 'max:70'],
            'meta_description' => ['required', 'string', 'max:170'],
            'og_image_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'canonical_url' => ['nullable', 'url', 'max:255'],
            'person_job_title' => ['nullable', 'string', 'max:100'],
            'person_same_as' => ['nullable', 'array'],
            'person_same_as.*' => ['nullable', 'url', 'max:255'],
            'robots' => ['required', 'string', 'max:50'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'meta_title.max' => 'Meta title cannot exceed 70 characters.',
            'meta_description.max' => 'Meta description cannot exceed 170 characters.',
        ];
    }
}
