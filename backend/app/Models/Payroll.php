<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
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

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'salary' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    // ==================== RELATIONSHIPS ====================

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function marker()
    {
        return $this->belongsTo(User::class, 'marked_by');
    }

    // ==================== SCOPES ====================

    public function scopePaid($query)
    {
        return $query->where('status', 'Paid');
    }

    public function scopeUnpaid($query)
    {
        return $query->where('status', 'Unpaid');
    }

    public function scopeByMonth($query, int $month)
    {
        return $query->where('month', $month);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('year', $year);
    }

    public function scopeByEmployee($query, int $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    public function scopeCurrentMonth($query)
    {
        return $query->where('month', now()->month)
                     ->where('year', now()->year);
    }

    // ==================== HELPERS ====================

    public function isPaid(): bool
    {
        return $this->status === 'Paid';
    }

    public function isUnpaid(): bool
    {
        return $this->status === 'Unpaid';
    }

    public function markAsPaid(int $markedBy): bool
    {
        return $this->update([
            'status' => 'Paid',
            'paid_at' => now(),
            'marked_by' => $markedBy,
        ]);
    }

    public function getPeriodAttribute(): string
    {
        $months = [
            1 => 'January', 2 => 'February', 3 => 'March', 4 => 'April',
            5 => 'May', 6 => 'June', 7 => 'July', 8 => 'August',
            9 => 'September', 10 => 'October', 11 => 'November', 12 => 'December'
        ];
        return ($months[$this->month] ?? 'Unknown') . ' ' . $this->year;
    }

    // ==================== STATIC HELPERS ====================

    /**
     * Get payroll totals for a given month/year
     */
    public static function getTotals(?int $month = null, ?int $year = null): array
    {
        $month = $month ?? now()->month;
        $year = $year ?? now()->year;

        $query = self::byMonth($month)->byYear($year);

        return [
            'total' => $query->sum('salary'),
            'paid' => $query->paid()->sum('salary'),
            'unpaid' => $query->unpaid()->sum('salary'),
            'paid_count' => $query->paid()->count(),
            'unpaid_count' => $query->unpaid()->count(),
        ];
    }

    /**
     * Generate payroll for active employees for a given month/year
     */
    public static function generateForMonth(int $month, int $year): int
    {
        $activeEmployees = User::employees()->active()
            ->where('date_hired', '<=', now()->parse("$year-$month-01"))
            ->get();

        $generated = 0;

        foreach ($activeEmployees as $employee) {
            // Check if payroll already exists
            $exists = self::where('employee_id', $employee->id)
                ->where('month', $month)
                ->where('year', $year)
                ->exists();

            if (!$exists) {
                self::create([
                    'employee_id' => $employee->id,
                    'employee_name' => $employee->name,
                    'salary' => $employee->salary,
                    'month' => $month,
                    'year' => $year,
                    'status' => 'Unpaid',
                ]);
                $generated++;
            }
        }

        return $generated;
    }
}