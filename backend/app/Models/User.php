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

    protected $fillable = [
        // Common fields
        'first_name',
        'last_name',
        'name',
        'email',
        'password',
        'phone',
        'role',
        'status',
        
        // Member fields
        'birthdate',
        'username',
        'customer_type',
        'plan',
        'payment_method',
        'membership_price',
        'start_date',
        'expiration_date',
        
        // Employee fields
        'position',
        'salary',
        'date_hired',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'start_date' => 'date',
        'expiration_date' => 'date',
        'date_hired' => 'date',
        'membership_price' => 'decimal:2',
        'salary' => 'decimal:2',
        'password' => 'hashed',
    ];

    // Relationships
    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'member_id');
    }

    public function recordedAttendances()
    {
        return $this->hasMany(Attendance::class, 'recorded_by');
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class, 'employee_id');
    }

    public function markedPayrolls()
    {
        return $this->hasMany(Payroll::class, 'marked_by');
    }

    // Role checks
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

    public function isActive(): bool
    {
        return $this->status === 'Active';
    }

    // Scopes
    public function scopeMembers($query)
    {
        return $query->where('role', 'Member');
    }

    public function scopeEmployees($query)
    {
        return $query->whereIn('role', ['Owner', 'Employee']);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }
}