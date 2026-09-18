<?php

declare(strict_types=1);

namespace App\Models;

use Spatie\Activitylog\Models\Activity as SpatieActivity;

class Activity extends SpatieActivity
{
    protected $connection = 'pgsql_activitylog';
}
