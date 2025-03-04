<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Order::create([
            'orderItems' => json_encode([
                [
                    'name' => 'Burger',
                    'price' => 10.99,
                    'quantity' => 2,
                ],
                [
                    'name' => 'Fries',
                    'price' => 5.99,
                    'quantity' => 1,
                ],
            ]),
            'userUID' => '12hg123gh1g31231231',
            'totalPrice' => 27.97,
            'status' => 'Pending',
        ]);

        Order::create([
            'orderItems' => json_encode([
                [
                    'name' => 'Burger',
                    'price' => 15.99,
                    'quantity' => 1,
                ],
            ]),
            'userUID' => '12hg123gh1g31231231',
            'totalPrice' => 57.67,
            'status' => 'Pending',
        ]);
    }
}
