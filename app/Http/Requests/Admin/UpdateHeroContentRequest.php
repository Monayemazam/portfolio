<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateHeroContentRequest extends FormRequest
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
            'eyebrow' => ['nullable', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:150'],
            'primary_button_label' => ['required', 'string', 'max:60'],
            'primary_button_url' => ['required', 'string', 'max:255'],
            'secondary_button_label' => ['required', 'string', 'max:60'],
            'secondary_button_url' => ['required', 'string', 'max:255'],
        ];
    }
}
