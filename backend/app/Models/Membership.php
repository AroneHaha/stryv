<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Membership extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'member_id',
        'plan',
        'customer_type',
        'payment_method',
        'price',
        'start_date',
        'expiration_date',
        'status',
        'processed_by',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'price' => 'decimal:2',
        'start_date' => 'date',
        'expiration_date' => 'date',
    ];

    // ==================== RELATIONSHIPS ====================

    public function member()
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    // ==================== SCOPES ====================

    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'Expired');
    }

    public function scopeByPlan($query, string $plan)
    {
        return $query->where('plan', $plan);
    }

    // ==================== HELPERS ====================

    public function isActive(): bool
    {
        return $this->status === 'Active';
    }

    public function isExpired(): bool
    {
        return $this->status === 'Expired' || $this->expiration_date < now()->startOfDay();
    }

    public function getDurationInMonths(): int
    {
        return $this->plan === '6 Months' ? 6 : 12;
    }

    // ==================== STATIC HELPERS ====================

    /**
     * Calculate price based on plan and customer type
     */
    public static function calculatePrice(string $plan, string $customerType): float
    {
        $prices = [
            '6 Months' => [
                'Regular' => 1000,
                'Student' => 800,
            ],
            '1 Year' => [
                'Regular' => 2000,
                'Student' => 1600,
            ],
        ];

        return $prices[$plan][$customerType] ?? 0;
    }

    /**
     * Calculate expiration date based on plan
     */
    public static function calculateExpirationDate(string $startDate, string $plan): string
    {
        $months = $plan === '6 Months' ? 6 : 12;
        return now()->parse($startDate)->addMonths($months)->toDateString();
    }
}
