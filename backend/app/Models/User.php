<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Member;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\Payroll;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'name',
        'email',
        'password',
        'phone',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    // Relationships
    public function member()
    {
        return $this->hasOne(Member::class);
    }

    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class, 'employee_id');
    }

    // Role Checks
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

    // Scopes
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
}