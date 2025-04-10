<?php

namespace App\Http\Controllers;

use App\Exceptions\HttpThrowExceptionTrait;
use App\Http\Controllers\Controller;
use App\Models\Books;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    use HttpThrowExceptionTrait;
     public function index(Request $request)
    {
        $query = Books::with('category');

        // Filter by title
        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        // Filter by author
        if ($request->has('author')) {
            $query->where('author', 'like', '%' . $request->author . '%');
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Pagination
        $books = $query->paginate(15);

        return response()->json($books);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'isbn' => 'required|string|unique:books',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stock' => 'required|integer|min:0',
            'publication_year' => 'required|integer|min:1800|max:' . date('Y'),
            'publisher' => 'required|string|max:255',
        ]);

        $bookData = $request->except('cover_image');

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
            $bookData['cover_image'] = $path;
        }

        $book = Books::create($bookData);

        return response()->json([
            'message' => 'Book created successfully',
            'book' => $book
        ], 201);
    }

    public function show(Books $book)
    {
        $book->load('category');
        return response()->json($book);
    }

    public function update(Request $request, Books $book)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'author' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'isbn' => 'sometimes|string|unique:books,isbn,' . $book->id,
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stock' => 'sometimes|integer|min:0',
            'publication_year' => 'sometimes|integer|min:1800|max:' . date('Y'),
            'publisher' => 'sometimes|string|max:255',
        ]);

        $bookData = $request->except('cover_image');

        if ($request->hasFile('cover_image')) {
            // Delete old image if exists
            if ($book->cover_image) {
                Storage::disk('public')->delete($book->cover_image);
            }

            $path = $request->file('cover_image')->store('covers', 'public');
            $bookData['cover_image'] = $path;
        }

        $book->update($bookData);

        return response()->json([
            'message' => 'Book updated successfully',
            'book' => $book
        ]);
    }

    public function destroy(Books $book)
    {
        // Check if the book can be deleted (not being borrowed)
        $activeBorrowings = $book->borrowings()->whereIn('status', ['dipinjam', 'terlambat'])->count();

        if ($activeBorrowings > 0) {
            return response()->json([
                'message' => 'Cannot delete book. It is currently being borrowed.'
            ], 422);
        }

        // Delete cover image if exists
        if ($book->cover_image) {
            Storage::disk('public')->delete($book->cover_image);
        }

        $book->delete();

        return response()->json([
            'message' => 'Book deleted successfully'
        ]);
    }
}
