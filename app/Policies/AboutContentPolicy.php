<?php

namespace App\Policies;

use App\Models\User;

class AboutContentPolicy
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
