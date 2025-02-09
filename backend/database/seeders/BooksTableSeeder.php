<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BooksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('books')->insert([
            [
                'title' => 'The Great Gatsby',
                'author' => 'F. Scott Fitzgerald',
                'isbn' => Str::random(13),
                'description' => 'A novel set in the 1920s.',
                'category' => 'Fiction',
                'stock' => 10,
                'rack_location' => 'A1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'To Kill a Mockingbird',
                'author' => 'Harper Lee',
                'isbn' => Str::random(13),
                'description' => 'A novel about racial injustice.',
                'category' => 'Fiction',
                'stock' => 8,
                'rack_location' => 'A2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => '1984',
                'author' => 'George Orwell',
                'isbn' => Str::random(13),
                'description' => 'Dystopian social science fiction novel.',
                'category' => 'Science Fiction',
                'stock' => 15,
                'rack_location' => 'B1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Moby-Dick',
                'author' => 'Herman Melville',
                'isbn' => Str::random(13),
                'description' => 'The story of Captain Ahab’s quest for revenge.',
                'category' => 'Adventure',
                'stock' => 5,
                'rack_location' => 'C3',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Pride and Prejudice',
                'author' => 'Jane Austen',
                'isbn' => Str::random(13),
                'description' => 'A romantic novel of manners.',
                'category' => 'Romance',
                'stock' => 12,
                'rack_location' => 'D2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'The Catcher in the Rye',
                'author' => 'J.D. Salinger',
                'isbn' => Str::random(13),
                'description' => 'A story about teenage rebellion.',
                'category' => 'Fiction',
                'stock' => 7,
                'rack_location' => 'E1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Brave New World',
                'author' => 'Aldous Huxley',
                'isbn' => Str::random(13),
                'description' => 'A futuristic dystopian novel.',
                'category' => 'Science Fiction',
                'stock' => 9,
                'rack_location' => 'B2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'The Hobbit',
                'author' => 'J.R.R. Tolkien',
                'isbn' => Str::random(13),
                'description' => 'A fantasy novel about Bilbo Baggins.',
                'category' => 'Fantasy',
                'stock' => 20,
                'rack_location' => 'F1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'War and Peace',
                'author' => 'Leo Tolstoy',
                'isbn' => Str::random(13),
                'description' => 'A historical novel set in Russia.',
                'category' => 'Historical Fiction',
                'stock' => 6,
                'rack_location' => 'G3',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'The Lord of the Rings',
                'author' => 'J.R.R. Tolkien',
                'isbn' => Str::random(13),
                'description' => 'An epic high-fantasy novel.',
                'category' => 'Fantasy',
                'stock' => 10,
                'rack_location' => 'F2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}