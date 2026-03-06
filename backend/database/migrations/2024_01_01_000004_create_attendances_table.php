<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->enum('type', ['Member', 'Walk-in', 'Expired']);
            $table->enum('customer_type', ['Regular', 'Student']);
            $table->enum('payment_method', ['Cash', 'GCash']);
            $table->decimal('price', 10, 2)->default(0);
            $table->date('date');
            $table->time('time');
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->index(['date', 'type']);
            $table->index('member_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};