<?php

namespace App\Http\Controllers;

use App\Action\ResponseProtocol;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController {
    /**
    * Display a listing of the resource.
    */

    public function index() {
        return ResponseProtocol::success( Admin::all() );
    }
    /**
    * Store a newly created resource in storage.
    */

    public function register( Request $request ) {
        // Validate the request...
        $admin = $request->validate( [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email|unique:admins,email',
            'password' => 'required|string',
            'mobile' => 'nullable|string|max:15',
            'status' => 'in:active,inactive',
            'role' => 'in:super_admin,admin',
        ] );
        $admin = Admin::create(
            [
                'first_name' => $admin[ 'first_name' ],
                'last_name' => $admin[ 'last_name' ],
                'email' => $admin[ 'email' ],
                'password' => bcrypt( $admin[ 'password' ] ),
                'mobile' => $admin[ 'mobile' ],
                'status' => $admin[ 'status' ],
                'role' => $admin[ 'role' ],
            ]
        );
        return ResponseProtocol::success( $admin, 'Admin created successfully' );
    }
    /**
    * Update the specified resource in storage.
    */

    public function update( Request $request, Admin $admin ) {

        $adminValidation = $request->validate( [
            'id' => 'required|exists:admins,id',
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email',
            'password' => 'required|string',
            'mobile' => 'nullable|string|max:15',
            'status' => 'in:active,inactive',
            'role' => 'in:super_admin,admin',
        ] );
        $admin->where( 'id', $adminValidation[ 'id' ] )
        ->update(
            [
                'first_name' => $adminValidation[ 'first_name' ],
                'last_name' => $adminValidation[ 'last_name' ],
                'email' => $adminValidation[ 'email' ],
                'password' => bcrypt( $adminValidation[ 'password' ] ),
                'mobile' => $adminValidation[ 'mobile' ],
                'status' => $adminValidation[ 'status' ],
                'role' => $adminValidation[ 'role' ],
            ]
        );
        return ResponseProtocol::success( null, 'Admin updated successfully' );
    }
    /**
    * Remove the specified resource from storage.
    */

    public function destroy( Request $request, Admin $admin ) {
        $adminValidation = $request->validate( [
            'id' => 'required|exists:admins,id',
        ] );
        $admin->where( 'id', [ $adminValidation[ 'id' ] ] )->delete();
        return ResponseProtocol::success( null, 'Admin deleted successfully');
    }
    /**
    * admin profile
    */

    public function show( Request $request ) {
        $profileDetails = $request->session()->get( 'admin_details' );
        return  ResponseProtocol::success( $profileDetails, 'Admin profile retrieved successfully' );
    }
}
