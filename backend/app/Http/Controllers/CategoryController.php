<?php

namespace App\Http\Controllers;

use App\Exceptions\HttpThrowExceptionTrait;
use App\Http\Controllers\Controller;
use App\Models\Categories;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use HttpThrowExceptionTrait;

    public function index()
    {
        $categories = Categories::all();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
        ]);

        $categories = Categories::create($request->all());

        return response()->json([
            'message' => 'Categories created successfully',
            'Categories' => $categories
        ], 201);
    }

    public function show($id)
    {
        $category = Categories::findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, Categories $categories)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255|unique:categories,name,' . $categories->id,
            'description' => 'nullable|string',
        ]);

        $categories->update($request->all());

        return response()->json([
            'message' => 'Categories updated successfully',
            'Categories' => $categories
        ]);
    }

    public function destroy(Categories $categories)
    {
        // Check if the Categories has books
        $bookCount = $categories->books()->count();

        if ($bookCount > 0) {
            return response()->json([
                'message' => 'Cannot delete Categories. It has associated books.'
            ], 422);
        }

        $categories->delete();

        return response()->json([
            'message' => 'Categories deleted successfully'
        ]);
    }
}
