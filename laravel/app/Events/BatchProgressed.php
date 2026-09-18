<?php

namespace App\Events;

class BatchProgressed extends PlaygroundEvent
{
    public function __construct(
        public array $batch,
        public string $stage,
    ) {}

    public function broadcastAs(): string
    {
        return 'batch.progress';
    }

    public function broadcastPayload(): array
    {
        return [
            'stage' => $this->stage,
            'batch' => $this->batch,
        ];
    }
}
