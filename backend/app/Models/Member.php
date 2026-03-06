<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_type',
        'plan',
        'payment_method',
        'membership_price',
        'start_date',
        'expiration_date',
    ];

    protected $casts = [
        'membership_price' => 'decimal:2',
        'start_date' => 'date',
        'expiration_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return $this->expiration_date?->isPast() ?? false;
    }

    public function daysRemaining(): ?int
    {
        return $this->expiration_date?->diffInDays(now(), false);
    }
}