<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',  // Change from 'user_id' to 'member_id'
        'name',
        'type',
        'customer_type',
        'payment_method',
        'price',
        'date',
        'time',
        'recorded_by',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'date' => 'date',
    ];

    public function member()
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('date', today());
    }

    public function scopeMembers($query)
    {
        return $query->where('type', 'Member');
    }

    public function scopeWalkIns($query)
    {
        return $query->where('type', 'Walk-in');
    }
}