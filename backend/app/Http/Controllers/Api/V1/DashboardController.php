<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return $this->successResponse([
            'members' => $this->getMemberStats(),
            'employees' => $this->getEmployeeStats(),
            'attendance' => $this->getAttendanceStats(),
            'revenue' => $this->getRevenueStats(),
            'payroll' => $this->getPayrollStats(),
        ]);
    }

    private function getMemberStats(): array
    {
        return [
            'total' => User::where('role', 'Member')->count(),
            'active' => User::where('role', 'Member')->where('status', 'Active')->count(),
            'expired' => User::where('role', 'Member')->where('expiration_date', '<', now())->count(),
            'newThisMonth' => User::where('role', 'Member')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];
    }

    private function getEmployeeStats(): array
    {
        return [
            'total' => User::where('role', 'Employee')->count(),
            'active' => User::where('role', 'Employee')->where('status', 'Active')->count(),
        ];
    }

    private function getAttendanceStats(): array
    {
        $today = Attendance::where('date', today());

        return [
            'today' => [
                'total' => $today->count(),
                'members' => $today->clone()->where('type', 'Member')->count(),
                'walkIns' => $today->clone()->where('type', 'Walk-in')->count(),
                'revenue' => $today->sum('price'),
            ],
        ];
    }

    private function getRevenueStats(): array
    {
        return [
            'today' => Attendance::where('date', today())->sum('price'),
            'thisMonth' => Attendance::whereMonth('date', now()->month)
                ->whereYear('date', now()->year)
                ->sum('price'),
            'thisYear' => Attendance::whereYear('date', now()->year)->sum('price'),
        ];
    }

    private function getPayrollStats(): array
    {
        $currentMonth = Payroll::where('month', now()->month)
            ->where('year', now()->year);

        return [
            'thisMonth' => [
                'total' => $currentMonth->sum('salary'),
                'paid' => $currentMonth->clone()->where('status', 'Paid')->sum('salary'),
                'unpaid' => $currentMonth->clone()->where('status', 'Unpaid')->sum('salary'),
            ],
        ];
    }
}