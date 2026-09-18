<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobRun extends Model
{
    protected $fillable = ['batch_id', 'status', 'message'];
}
