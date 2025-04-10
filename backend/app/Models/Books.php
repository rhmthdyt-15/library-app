<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Books extends Model
{
    use HasFactory;

     protected $fillable = [
        'title', 'author', 'category_id', 'isbn', 'description',
        'cover_image', 'stock', 'publication_year', 'publisher'
    ];

    public function category()
    {
        return $this->belongsTo(Categories::class);
    }

    public function borrowings()
    {
        return $this->hasMany(Borrowings::class, 'book_id');
    }
}
