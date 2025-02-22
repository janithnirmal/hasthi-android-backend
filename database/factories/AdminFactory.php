<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'),
            'mobile' => $this->faker->phoneNumber,
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'role' => $this->faker->randomElement(['super_admin', 'admin']),
        ];
    }
}
