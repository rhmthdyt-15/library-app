<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogRequestResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        Log::info('Incoming Request', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'payload' => $request->all(),
        ]);

        $response = $next($request);

        Log::info('Response Status', [
            'status' => $response->getStatusCode(),
        ]);

        return $response;
    }
}