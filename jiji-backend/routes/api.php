<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FileController;

Route::get('/files', [FileController::class, 'list']);
Route::post('/files', [FileController::class, 'store']);
Route::get('/files/{id}', [FileController::class, 'edit']);
Route::put('/files/{id}', [FileController::class, 'update']);
Route::delete('/files/{id}', [FileController::class, 'destroy']);
Route::get('/files/{id}/download', [FileController::class, 'download']);

Route::get('/health-check', function () {
    return response()->json(['status' => 'API is working']);
});
