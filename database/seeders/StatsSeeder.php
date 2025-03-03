<?php

namespace Database\Seeders;

use App\Models\Stats;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class StatsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 10; $i++) {
            Stats::create([
                'created_at' => Carbon::now()->subMonth()->startOfMonth()->addDays(rand(0, 29))
                    ->setTime(rand(0, 23), rand(0, 59), rand(0, 59)),
                'updated_at' => Carbon::now()->subMonth()->startOfMonth()->addDays(rand(0, 29))
                    ->setTime(rand(0, 23), rand(0, 59), rand(0, 59)),
            ]);
        }
    }
}
