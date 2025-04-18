<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
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

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/{book}', [BookController::class, 'show']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{categories}', [CategoryController::class, 'show']);

    // Admin-only routes
    Route::middleware('admin')->group(function() {
         // Book management (admin only)
        Route::post('/books', [BookController::class, 'store']);
        Route::put('/books/{book}', [BookController::class, 'update']);
        Route::delete('/books/{book}', [BookController::class, 'destroy']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{categories}', [CategoryController::class, 'update']);
        Route::delete('/categories/{categories}', [CategoryController::class, 'destroy']);

        // Borrowing management (admin features)
        Route::post('/borrowings/{borrowings}/return', [BorrowingController::class, 'returnBook']);
        Route::post('/borrowings-with-admin', [BorrowingController::class, 'createBorrowingWithAdmin']);
        Route::get('/check-overdue', [BorrowingController::class, 'checkOverdue']);

         // Reports
        Route::get('/reports/dashboard', [ReportController::class, 'dashboard']);
        Route::get('/reports/borrowings', [ReportController::class, 'borrowingReport']);
        Route::get('/reports/users', [ReportController::class, 'userReport']);
        Route::get('/reports/books', [ReportController::class, 'bookReport']);

        //user
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });

    // Borrowing routes (some available to all users)
    Route::get('/borrowings', [BorrowingController::class, 'index']);
    Route::post('/borrowings', [BorrowingController::class, 'store']);
    Route::get('/borrowings/{borrowings}', [BorrowingController::class, 'show']);
    Route::put('/borrowings/{borrowings}/extend', [BorrowingController::class, 'extend']);

    // Dashboard Member
    Route::get('/dashboard/summary', [BorrowingController::class, 'memberDashboardSummary']);
    Route::get('/dashboard/current-borrowings', [BorrowingController::class, 'currentBorrowings']);
    Route::get('/dashboard/recommendations', [BookController::class, 'recommendations']);

});