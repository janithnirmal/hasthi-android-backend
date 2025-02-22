<?php

namespace App\Http\Controllers;

use App\Action\ResponseProtocol;
use App\Models\MenuImage;
use Illuminate\Http\Request;

class MenuImageController
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
        $path = public_path('storage/menu');
        
        $request->image->move($path, $imageName);

        $fileUrl = url('storage/menu/' . $imageName);

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
    public function show(MenuImage $menuImage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MenuImage $menuImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MenuImage $menuImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MenuImage $menuImage)
    {
        //
    }
}
