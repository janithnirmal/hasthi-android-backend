<?php

namespace App\Http\Controllers;

use App\Action\ResponseProtocol;
use App\Models\Admin;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController {
    public function login( Request $request ) {
        $validated = $request->validate( [
            'email' => 'string|required',
            'password' => 'string|required',
        ] );
        $admin = Admin::where( 'email', $validated[ 'email' ] )->first();
        if ( !$admin ) {
            return ResponseProtocol::failed( 'Email not found', 401 );
        }
        if ( !Hash::check( $validated[ 'password' ], $admin->password ) ) {
            return ResponseProtocol::failed( 'Invalid password', 401 );
        }

        // session( [ 'type' => 'admin', 'admin_id' => $admin->id ] );
        $request->session()->put( 'auth_type', 'admin' );
        $request->session()->put( 'admin_details', $admin );
        $request->session()->save();

        return ResponseProtocol::success( $admin, 'Admin authenticated successfully' );
    }

    public function logout() {
        session()->forget( 'auth_type' );
        session()->forget( 'admin_details' );
        return ResponseProtocol::success( null, 'Admin logged out successfully' );
    }

    //this is just for testing purposes

    public function sessionRetrieve() {
        return ResponseProtocol::success( session()->all(), 'Session data retrieved successfully' );
    }
}
