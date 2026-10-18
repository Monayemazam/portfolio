<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = (string) config('app.admin.email', 'monayem@example.com');
        $name = (string) config('app.admin.name', 'Monayem Azam');
        $password = (string) config('app.admin.password', 'password');

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make((string) $password),
                'email_verified_at' => now(),
            ]
        );
    }
}
