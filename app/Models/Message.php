<?php

namespace App\Models;

use Database\Factories\MessageFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $subject
 * @property string $body
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property Carbon|null $read_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Message extends Model
{
    /** @use HasFactory<MessageFactory> */
    use HasFactory;

    protected $table = 'messages';

    protected $fillable = [
        'name',
        'email',
        'subject',
        'body',
        'ip_address',
        'user_agent',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    /**
     * @param  Builder<Message>  $query
     */
    public function scopeUnread(Builder $query): void
    {
        $query->whereNull('read_at');
    }

    /**
     * @param  Builder<Message>  $query
     */
    public function scopeRead(Builder $query): void
    {
        $query->whereNotNull('read_at');
    }
}
