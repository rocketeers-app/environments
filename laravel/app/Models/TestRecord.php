<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestRecord extends Model
{
    protected $fillable = ['user_id', 'payload'];
}
