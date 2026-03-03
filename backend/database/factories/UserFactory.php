<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = \App\Models\User::class;

    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'Member',
            'status' => 'Active',
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user is an owner.
     */
    public function owner(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'Owner',
        ]);
    }

    /**
     * Indicate that the user is an employee.
     */
    public function employee(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'Employee',
            'position' => fake()->randomElement(['Trainer', 'Receptionist', 'Manager', 'Maintenance']),
            'salary' => fake()->numberBetween(12000, 25000),
            'date_hired' => fake()->dateTimeBetween('-2 years', 'now'),
        ]);
    }

    /**
     * Indicate that the user is a member.
     */
    public function member(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'Member',
            'customer_type' => fake()->randomElement(['Regular', 'Student']),
            'plan' => fake()->randomElement(['6 Months', '1 Year']),
            'payment_method' => fake()->randomElement(['Cash', 'GCash']),
            'start_date' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }
}