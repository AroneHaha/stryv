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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('users')->cascadeOnDelete();
            $table->string('employee_name'); // Snapshot of name
            $table->decimal('salary', 10, 2);
            $table->integer('month'); // 1-12
            $table->integer('year');
            $table->enum('status', ['Paid', 'Unpaid'])->default('Unpaid');
            $table->timestamp('paid_at')->nullable();
            $table->foreignId('marked_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // Unique constraint to prevent duplicate payroll for same employee/month/year
            $table->unique(['employee_id', 'month', 'year']);

            // Indexes for common queries
            $table->index(['month', 'year', 'status']);
            $table->index('employee_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};