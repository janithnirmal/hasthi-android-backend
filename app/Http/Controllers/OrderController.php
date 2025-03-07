<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController
{
    public function status(Request $request) {
        $order = Order::find($request->id);
        $order->status = $request->status;
        $order->save();
        return response()->json($order);
    }


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userUID = $request->userUID;

        if ($userUID == null) {
            return response()->json(Order::all());
        }
        return response()->json(Order::where('userUID', $userUID)->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = Order::create([
            'orderItems' => $request->orderItems,
            'userUID' => $request->userUID,
            'totalPrice' => $request->totalPrice,
            'status' => "pending",
        ]);

        return response()->json($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
