<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->enum('customer_type', ['Regular', 'Student']);
            $table->enum('plan', ['6 Months', '1 Year']);
            $table->enum('payment_method', ['Cash', 'GCash']);
            $table->decimal('membership_price', 10, 2);
            $table->date('start_date');
            $table->date('expiration_date');
            $table->timestamps();

            $table->index('expiration_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};