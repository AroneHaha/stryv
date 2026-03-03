<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application.
|
*/

// Root route - redirect to API info
Route::get('/', function () {
    return response()->json([
        'name' => 'STRYV Fitness API',
        'version' => '1.0.0',
        'endpoints' => [
            'login' => 'POST /api/v1/login',
            'logout' => 'POST /api/v1/logout (requires auth)',
            'me' => 'GET /api/v1/me (requires auth)',
            'members' => 'GET/POST /api/v1/members (requires auth)',
            'employees' => 'GET/POST /api/v1/employees (requires Owner)',
            'attendance' => 'GET/POST /api/v1/attendance (requires auth)',
            'payroll' => 'GET/POST /api/v1/payroll (requires Owner)',
            'health' => 'GET /api/health',
        ],
        'test_credentials' => [
            'owner' => 'admin@stryv.com / password',
            'employee' => 'carlos@stryv.com / password',
            'member' => 'juan@gmail.com / password',
        ],
    ]);
});