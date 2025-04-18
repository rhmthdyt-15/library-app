<?php

namespace App\Http\Controllers;

use App\Exceptions\HttpThrowExceptionTrait;
use App\Http\Controllers\Controller;
use App\Models\Books;
use App\Models\Borrowings;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use HttpThrowExceptionTrait;

     public function dashboard()
    {
        $today = Carbon::now()->toDateString();
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

        $stats = [
            'total_books' => Books::count(),
            'available_books' => Books::where('stock', '>', 0)->count(),
            'total_users' => User::where('role', 'member')->count(),
            'active_borrowings' => Borrowings::whereIn('status', ['dipinjam', 'terlambat'])->count(),
            'overdue_borrowings' => Borrowings::where('status', 'terlambat')->count(),
            'borrowings_today' => Borrowings::where('borrow_date', $today)->count(),
            'returns_today' => Borrowings::where('return_date', $today)->count(),
            'borrowings_this_month' => Borrowings::whereBetween('borrow_date', [$startOfMonth, $endOfMonth])->count(),
        ];

        // Most popular books (top 5)
        $popularBooks = Books::withCount(['borrowings'])
            ->orderBy('borrowings_count', 'desc')
            ->limit(5)
            ->get();

        // Recently added books (last 5)
        $recentBooks = Books::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'popular_books' => $popularBooks,
            'recent_books' => $recentBooks
        ]);
    }

    public function borrowingReport(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'format' => 'nullable|in:json,csv,pdf',
        ]);

        $query = Borrowings::with(['user', 'book'])
            ->whereBetween('borrow_date', [$request->start_date, $request->end_date]);

        // Handle format (default to JSON)
        $format = $request->format ?? 'json';
        $borrowings = $query->get();

        // For this example, we'll return JSON regardless of format
        // In a real implementation, you'd generate CSV or PDF based on the format
        return response()->json([
            'period' => [
                'start_date' => $request->start_date,
                'end_date' => $request->end_date
            ],
            'borrowings' => $borrowings,
            'summary' => [
                'total' => $borrowings->count(),
                'returned' => $borrowings->where('status', 'dikembalikan')->count(),
                'active' => $borrowings->whereIn('status', ['dipinjam', 'terlambat'])->count(),
                'overdue' => $borrowings->where('status', 'terlambat')->count()
            ]
        ]);
    }

    public function userReport(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'format' => 'nullable|in:json,csv,pdf',
        ]);

        $query = User::where('role', 'member')
            ->withCount(['borrowings',
                'borrowings as active_borrowings_count' => function ($query) {
                    $query->whereIn('status', ['dipinjam', 'terlambat']);
                },
                'borrowings as overdue_borrowings_count' => function ($query) {
                    $query->where('status', 'terlambat');
                }
            ]);

        // Filter by specific user if provided
        if ($request->has('user_id')) {
            $query->where('id', $request->user_id);
        }

        $users = $query->get();

        // For this example, we'll return JSON regardless of format
        return response()->json([
            'users' => $users,
            'summary' => [
                'total_users' => $users->count(),
                'users_with_active_borrowings' => $users->where('active_borrowings_count', '>', 0)->count(),
                'users_with_overdue_borrowings' => $users->where('overdue_borrowings_count', '>', 0)->count()
            ]
        ]);
    }

    public function bookReport(Request $request)
    {
        $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'format' => 'nullable|in:json,csv,pdf',
        ]);

        $query = Books::with('category')
            ->withCount(['borrowings',
                'borrowings as active_borrowings_count' => function ($query) {
                    $query->whereIn('status', ['dipinjam', 'terlambat']);
                }
            ]);

        // Filter by category if provided
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $books = $query->get();

        // For this example, we'll return JSON regardless of format
        return response()->json([
            'books' => $books,
            'summary' => [
                'total_books' => $books->count(),
                'available_books' => $books->where('stock', '>', 0)->count(),
                'unavailable_books' => $books->where('stock', 0)->count(),
                'most_borrowed' => $books->sortByDesc('borrowings_count')->first(),
                'total_borrowed_count' => $books->sum('borrowings_count')
            ]
        ]);
    }
}
