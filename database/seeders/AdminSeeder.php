<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a super admin for test data
        Admin::factory()->create(
            [
                'first_name' => 'Janith',
                'last_name' => 'Nirmal',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('Admin@123'),
                'role' => 'super_admin',
                'status' => 'active',
            ]
        );

        // Create a super admin for test data
        Admin::factory()->create(
            [
                'first_name' => 'Madusha',
                'last_name' => 'Pravinda',
                'email' => 'staff@gmail.com',
                'password' => bcrypt('Staff@123'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        Admin::factory()->count(1)->create();
    }
}
