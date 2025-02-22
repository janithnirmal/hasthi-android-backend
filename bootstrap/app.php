<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api([
            \App\Http\Middleware\ResponseProtocol::class,
        ]);

        $middleware->alias([
            'abilities' => CheckAbilities::class,
            'ability' => CheckForAnyAbility::class,
            'admin.auth' => \App\Http\Middleware\AdminAuth::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            '/admin/login',
            '/admin/logout',
            '/admin/register',
            'admin/update',
            'admin/delete',
            'admin/event/store',
            'admin/event/update',
            'admin/event/delete',
            '/ticket/create',
            '/ticket/update',
            '/ticket/delete',
            'admin/menu/create',
            'admin/menu/update',
            'admin/menu/delete',
            'admin/menu/status',
            'admin/category/create',
            'admin/category/update',
            'admin/category/delete',
        ]);

        // $middleware->web([
        // \Illuminate\Session\Middleware\StartSession::class,
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
