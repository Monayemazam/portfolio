<?php

namespace App\Policies;

use App\Models\ProcessStep;
use App\Models\User;

class ProcessStepPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isOwner();
    }

    public function view(User $user, ProcessStep $processStep): bool
    {
        return $user->isOwner();
    }

    public function create(User $user): bool
    {
        return $user->isOwner();
    }

    public function update(User $user, ProcessStep $processStep): bool
    {
        return $user->isOwner();
    }

    public function delete(User $user, ProcessStep $processStep): bool
    {
        return $user->isOwner();
    }
}
