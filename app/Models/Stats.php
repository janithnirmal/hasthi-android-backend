<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stats extends Model
{
    /** @use HasFactory<\Database\Factories\StatsFactory> */
    use HasFactory;

    protected $fillable = [
        'logged_time',
    ];
}
