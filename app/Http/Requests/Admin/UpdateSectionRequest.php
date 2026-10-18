<?php

namespace App\Http\Requests\Admin;

use App\Models\Section;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateSectionRequest extends FormRequest
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
            'nav_label' => ['required', 'string', 'max:50'],
            'eyebrow' => ['nullable', 'string', 'max:100'],
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string'],
            'is_visible' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                /** @var Section|null $section */
                $section = $this->route('section');

                if ($section && in_array($section->key, ['hero', 'footer'], true)) {
                    if (! $this->boolean('is_visible')) {
                        $validator->errors()->add('is_visible', 'The '.ucfirst($section->key).' section cannot be hidden.');
                    }
                }
            },
        ];
    }
}
