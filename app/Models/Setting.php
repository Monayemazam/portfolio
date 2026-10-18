<?php

namespace App\Models;

use Database\Factories\SettingFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $group
 * @property string $key
 * @property string|null $value
 * @property string $type
 * @property string $label
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Setting extends Model
{
    /** @use HasFactory<SettingFactory> */
    use HasFactory;

    protected $table = 'settings';

    protected $fillable = [
        'group',
        'key',
        'value',
        'type',
        'label',
    ];

    /**
     * @param  Builder<Setting>  $query
     */
    public function scopeGroup(Builder $query, string $group): void
    {
        $query->where('group', $group);
    }
}
