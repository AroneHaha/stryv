<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'description',
        'model_type',
        'model_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Action types
    const MEMBER_CREATED = 'member_created';
    const MEMBER_UPDATED = 'member_updated';
    const MEMBER_DELETED = 'member_deleted';
    const MEMBER_RENEWED = 'member_renewed';
    const EMPLOYEE_CREATED = 'employee_created';
    const EMPLOYEE_UPDATED = 'employee_updated';
    const EMPLOYEE_DELETED = 'employee_deleted';
    const ATTENDANCE_RECORDED = 'attendance_recorded';
    const ATTENDANCE_DELETED = 'attendance_deleted';
    const PAYROLL_GENERATED = 'payroll_generated';
    const PAYROLL_PAID = 'payroll_paid';
}