<?php

namespace App\Http\Controllers;

use App\Action\ResponseProtocol;
use App\Models\User;
use Illuminate\Http\Request;

class UserController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ResponseProtocol::success(User::all());
    }
    /**
     * Store a newly created resource in storage.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'string|required|max:50',
            'last_name' => 'string|required|max:50',
            'email' => 'string|unique:users,email',
            'mobile' => 'string|required|max:15',
            'password' => 'string|required|min:8',
        ]);
        $user = User::create(
            [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'mobile' => $validated['mobile'],
                'password' => bcrypt($validated['password']),
            ]
        );
        $user->save();
        return ResponseProtocol::success($user, 'User created successfully');
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => 'string|required|max:50',
            'last_name' => 'string|required|max:50',
            'email' => 'string|required|max:50',
            'mobile' => 'string|required|max:15',
            'password' => 'string|required|min:8',
        ]);
        $user->update(
            [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'mobile' => $validated['mobile'],
                'password' => bcrypt($validated['password']),
            ]
        );
        $user->save();
        return ResponseProtocol::success($user, 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $user = User::find($request->id);
        $user->delete();
        return ResponseProtocol::success(null, 'User deleted successfully');
    }

    /**
     * Authenticate the user.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'string|required',
            'password' => 'string|required',
        ]);
        $user = User::where('email', $validated['email'])->first();
        if (!$user || !password_verify($validated['password'], $user->password)) {
            return ResponseProtocol::failed('Invalid credentials', 401);
        }
        $request->session()->put(["user" => $user]);
        return ResponseProtocol::success($user, 'User authenticated successfully');
    }
}
