<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        if (auth()->user()->role !== $role) {
            return response()->json([
                'message' => 'Access denied. You do not have permission to access this resource.'
            ], 403);
        }

        return $next($request);
    }
}