<?php

use App\Http\Controllers\PlaygroundController;
use Illuminate\Support\Facades\Route;

// Test
Route::get('/', [PlaygroundController::class, 'index'])->name('home');

Route::post('/play/db', [PlaygroundController::class, 'storeRecord'])->name('play.db.store');
Route::delete('/play/db/{record}', [PlaygroundController::class, 'deleteRecord'])->name('play.db.delete');

Route::post('/play/session/inc', [PlaygroundController::class, 'incrementSession'])->name('play.session.inc');
Route::post('/play/session/clear', [PlaygroundController::class, 'clearSession'])->name('play.session.clear');

Route::post('/play/auth/register', [PlaygroundController::class, 'register'])->name('play.auth.register');
Route::post('/play/auth/login', [PlaygroundController::class, 'login'])->name('play.auth.login');
Route::post('/play/auth/logout', [PlaygroundController::class, 'logout'])->name('play.auth.logout');

Route::post('/play/jobs/dispatch', [PlaygroundController::class, 'dispatchJob'])->name('play.jobs.dispatch');
Route::post('/play/jobs/batch', [PlaygroundController::class, 'dispatchBatch'])->name('play.jobs.batch');

Route::post('/play/activity/log', [PlaygroundController::class, 'logActivity'])->name('play.activity.log');
Route::post('/play/activity/clear', [PlaygroundController::class, 'clearActivities'])->name('play.activity.clear');
