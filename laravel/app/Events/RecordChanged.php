<?php

namespace App\Events;

class RecordChanged extends PlaygroundEvent
{
    public function __construct(
        public string $action,
        public int $recordId,
        public string $payload,
    ) {}

    public function broadcastAs(): string
    {
        return 'record.changed';
    }

    public function broadcastPayload(): array
    {
        return [
            'action' => $this->action,
            'recordId' => $this->recordId,
            'payload' => $this->payload,
        ];
    }
}
