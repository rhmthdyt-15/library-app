<?php

namespace App\Http\Controllers;

use App\Exceptions\HttpThrowExceptionTrait;
use App\Http\Controllers\Controller;
use App\Models\Books;
use App\Models\Borrowings;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BorrowingController extends Controller
{
    use HttpThrowExceptionTrait;
    public function index(Request $request)
    {
        $query = Borrowings::with(['user', 'book']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by user (for admin)
        if ($request->has('user_id') && $request->user()->role === 'admin') {
            $query->where('user_id', $request->user_id);
        }

        // For member, only show their own borrowingss
        if ($request->user()->role === 'member') {
            $query->where('user_id', $request->user()->id);
        }

        // Tambahkan pencarian berdasarkan nama pengguna atau judul buku
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            })->orWhereHas('book', function($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%');
            });
        }

        // Pagination
        $borrowingss = $query->paginate(15);

        return response()->json($borrowingss);
    }

    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'borrow_date' => 'required|date|after_or_equal:today',
            'due_date' => 'required|date|after:borrow_date',
            'notes' => 'nullable|string',
        ]);

        // Check if the book is available
        $book = Books::findOrFail($request->book_id);
        if ($book->stock <= 0) {
            return response()->json([
                'message' => 'Book is not available for borrowings'
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Create borrowings record
            $borrowings = Borrowings::create([
                'user_id' => $request->user()->id,
                'book_id' => $request->book_id,
                'borrow_date' => $request->borrow_date,
                'due_date' => $request->due_date,
                'status' => 'dipinjam',
                'notes' => $request->notes,
            ]);

            // Decrease book stock
            $book->decrement('stock');

            DB::commit();

            return response()->json([
                'message' => 'Borrowings created successfully',
                'borrowings' => $borrowings->load(['user', 'book'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create borrowings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $borrowings = Borrowings::with(['user', 'book'])->findOrFail($id);

        return response()->json($borrowings);
    }


    public function returnBook(Request $request, Borrowings $borrowings)
    {
        // Only admin can process returns
        if (auth()->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized. Only admin can process returns.'
            ], 403);
        }

        // Check if the book is already returned
        if ($borrowings->status === 'dikembalikan') {
            return response()->json([
                'message' => 'This book has already been returned'
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Update borrowings status
            $returnDate = Carbon::now()->toDateString();
            $borrowings->update([
                'return_date' => $returnDate,
                'status' => 'dikembalikan',
            ]);

            // Increase book stock
            $borrowings->book()->increment('stock');

            DB::commit();

            return response()->json([
                'message' => 'Book returned successfully',
                'borrowings' => $borrowings->fresh()->load(['user', 'book'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to process return',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function extend(Request $request, Borrowings $borrowings)
    {
        $request->validate([
            'new_due_date' => 'required|date|after:' . $borrowings->due_date,
        ]);

        // Check if the user owns this borrowings
        if (auth()->user()->role === 'member' && $borrowings->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized access'
            ], 403);
        }

        // Check if the book is already returned
        if ($borrowings->status === 'dikembalikan') {
            return response()->json([
                'message' => 'Cannot extend. This book has already been returned'
            ], 422);
        }

        $borrowings->update([
            'due_date' => $request->new_due_date,
            'notes' => $borrowings->notes . "\nExtended on " . now()->toDateString(),
        ]);

        return response()->json([
            'message' => 'Borrowings period extended successfully',
            'borrowings' => $borrowings->fresh()->load(['user', 'book'])
        ]);
    }

    public function checkOverdue()
    {
        // Update status for overdue borrowings
        $today = Carbon::now()->toDateString();

        $updated = Borrowings::where('status', 'dipinjam')
            ->where('due_date', '<', $today)
            ->update(['status' => 'terlambat']);

        return response()->json([
            'message' => 'Overdue check completed',
            'updated_count' => $updated
        ]);
    }


    public function report(Request $request)
    {
        // Only admin can access reports
        if (auth()->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized. Only admin can access reports.'
            ], 403);
        }

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'required|in:borrowed,returned,all',
        ]);

        $query = Borrowings::with(['user', 'book'])
            ->whereBetween('borrow_date', [$request->start_date, $request->end_date]);

        // Filter by type
        if ($request->type === 'borrowed') {
            $query->where('status', 'dipinjam');
        } elseif ($request->type === 'returned') {
            $query->where('status', 'dikembalikan');
        }

        $borrowings = $query->get();

        // Calculate statistics
        $statistics = [
            'total' => $borrowings->count(),
            'returned' => $borrowings->where('status', 'dikembalikan')->count(),
            'borrowed' => $borrowings->where('status', 'dipinjam')->count(),
            'overdue' => $borrowings->where('status', 'terlambat')->count(),
        ];

        return response()->json([
            'statistics' => $statistics,
            'borrowings' => $borrowings
        ]);
    }

    public function createBorrowingWithAdmin(Request $request)
    {
        // Pastikan hanya admin yang bisa mengakses method ini
        if (auth()->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized. Only admin can create borrowings for members.'
            ], 403);
        }

        // Validasi input
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'isbn' => 'required|exists:books,isbn',
            'borrow_date' => 'required|date|after_or_equal:today',
            'due_date' => 'required|date|after:borrow_date',
            'notes' => 'nullable|string',
        ]);

        // Cari user berdasarkan email
        $user = \App\Models\User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found with the provided email'
            ], 404);
        }

        // Cari buku berdasarkan ISBN
        $book = Books::where('isbn', $request->isbn)->first();
        if (!$book) {
            return response()->json([
                'message' => 'Book not found with the provided ISBN'
            ], 404);
        }

        // Periksa ketersediaan buku
        if ($book->stock <= 0) {
            return response()->json([
                'message' => 'Book is not available for borrowing'
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Buat record peminjaman
            $borrowing = Borrowings::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'borrow_date' => $request->borrow_date,
                'due_date' => $request->due_date,
                'status' => 'dipinjam',
                'notes' => $request->notes,
            ]);

            // Kurangi stok buku
            $book->decrement('stock');

            DB::commit();

            return response()->json([
                'message' => 'Borrowing created successfully',
                'borrowing' => $borrowing->load(['user', 'book'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create borrowing',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function memberDashboardSummary(Request $request)
    {
        $user = $request->user();

        $borrowed = $user->borrowings()->whereNull('return_date')->count();
        $overdueSoon = $user->borrowings()
            ->whereNull('return_date')
            ->whereBetween('due_date', [now(), now()->addWeek()])
            ->count();
        $total = $user->borrowings()->count();

        return response()->json([
            'borrowed_count' => $borrowed,
            'overdue_soon' => $overdueSoon,
            'total_history' => $total,
        ]);
    }

    public function currentBorrowings(Request $request)
    {
        $user = $request->user();
        $borrowings = $user->borrowings()
            ->whereNull('return_date')
            ->with('book')
            ->get();

        return response()->json($borrowings->map(function($b) {
            return [
                'title' => $b->book->title,
                'borrowed_at' => optional($b->borrow_date)->toDateString(),
                'due_date' => optional($b->due_date)->toDateString(),
            ];
        }));

    }


}