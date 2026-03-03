<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('name'); // Computed: first_name + last_name
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->enum('role', ['Owner', 'Employee', 'Member'])->default('Member');

            // Member-specific fields
            $table->enum('customer_type', ['Regular', 'Student'])->nullable();
            $table->enum('plan', ['6 Months', '1 Year'])->nullable();
            $table->enum('payment_method', ['Cash', 'GCash'])->nullable();
            $table->decimal('membership_price', 10, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->string('username')->nullable()->unique();
            $table->enum('status', ['Active', 'Expired', 'Inactive'])->default('Active');

            // Employee-specific fields
            $table->string('position')->nullable(); // Trainer, Receptionist, Manager, Maintenance
            $table->decimal('salary', 10, 2)->nullable();
            $table->date('date_hired')->nullable();

            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            // Indexes for common queries
            $table->index(['role', 'status']);
            $table->index('expiration_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};