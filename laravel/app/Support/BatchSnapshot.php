<?php

namespace App\Support;

use Illuminate\Bus\Batch;

class BatchSnapshot
{
    public static function make(Batch $batch): array
    {
        return [
            'id' => $batch->id,
            'name' => $batch->name,
            'totalJobs' => $batch->totalJobs,
            'pendingJobs' => $batch->pendingJobs,
            'processedJobs' => $batch->processedJobs(),
            'failedJobs' => $batch->failedJobs,
            'finished' => $batch->finished(),
            'cancelled' => $batch->cancelled(),
        ];
    }
}
