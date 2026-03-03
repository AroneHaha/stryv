<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'name',
        'email',
        'password',
        'phone',
        'role',
        // Member fields
        'customer_type',
        'plan',
        'payment_method',
        'membership_price',
        'start_date',
        'expiration_date',
        'username',
        'status',
        // Employee fields
        'position',
        'salary',
        'date_hired',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'membership_price' => 'decimal:2',
        'salary' => 'decimal:2',
        'start_date' => 'date',
        'expiration_date' => 'date',
        'date_hired' => 'date',
    ];

    // ==================== ROLE CHECKS ====================

    public function isOwner(): bool
    {
        return $this->role === 'Owner';
    }

    public function isEmployee(): bool
    {
        return $this->role === 'Employee';
    }

    public function isMember(): bool
    {
        return $this->role === 'Member';
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['Owner', 'Employee']);
    }

    // ==================== STATUS CHECKS ====================

    public function isActive(): bool
    {
        return $this->status === 'Active';
    }

    public function isExpired(): bool
    {
        return $this->expiration_date && $this->expiration_date < now()->startOfDay();
    }

    public function isExpiringSoon(int $days = 7): bool
    {
        if (!$this->expiration_date) return false;
        return $this->expiration_date->isFuture() &&
               $this->expiration_date->diffInDays(now()) <= $days;
    }

    public function getMembershipStatusAttribute(): string
    {
        if ($this->isExpired()) return 'Expired';
        if ($this->isExpiringSoon()) return 'Expiring Soon';
        return 'Active';
    }

    public function getDaysUntilExpirationAttribute(): int
    {
        if (!$this->expiration_date) return 0;
        return (int) now()->diffInDays($this->expiration_date, false);
    }

    // ==================== RELATIONSHIPS ====================

    // Member's attendance records
    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'member_id');
    }

    // Attendance records recorded by this user
    public function recordedAttendances()
    {
        return $this->hasMany(Attendance::class, 'recorded_by');
    }

    // Employee's payroll records
    public function payrolls()
    {
        return $this->hasMany(Payroll::class, 'employee_id');
    }

    // Payroll records marked by this user
    public function markedPayrolls()
    {
        return $this->hasMany(Payroll::class, 'marked_by');
    }

    // Member's membership history
    public function memberships()
    {
        return $this->hasMany(Membership::class, 'member_id');
    }

    // Memberships processed by this user
    public function processedMemberships()
    {
        return $this->hasMany(Membership::class, 'processed_by');
    }

    // Action logs
    public function actionLogs()
    {
        return $this->hasMany(ActionLog::class);
    }

    // ==================== SCOPES ====================

    public function scopeOwners($query)
    {
        return $query->where('role', 'Owner');
    }

    public function scopeEmployees($query)
    {
        return $query->where('role', 'Employee');
    }

    public function scopeMembers($query)
    {
        return $query->where('role', 'Member');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'Inactive');
    }

    public function scopeExpired($query)
    {
        return $query->where('expiration_date', '<', now()->startOfDay());
    }

    public function scopeExpiringSoon($query, int $days = 7)
    {
        return $query->where('expiration_date', '>=', now()->startOfDay())
                     ->where('expiration_date', '<=', now()->addDays($days));
    }

    // ==================== BOOT ====================

    protected static function boot()
    {
        parent::boot();

        // Auto-generate name from first_name and last_name
        static::saving(function ($user) {
            $user->name = trim($user->first_name . ' ' . $user->last_name);
        });
    }
}