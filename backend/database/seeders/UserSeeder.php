<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('users')->insert([
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone_number' => '081234567891',
                'address' => 'Jl. Merdeka No. 1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Siti Aminah',
                'email' => 'siti.aminah@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone_number' => '081234567892',
                'address' => 'Jl. Sudirman No. 2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone_number' => '081234567893',
                'address' => 'Jl. Diponegoro No. 3',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi.lestari@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone_number' => '081234567894',
                'address' => 'Jl. Gajah Mada No. 4',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}