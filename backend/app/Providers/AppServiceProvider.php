<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Log semua query SQL
        DB::listen(function ($query) {
            Log::info('QUERY LOG', [
                'query' => $query->sql,
                'binding' => $query->bindings,
                'time' => $query->time,
            ]);
        });
    }
}