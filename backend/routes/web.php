<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'STRYV Fitness API',
        'version' => '1.0.0',
    ]);
});