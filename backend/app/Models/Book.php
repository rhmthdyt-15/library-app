<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'isbn',
        'description',
        'category',
        'stock',
        'rack_location'
    ];

    public function borrowings()
    {
        return $this->hasMany(Borrowings::class);
    }

    public function isAvailable()
    {
        return $this->stock > 0;
    }
}