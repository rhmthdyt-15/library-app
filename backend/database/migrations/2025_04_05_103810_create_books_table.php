<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('author');
            $table->foreignId('category_id')->constrained();
            $table->string('isbn')->unique();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->integer('stock');
            $table->year('publication_year');
            $table->string('publisher');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};