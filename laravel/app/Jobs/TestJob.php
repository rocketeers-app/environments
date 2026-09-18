<?php

namespace App\Jobs;

use App\Events\JobRunRecorded;
use App\Models\JobRun;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TestJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $index = 0) {}

    public function handle(): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }

        sleep(random_int(1, 3));

        $run = JobRun::create([
            'batch_id' => $this->batch()?->id,
            'status' => 'completed',
            'message' => "Job #{$this->index} done",
        ]);

        JobRunRecorded::dispatch($run->id, $run->batch_id, $run->message);

        Log::info('TestJob ran', ['index' => $this->index, 'batch' => $this->batch()?->id]);
    }
}
