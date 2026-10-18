<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isOwner();
    }

    public function view(User $user, Project $project): bool
    {
        return $user->isOwner();
    }

    public function create(User $user): bool
    {
        return $user->isOwner();
    }

    public function update(User $user, Project $project): bool
    {
        return $user->isOwner();
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->isOwner();
    }

    public function restore(User $user, Project $project): bool
    {
        return $user->isOwner();
    }

    public function forceDelete(User $user, Project $project): bool
    {
        return $user->isOwner();
    }
}
