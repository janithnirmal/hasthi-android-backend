<?php

use App\Models\Menu;
use App\Models\Order;
use Database\Seeders\AdminSeeder;
use Database\Seeders\OrderSeeder;
use Database\Seeders\StatsSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UserSeeder::class,
            AdminSeeder::class,
            StatsSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
