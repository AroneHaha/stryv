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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name'); // Snapshot of name at time of attendance
            $table->enum('type', ['Member', 'Walk-in', 'Expired'])->default('Walk-in');
            $table->enum('customer_type', ['Regular', 'Student'])->default('Regular');
            $table->enum('payment_method', ['Cash', 'GCash', 'N/A'])->default('Cash');
            $table->decimal('price', 8, 2)->default(0);
            $table->date('date');
            $table->time('time');
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // Indexes for common queries
            $table->index(['date', 'type']);
            $table->index('member_id');
            $table->index(['member_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};