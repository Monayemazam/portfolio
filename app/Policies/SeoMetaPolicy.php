<?php

namespace App\Policies;

use App\Models\SeoMeta;
use App\Models\User;

class SeoMetaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isOwner();
    }

    public function view(User $user, SeoMeta $seoMeta): bool
    {
        return $user->isOwner();
    }

    public function update(User $user, SeoMeta $seoMeta): bool
    {
        return $user->isOwner();
    }
}
