<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
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
            'settings' => ['required', 'array'],
            'settings.site_title' => ['nullable', 'string', 'max:255'],
            'settings.site_tagline' => ['nullable', 'string', 'max:255'],
            'settings.logo_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'settings.favicon_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'settings.photo_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'settings.default_theme' => ['nullable', 'in:system,dark,light'],
            'settings.dark_primary' => ['nullable', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/'],
            'settings.dark_secondary' => ['nullable', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/'],
            'settings.dark_accent' => ['nullable', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/'],
            'settings.light_primary' => ['nullable', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/'],
            'settings.light_secondary' => ['nullable', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/'],
            'settings.light_accent' => ['nullable', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/'],
            'settings.animation_level' => ['nullable', 'in:full,light,off'],
            'settings.contact_email' => ['nullable', 'email:rfc', 'max:255'],
            'settings.contact_phone' => ['nullable', 'string', 'max:50'],
            'settings.whatsapp_number' => ['nullable', 'regex:/^[0-9]+$/', 'max:30'],
            'settings.booking_url' => ['nullable', 'url', 'starts_with:https://', 'max:255'],
            'settings.github_url' => ['nullable', 'url', 'starts_with:https://', 'max:255'],
            'settings.linkedin_url' => ['nullable', 'url', 'starts_with:https://', 'max:255'],
            'settings.facebook_url' => ['nullable', 'url', 'starts_with:https://', 'max:255'],
            'settings.x_url' => ['nullable', 'url', 'starts_with:https://', 'max:255'],
            'settings.youtube_url' => ['nullable', 'url', 'starts_with:https://', 'max:255'],
            'settings.resume_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'settings.analytics_provider' => ['nullable', 'in:none,plausible,ga4'],
            'settings.analytics_id' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'settings.whatsapp_number.regex' => 'The WhatsApp number must contain digits only.',
            'settings.booking_url.starts_with' => 'The booking URL must be a secure HTTPS URL.',
            'settings.github_url.starts_with' => 'The GitHub URL must be a secure HTTPS URL.',
            'settings.linkedin_url.starts_with' => 'The LinkedIn URL must be a secure HTTPS URL.',
            'settings.facebook_url.starts_with' => 'The Facebook URL must be a secure HTTPS URL.',
            'settings.x_url.starts_with' => 'The X/Twitter URL must be a secure HTTPS URL.',
            'settings.youtube_url.starts_with' => 'The YouTube URL must be a secure HTTPS URL.',
            'settings.contact_email.email' => 'Please provide a valid email address.',
        ];
    }
}
