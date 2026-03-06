<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActionLog;
use App\Models\Attendance;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $today = today();
        
        $stats = [
            'total_members' => User::where('role', 'Member')->count(),
            'active_members' => User::where('role', 'Member')->where('status', 'Active')->count(),
            'total_employees' => User::where('role', 'Employee')->count(),
            'attendance_today' => Attendance::whereDate('date', $today)->count(),
            'members_today' => Attendance::whereDate('date', $today)->where('type', 'Member')->count(),
            'walk_ins_today' => Attendance::whereDate('date', $today)->where('type', 'Walk-in')->count(),
            'expired_today' => Attendance::whereDate('date', $today)->where('type', 'Expired')->count(),
            'revenue_today' => Attendance::whereDate('date', $today)->sum('price'),
            'pending_payroll' => Payroll::where('status', 'Unpaid')->count(),
        ];

        return $this->successResponse($stats);
    }

    public function recentActivity(Request $request): JsonResponse
    {
        $limit = $request->per_page ?? 20;
        
        $logs = ActionLog::with('user:id,name,role')
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return $this->successResponse($logs);
    }

    public function revenueChart(Request $request): JsonResponse
    {
        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;
        
        // Daily revenue for the month
        $dailyRevenue = Attendance::whereMonth('date', $month)
            ->whereYear('date', $year)
            ->selectRaw('DATE(date) as date, SUM(price) as total, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Payment method breakdown
        $paymentBreakdown = Attendance::whereMonth('date', $month)
            ->whereYear('date', $year)
            ->selectRaw('payment_method, SUM(price) as total, COUNT(*) as count')
            ->groupBy('payment_method')
            ->get();

        return $this->successResponse([
            'daily' => $dailyRevenue,
            'payment_breakdown' => $paymentBreakdown,
            'month' => $month,
            'year' => $year,
        ]);
    }
}