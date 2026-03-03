<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tracks membership renewal history
     */
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('users')->cascadeOnDelete();
            $table->enum('plan', ['6 Months', '1 Year']);
            $table->enum('customer_type', ['Regular', 'Student']);
            $table->enum('payment_method', ['Cash', 'GCash']);
            $table->decimal('price', 10, 2);
            $table->date('start_date');
            $table->date('expiration_date');
            $table->enum('status', ['Active', 'Expired'])->default('Active');
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // Indexes for common queries
            $table->index(['member_id', 'status']);
            $table->index('expiration_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};