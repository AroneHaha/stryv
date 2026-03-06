<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            
            // Common fields (all roles)
            $table->string('first_name');
            $table->string('last_name');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->enum('role', ['Owner', 'Employee', 'Member'])->default('Member');
            $table->enum('status', ['Active', 'Expired', 'Inactive'])->default('Active');
            
            // Member-specific fields (nullable)
            $table->date('birthdate')->nullable();
            $table->string('username')->nullable()->unique();
            $table->enum('customer_type', ['Regular', 'Student'])->nullable();
            $table->enum('plan', ['6 Months', '1 Year'])->nullable();
            $table->enum('payment_method', ['Cash', 'GCash'])->nullable();
            $table->decimal('membership_price', 10, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('expiration_date')->nullable();
            
            // Employee-specific fields (nullable)
            $table->enum('position', ['Trainer', 'Receptionist', 'Manager', 'Maintenance'])->nullable();
            $table->decimal('salary', 10, 2)->nullable();
            $table->date('date_hired')->nullable();
            
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['role', 'status']);
            $table->index('email');
            $table->index('username');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};