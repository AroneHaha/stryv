<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position',
        'salary',
        'date_hired',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
        'date_hired' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class, 'employee_id', 'user_id');
    }
}