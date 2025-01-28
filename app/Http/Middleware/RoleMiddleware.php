<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    const ROLE_ADMIN = 'admin';

    const ROLE_USER = 'user';


    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role)
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        if ($user->role !== $role) {
            $roleRedirects = [
                self::ROLE_ADMIN => 'admin.dashboard',
                self::ROLE_USER => 'dashboard',
            ];
            $route = $roleRedirects[$user->role] ?? 'login';

            return redirect()->route($route);
        }

        return $next($request);
    }
}