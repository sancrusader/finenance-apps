<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Dashboard\UserPanelController;
use App\Http\Controllers\Dashboard\AdminPanelController;
use App\Http\Controllers\Kun\ExtractImageController;
use App\Http\Controllers\Kun\NotaController;

// Dashboard Admin
Route::prefix('app')->middleware(['auth', 'role:admin', 'verified'])->group(function () {
    Route::get('/', [AdminPanelController::class, 'index'])->name('admin.dashboard');

});

// Dashboard User
Route::prefix('/')->middleware(['auth', 'role:user', 'verified'])->group(function () {
    // Dashboard user
    Route::get('/', [UserPanelController::class, 'index'])->name('dashboard');
    // menampilkan kamera
    Route::get('kun', [ExtractImageController::class, 'index'])->name('kun.index');
    // Kirim gambar ke open ai
    Route::post('kun', [ExtractImageController::class, 'analyzeImage'])->name('kun.store');
    // Menampilkan List Nota
    Route::get('kun/nota', [NotaController::class, 'index'])->name('kun.nota');
});

// Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
