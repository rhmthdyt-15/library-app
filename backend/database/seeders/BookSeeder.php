<?php

namespace Database\Seeders;

use App\Models\Categories;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan kategori sudah ada
        if (Categories::count() == 0) {
            $this->command->info('Kategori tidak ditemukan. Jalankan CategorySeeder terlebih dahulu.');
            return;
        }

        $categoryIds = Categories::pluck('id')->toArray();

        $searchTerms = [
            'programming', 'history', 'fiction', 'science', 'business',
            'technology', 'novel', 'biography', 'philosophy', 'art',
            'mathematics', 'computer', 'romance', 'thriller', 'mystery'
        ];

        $totalBooks = 0;
        $maxBooksPerTerm = 7;

        foreach ($searchTerms as $term) {
            $response = Http::get('https://www.googleapis.com/books/v1/volumes', [
                'q' => $term,
                'maxResults' => 40,
                'startIndex' => rand(0, 20),
            ]);

            if ($response->successful()) {
                $books = $response->json()['items'] ?? [];
                $booksAdded = 0;

                foreach ($books as $book) {
                    if ($totalBooks >= 100) break 2;
                    if ($booksAdded >= $maxBooksPerTerm) break;

                    $volumeInfo = $book['volumeInfo'] ?? [];

                    if (empty($volumeInfo['title']) || empty($volumeInfo['authors'])) {
                        continue;
                    }

                    $rawYear = substr($volumeInfo['publishedDate'] ?? '2020', 0, 4);
                    $year = (int)$rawYear;
                    if ($year < 1901 || $year > 2155) {
                        $year = rand(1901, date('Y'));
                    }

                    DB::table('books')->insert([
                        'title' => $volumeInfo['title'],
                        'author' => implode(', ', $volumeInfo['authors']), // ⬅️ pakai langsung dari API
                        'category_id' => $categoryIds[array_rand($categoryIds)],
                        'isbn' => $volumeInfo['industryIdentifiers'][0]['identifier'] ?? Str::random(13),
                        'description' => $volumeInfo['description'] ?? 'Deskripsi buku tidak tersedia.',
                        'cover_image' => $volumeInfo['imageLinks']['thumbnail'] ?? null,
                        'stock' => rand(1, 50),
                        'publication_year' => $year,
                        'publisher' => $volumeInfo['publisher'] ?? 'Unknown Publisher',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $booksAdded++;
                    $totalBooks++;
                }

                $this->command->info("Berhasil menambahkan $booksAdded buku untuk kategori: $term (Total: $totalBooks)");
            } else {
                $this->command->error("Gagal mengambil data untuk kategori: $term");
            }

            sleep(1); // hindari rate limit
        }

        // Tambahan buku dummy jika belum cukup
        if ($totalBooks < 100) {
            $booksNeeded = 100 - $totalBooks;
            $this->command->info("Menambahkan $booksNeeded data buku dummy untuk mencapai 100 buku");

            $dummyTitles = [
                'The Art of Programming', 'Modern History', 'Future of Technology',
                'Mathematical Principles', 'The Great Novel', 'Business Strategies',
                'Scientific Discoveries', 'Philosophy of Mind', 'Ancient Civilizations',
                'Machine Learning Basics'
            ];

            $dummyAuthors = [
                'John Smith', 'Sarah Johnson', 'Robert Williams', 'Emily Davis',
                'Michael Brown', 'Jessica Wilson', 'David Miller', 'Jennifer Taylor',
                'James Anderson', 'Lisa Thomas'
            ];

            $dummyPublishers = [
                'Tech Books', 'Academic Press', 'Literary House', 'Knowledge Publishing',
                'Educational Books', 'Science Media', 'Classic Publications', 'Modern Library',
                'Digital Press', 'World Publishers'
            ];

            for ($i = 0; $i < $booksNeeded; $i++) {
                DB::table('books')->insert([
                    'title' => $dummyTitles[array_rand($dummyTitles)] . ' ' . Str::random(3),
                    'author' => $dummyAuthors[array_rand($dummyAuthors)],
                    'category_id' => $categoryIds[array_rand($categoryIds)],
                    'isbn' => 'ISBN-' . rand(1000000000000, 9999999999999),
                    'description' => 'Ini adalah buku dummy yang dibuat untuk memenuhi jumlah 100 data buku.',
                    'cover_image' => null,
                    'stock' => rand(1, 50),
                    'publication_year' => rand(1901, date('Y')),
                    'publisher' => $dummyPublishers[array_rand($dummyPublishers)],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info("Total buku yang berhasil ditambahkan: $totalBooks");
    }
}