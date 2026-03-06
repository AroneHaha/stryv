<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\MemberController;
use App\Http\Controllers\Api\V1\EmployeeController;
use App\Http\Controllers\Api\V1\AttendanceController;
use App\Http\Controllers\Api\V1\PayrollController;
use App\Http\Controllers\Api\V1\DashboardController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/v1/login', [AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/v1/logout', [AuthController::class, 'logout']);
    Route::get('/v1/me', [AuthController::class, 'me']);

    // Members
    Route::get('/v1/members', [MemberController::class, 'index']);
    Route::post('/v1/members', [MemberController::class, 'store']);
    Route::get('/v1/members/{member}', [MemberController::class, 'show']);
    Route::put('/v1/members/{member}', [MemberController::class, 'update']);
    Route::patch('/v1/members/{member}', [MemberController::class, 'update']);
    Route::delete('/v1/members/{member}', [MemberController::class, 'destroy']);
    Route::post('/v1/members/{member}/renew', [MemberController::class, 'renew']);

    // Employees (Owner only)
    Route::get('/v1/employees', [EmployeeController::class, 'index']);
    Route::post('/v1/employees', [EmployeeController::class, 'store']);
    Route::get('/v1/employees/active', [EmployeeController::class, 'active']);
    Route::get('/v1/employees/{employee}', [EmployeeController::class, 'show']);
    Route::put('/v1/employees/{employee}', [EmployeeController::class, 'update']);
    Route::patch('/v1/employees/{employee}', [EmployeeController::class, 'update']);
    Route::delete('/v1/employees/{employee}', [EmployeeController::class, 'destroy']);

    // Attendance - CUSTOM ROUTES FIRST
    Route::get('/v1/attendance', [AttendanceController::class, 'index']);
    Route::post('/v1/attendance', [AttendanceController::class, 'store']);
    Route::get('/v1/attendance/today', [AttendanceController::class, 'today']);
    Route::get('/v1/attendance/stats', [AttendanceController::class, 'stats']);
    Route::get('/v1/attendance/{attendance}', [AttendanceController::class, 'show']);
    Route::delete('/v1/attendance/{attendance}', [AttendanceController::class, 'destroy']);

    // Payroll - Custom routes FIRST
    Route::get('/v1/payroll', [PayrollController::class, 'index']);
    Route::post('/v1/payroll', [PayrollController::class, 'store']);
    Route::post('/v1/payroll/generate', [PayrollController::class, 'generate']);
    Route::get('/v1/payroll/stats', [PayrollController::class, 'stats']);
    Route::get('/v1/payroll/{payroll}', [PayrollController::class, 'show']);
    Route::post('/v1/payroll/{payroll}/mark-paid', [PayrollController::class, 'markPaid']);
    Route::delete('/v1/payroll/{payroll}', [PayrollController::class, 'destroy']);

    // Dashboard (Owner & Employee)
    Route::get('/v1/dashboard', [DashboardController::class, 'index']);
    Route::get('/v1/dashboard/recent-activity', [DashboardController::class, 'recentActivity']);
    Route::get('/v1/dashboard/revenue-chart', [DashboardController::class, 'revenueChart']);
});

// Health check
Route::get('/health', fn () => response()->json(['status' => 'ok']));