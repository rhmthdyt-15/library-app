<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UserSeeder::class);
        // Jalankan seeder kategori dulu (misal kamu punya ini)
        $this->call(CategorySeeder::class);

        // Baru jalankan BookSeeder
        $this->call(BookSeeder::class);
    }
}