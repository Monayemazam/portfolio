<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

class ReplaceMediaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isOwner() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $fileValidator = function (string $attribute, mixed $value, \Closure $fail): void {
            if (! $value instanceof UploadedFile) {
                $fail('The replacement item must be a valid file.');

                return;
            }

            $mime = $value->getMimeType() ?: '';
            $sizeKb = $value->getSize() / 1024;

            $allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
            $allowedVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime'];
            $allowedDocMimes = ['application/pdf'];

            if (in_array($mime, $allowedImageMimes)) {
                if ($sizeKb > 5120) {
                    $fail('Images must not exceed 5 MB.');
                }
            } elseif (in_array($mime, $allowedVideoMimes)) {
                if ($sizeKb > 10240) {
                    $fail('Videos must not exceed 10 MB.');
                }
            } elseif (in_array($mime, $allowedDocMimes)) {
                if ($sizeKb > 10240) {
                    $fail('PDF documents must not exceed 10 MB.');
                }
            } else {
                $fail('Only images (JPEG, PNG, WebP, GIF, SVG), videos (MP4, WebM), and PDFs are supported.');
            }
        };

        return [
            'file' => ['required', 'file', $fileValidator],
        ];
    }
}
