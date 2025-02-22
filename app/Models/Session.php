<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
 {
    use HasFactory;

    protected $attributes = [
        'auth_type' => 'user'
    ];
    protected $fillable = [
        'user_id',
        'admin_id',
        'auth_type'
    ];

}
