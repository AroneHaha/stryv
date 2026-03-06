<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
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

    public function user()
    {
        return $this->belongsTo(User::class);
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