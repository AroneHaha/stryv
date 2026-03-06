<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'employee_name',
        'salary',
        'month',
        'year',
        'status',
        'paid_at',
        'marked_by',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function marker()
    {
        return $this->belongsTo(User::class, 'marked_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'Pending');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'Paid');
    }

    public function scopeForMonth($query, int $month, int $year)
    {
        return $query->where('month', $month)->where('year', $year);
    }

    public function isPaid(): bool
    {
        return $this->status === 'Paid';
    }
}