<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\MemberController;
use App\Http\Controllers\Api\V1\EmployeeController;
use App\Http\Controllers\Api\V1\AttendanceController;
use App\Http\Controllers\Api\V1\PayrollController;
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
    Route::get('/v1/members/{id}', [MemberController::class, 'show']);
    Route::put('/v1/members/{id}', [MemberController::class, 'update']);
    Route::patch('/v1/members/{id}', [MemberController::class, 'update']);
    Route::delete('/v1/members/{id}', [MemberController::class, 'destroy']);
    Route::post('/v1/members/{id}/renew', [MemberController::class, 'renew']);

    // Employees (Owner view only)
    Route::apiResource('/v1/employees', EmployeeController::class);
    Route::get('/v1/employees-active', [EmployeeController::class, 'active']);

    // Attendance - CUSTOM ROUTES FIRST, THEN {id} ROUTES
    Route::get('/v1/attendance', [AttendanceController::class, 'index']);
    Route::post('/v1/attendance', [AttendanceController::class, 'store']);
    Route::get('/v1/attendance/today', [AttendanceController::class, 'today']); 
    Route::get('/v1/attendance/stats', [AttendanceController::class, 'stats']); 
    Route::get('/v1/attendance/{id}', [AttendanceController::class, 'show']);   
    Route::delete('/v1/attendance/{id}', [AttendanceController::class, 'destroy']);

    // Payroll - Custom routes FIRST
    Route::get('/v1/payroll', [PayrollController::class, 'index']);
    Route::post('/v1/payroll', [PayrollController::class, 'store']);
    Route::post('/v1/payroll/generate', [PayrollController::class, 'generate']);
    Route::get('/v1/payroll/stats', [PayrollController::class, 'stats']);
    Route::get('/v1/payroll/{id}', [PayrollController::class, 'show']);
    Route::post('/v1/payroll/{id}/mark-paid', [PayrollController::class, 'markPaid']);
    Route::delete('/v1/payroll/{id}', [PayrollController::class, 'destroy']);
});

// Health check
Route::get('/health', fn () => response()->json(['status' => 'ok']));