<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'Owner',
            'name' => 'Admin Owner',
            'email' => 'admin@stryv.com',
            'password' => Hash::make('password'),
            'phone' => '09123456789',
            'role' => 'Owner',
            'status' => 'Active',
        ]);

        $this->command->info('Test user created: admin@stryv.com / password');
    }
}