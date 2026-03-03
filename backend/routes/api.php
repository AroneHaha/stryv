<?php


use App\Http\Controllers\Api\V1\AttendanceController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\EmployeeController;
use App\Http\Controllers\Api\V1\MemberController;
use App\Http\Controllers\Api\V1\MemberPortalController;
use App\Http\Controllers\Api\V1\PayrollController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API Version 1
Route::prefix('v1')->group(function () {

    // ==================== PUBLIC ROUTES ====================

    // Authentication
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    // ==================== PROTECTED ROUTES ====================
    Route::middleware('auth:sanctum')->group(function () {

        // ------------------ Auth ------------------
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::post('/logout-all', [AuthController::class, 'logoutAll'])->name('logout.all');
        Route::get('/me', [AuthController::class, 'me'])->name('me');

        // ------------------ Dashboard (Owner & Employee) ------------------
        Route::middleware('role:Owner,Employee')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
            Route::get('/dashboard/recent-activity', [DashboardController::class, 'recentActivity'])->name('dashboard.recent-activity');
            Route::get('/dashboard/action-logs', [DashboardController::class, 'actionLogs'])->name('dashboard.action-logs');
            Route::get('/dashboard/revenue-chart', [DashboardController::class, 'revenueChart'])->name('dashboard.revenue-chart');
        });

        // ------------------ Members (Owner & Employee) ------------------
        Route::middleware('role:Owner,Employee')->group(function () {
            Route::get('/members', [MemberController::class, 'index'])->name('members.index');
            Route::post('/members', [MemberController::class, 'store'])->name('members.store');
            Route::get('/members/{member}', [MemberController::class, 'show'])->name('members.show');
            Route::put('/members/{member}', [MemberController::class, 'update'])->name('members.update');
            Route::patch('/members/{member}', [MemberController::class, 'update'])->name('members.patch');
            Route::delete('/members/{member}', [MemberController::class, 'destroy'])->name('members.destroy');
            Route::post('/members/{member}/renew', [MemberController::class, 'renew'])->name('members.renew');
            Route::post('/members/{member}/toggle-status', [MemberController::class, 'toggleStatus'])->name('members.toggle-status');
        });

        // ------------------ Employees (Owner only) ------------------
        Route::middleware('role:Owner')->group(function () {
            Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
            Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
            Route::get('/employees/active', [EmployeeController::class, 'active'])->name('employees.active');
            Route::get('/employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
            Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
            Route::patch('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.patch');
            Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
            Route::post('/employees/{employee}/toggle-status', [EmployeeController::class, 'toggleStatus'])->name('employees.toggle-status');
        });

        // ------------------ Attendance (Owner & Employee) ------------------
        Route::middleware('role:Owner,Employee')->group(function () {
            Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
            Route::post('/attendance', [AttendanceController::class, 'store'])->name('attendance.store');
            Route::get('/attendance/today', [AttendanceController::class, 'today'])->name('attendance.today');
            Route::get('/attendance/stats', [AttendanceController::class, 'stats'])->name('attendance.stats');
            Route::get('/attendance/daily-revenue', [AttendanceController::class, 'dailyRevenue'])->name('attendance.daily-revenue');
            Route::get('/attendance/monthly-revenue', [AttendanceController::class, 'monthlyRevenue'])->name('attendance.monthly-revenue');
            Route::get('/attendance/{attendance}', [AttendanceController::class, 'show'])->name('attendance.show');
            Route::delete('/attendance/{attendance}', [AttendanceController::class, 'destroy'])->name('attendance.destroy');
        });

        // ------------------ Payroll (Owner only) ------------------
        Route::middleware('role:Owner')->group(function () {
            Route::get('/payroll', [PayrollController::class, 'index'])->name('payroll.index');
            Route::post('/payroll', [PayrollController::class, 'store'])->name('payroll.store');
            Route::get('/payroll/stats', [PayrollController::class, 'stats'])->name('payroll.stats');
            Route::get('/payroll/years', [PayrollController::class, 'years'])->name('payroll.years');
            Route::post('/payroll/generate', [PayrollController::class, 'generate'])->name('payroll.generate');
            Route::post('/payroll/refresh', [PayrollController::class, 'refresh'])->name('payroll.refresh');
            Route::get('/payroll/{payroll}', [PayrollController::class, 'show'])->name('payroll.show');
            Route::post('/payroll/{payroll}/mark-paid', [PayrollController::class, 'markPaid'])->name('payroll.mark-paid');
            Route::delete('/payroll/{payroll}', [PayrollController::class, 'destroy'])->name('payroll.destroy');
        });

        // ------------------ Member Portal (Member only) ------------------
        Route::middleware('role:Member')->prefix('member')->group(function () {
            Route::get('/profile', [MemberPortalController::class, 'profile'])->name('member.profile');
            Route::get('/attendance', [MemberPortalController::class, 'attendance'])->name('member.attendance');
            Route::get('/stats', [MemberPortalController::class, 'stats'])->name('member.stats');
            Route::get('/calendar', [MemberPortalController::class, 'calendar'])->name('member.calendar');
            Route::post('/check-in', [MemberPortalController::class, 'checkIn'])->name('member.check-in');
        });
    });
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});
