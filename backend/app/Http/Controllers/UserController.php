<?php

namespace App\Http\Controllers;

use App\Exceptions\HttpThrowExceptionTrait;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    use HttpThrowExceptionTrait;

    public function index(Request $request)
    {
        $query = User::where('id', '!=', auth()->id());

        // Search (opsional by name or email)
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sorting (role ASC)
        $query->orderBy('role', 'asc');

        // Pagination (default 10 per page)
        $users = $query->paginate($request->input('per_page', 10));

        return response()->json($users);
    }



    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'phone_number' => 'nullable|string',
            'address' => 'nullable|string',
            'role' => 'required|string',
        ]);

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);
        return response()->json($user, 201);
    }

   public function show(User $user)
    {
        // Cek apakah user yang diminta adalah user yang sedang login
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Tidak bisa melihat data sendiri'], 403);
        }

        return response()->json($user);
    }


    public function update(Request $request, User $user)
    {
        if ($user->role !== 'anggota') {
            return response()->json(['message' => 'User bukan anggota'], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|required|string',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone_number' => 'nullable|string',
            'address' => 'nullable|string',
            'password' => 'nullable|min:6',
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        if ($user->role !== 'anggota') {
            return response()->json(['message' => 'User bukan anggota'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Anggota berhasil dihapus']);
    }
}