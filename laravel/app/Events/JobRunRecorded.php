<?php

namespace App\Events;

class JobRunRecorded extends PlaygroundEvent
{
    public function __construct(
        public int $jobRunId,
        public ?string $batchId,
        public string $message,
    ) {}

    public function broadcastAs(): string
    {
        return 'job.ran';
    }

    public function broadcastPayload(): array
    {
        return [
            'jobRunId' => $this->jobRunId,
            'batchId' => $this->batchId,
            'message' => $this->message,
        ];
    }
}
