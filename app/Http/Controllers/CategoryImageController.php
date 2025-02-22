<?php

namespace App\Http\Controllers;

use App\Action\ResponseProtocol;
use App\Models\CategoryImage;
use Illuminate\Http\Request;

class CategoryImageController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:4096',
        ]);

        $imageName = time().'.'.$request->image->extension();
        $path = public_path('storage/category');
        
        $request->image->move($path, $imageName);

        $fileUrl = url('storage/category/' . $imageName);

        return ResponseProtocol::success(['url' => $fileUrl]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CategoryImage $categoryImage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CategoryImage $categoryImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CategoryImage $categoryImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CategoryImage $categoryImage)
    {
        //
    }
}
