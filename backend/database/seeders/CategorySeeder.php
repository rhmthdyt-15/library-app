<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Mengambil kategori dari Google Books API
     */
    public function run(): void
    {
        // Kategori yang umum dari Google Books
        $searchTerms = [
            'fiction', 'non-fiction', 'science', 'history',
            'biography', 'computer', 'business', 'art',
            'education', 'romance', 'fantasy', 'mystery',
            'religion', 'philosophy', 'travel'
        ];

        $categories = [];
        $addedCategories = [];

        foreach ($searchTerms as $term) {
            $response = Http::get('https://www.googleapis.com/books/v1/volumes', [
                'q' => 'subject:' . $term,
                'maxResults' => 5,
            ]);

            if ($response->successful()) {
                $books = $response->json()['items'] ?? [];

                foreach ($books as $book) {
                    $volumeInfo = $book['volumeInfo'] ?? [];
                    $bookCategories = $volumeInfo['categories'] ?? [];

                    foreach ($bookCategories as $category) {
                        // Normalisasi nama kategori dan hindari duplikat
                        $normalizedCategory = Str::title($category);

                        if (!in_array($normalizedCategory, $addedCategories)) {
                            $categories[] = [
                                'name' => $normalizedCategory,
                                'description' => 'Buku-buku dalam kategori ' . $normalizedCategory,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];

                            $addedCategories[] = $normalizedCategory;
                            $this->command->info("Menemukan kategori: $normalizedCategory");

                            // Bila sudah mencapai 10 kategori, hentikan proses
                            if (count($categories) >= 15) {
                                break 3;
                            }
                        }
                    }
                }
            } else {
                $this->command->error("Gagal mengambil data untuk pencarian: $term");
            }

            // Tambahkan jeda untuk menghindari rate limiting dari API
            sleep(1);
        }

        // Jika kategori dari API kurang dari yang diharapkan, tambahkan kategori default
        if (count($categories) < 10) {
            $defaultCategories = [
                'Fiksi', 'Non-Fiksi', 'Pendidikan', 'Teknologi',
                'Bisnis & Ekonomi', 'Sains', 'Sejarah',
                'Agama & Spiritual', 'Seni & Budaya', 'Komik & Manga'
            ];

            $defaultDescriptions = [
                'Buku-buku dengan cerita fiksi seperti novel, cerpen, dan lainnya.',
                'Buku-buku yang berisi fakta dan informasi non-fiksi.',
                'Buku-buku untuk keperluan pendidikan dan pembelajaran.',
                'Buku-buku seputar teknologi, pemrograman, dan komputer.',
                'Buku-buku tentang bisnis, keuangan, ekonomi, dan manajemen.',
                'Buku-buku ilmiah mencakup fisika, kimia, biologi, dan ilmu pengetahuan lainnya.',
                'Buku-buku tentang sejarah dunia, sejarah lokal, dan peristiwa bersejarah.',
                'Buku-buku bertemakan agama, spiritual, dan pengembangan diri.',
                'Buku-buku tentang seni, musik, film, budaya, dan arsitektur.',
                'Buku komik, manga, dan novel grafis.'
            ];

            foreach ($defaultCategories as $index => $category) {
                if (!in_array($category, $addedCategories)) {
                    $categories[] = [
                        'name' => $category,
                        'description' => $defaultDescriptions[$index],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    $addedCategories[] = $category;
                    $this->command->info("Menambahkan kategori default: $category");

                    if (count($categories) >= 15) {
                        break;
                    }
                }
            }
        }

        // Simpan kategori ke database
        DB::table('categories')->insert($categories);

        $this->command->info('Berhasil menambahkan ' . count($categories) . ' kategori buku.');
    }
}
