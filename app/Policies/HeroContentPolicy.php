<?php

namespace App\Policies;

use App\Models\User;

class HeroContentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isOwner();
    }

    public function update(User $user): bool
    {
        return $user->isOwner();
    }
}
