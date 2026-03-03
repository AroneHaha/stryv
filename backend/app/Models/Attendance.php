<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'member_id',
        'name',
        'type',
        'customer_type',
        'payment_method',
        'price',
        'date',
        'time',
        'recorded_by',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'date' => 'date',
        'price' => 'decimal:2',
    ];

    // ==================== RELATIONSHIPS ====================

    public function member()
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    // ==================== SCOPES ====================

    public function scopeMembers($query)
    {
        return $query->where('type', 'Member');
    }

    public function scopeWalkIns($query)
    {
        return $query->where('type', 'Walk-in');
    }

    public function scopeExpired($query)
    {
        return $query->where('type', 'Expired');
    }

    public function scopeToday($query)
    {
        return $query->where('date', today());
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('date', now()->month)
                     ->whereYear('date', now()->year);
    }

    public function scopeThisYear($query)
    {
        return $query->whereYear('date', now()->year);
    }

    public function scopeByDate($query, $date)
    {
        return $query->where('date', $date);
    }

    public function scopeByMonth($query, int $month, int $year = null)
    {
        $year = $year ?? now()->year;
        return $query->whereMonth('date', $month)
                     ->whereYear('date', $year);
    }

    // ==================== HELPERS ====================

    public function isMember(): bool
    {
        return $this->type === 'Member';
    }

    public function isWalkIn(): bool
    {
        return $this->type === 'Walk-in';
    }

    public function isExpiredMember(): bool
    {
        return $this->type === 'Expired';
    }

    public function getFormattedTimeAttribute(): string
    {
        return \Carbon\Carbon::parse($this->time)->format('g:i A');
    }

    // ==================== STATIC HELPERS ====================

    /**
     * Get today's statistics
     */
    public static function getTodayStats(): array
    {
        $today = self::today();

        return [
            'total' => $today->count(),
            'members' => $today->members()->count(),
            'walk_ins' => $today->walkIns()->count(),
            'expired' => $today->expired()->count(),
            'revenue' => $today->sum('price'),
        ];
    }

    /**
     * Get monthly revenue
     */
    public static function getMonthlyRevenue(int $month, int $year): float
    {
        return self::byMonth($month, $year)->sum('price');
    }
}