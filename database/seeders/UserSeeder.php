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
        User::create([
            "first_name" => "User",
            "last_name" => "Account",
            "email" => "user@gmail.com",
            "mobile" => "0780780788",
            "password" => Hash::make("0780780788"),
        ]);

        User::factory()->count(10)->create();
    }
}
