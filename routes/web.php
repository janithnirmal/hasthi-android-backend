<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;


// ============= ⚙️ CORE ROUTES ⚙️ ===============
//
//

// routes:core ⚙️
// component load
Route::get('/comp/panel/{name}', function (string $name) {
    $viewPath = "components.panels.$name";
    if (view()->exists($viewPath)) {
        return view($viewPath);
    } else {
        return view("components.404");
    }
});


// routes:utility 🔧
//
// ==========================================


// ============= 🔓 CLIENT ROUTES 🔓 ===============
//
//

// routes:pages [client]
// site pages 📜
Route::get('/', function () {
    return view('pages.client.home');
});

Route::get('/home', function () {
    return view('pages.client.home');
})->name("client-home");

Route::get('/menu', function () {
    return view('pages.client.menu');
});

Route::get('/events', function () {
    return view('pages.client.events');
});

Route::get('/about', function () {
    return view('pages.client.about');
});


Route::get('/contact', function () {
    return view('pages.client.contact');
});


// policy pages ⚖️
Route::get('/privacy-policy', function () {
    return view('pages.client.privacy-policy');
})->name("privacy-policy");

Route::get('/terms-and-conditions', function () {
    return view('pages.client.terms-and-conditions');
})->name('terms-and-conditions');



// user accounts pages 🙍‍♂️
Route::get('/login', function () {
    return view('pages.client.signin');
})->name("login");

Route::get('/register', function () {
    return view('pages.client.signup');
})->name("register");

Route::get('/account', function () {
    return view('pages.client.account');
});

Route::get('/forgot-password', function () {
    return view('pages.client.forgot-password');
});
// ==========================================


// ============= 🔒 ADMIN ROUTES 🔒 ===============
// routes:pages [Admin]
// site pages 📜
Route::get('/admin/login', function () {
    return view('pages.admin.login');
})->name('admin.login');

//protected routes
Route::middleware('admin.auth')->group(function () {
    // admin dashboard
    Route::get('/admin', function () {
        return view('pages.admin.home');
    })->name('admin.home');
});

// ============= 👨‍🔧 WEB API ROUTES 👨‍🔧 ===============

//routes:admin [Admin]
// admin auth route ⚙️
Route::post('/admin/login', [AdminAuthController::class, 'login']);

//protected routes for admin
Route::middleware('admin.auth')->prefix('admin')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::post('/register', [AdminController::class, 'register']);
    Route::put('/update', [AdminController::class, 'update']);
    Route::delete('/delete', [AdminController::class, 'destroy']);
    Route::get('/list', [AdminController::class, 'index']);
    Route::get('/profile', [AdminController::class, 'show']);
});

// ==========================================








// ============= 🧪 TEST ROUTES 🧪 ===============
//session test
Route::get('/admin/session', [AdminAuthController::class, 'sessionRetrieve']);

//
// ==========================================