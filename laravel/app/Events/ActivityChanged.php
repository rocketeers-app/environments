<?php

namespace App\Events;

class ActivityChanged extends PlaygroundEvent
{
    public function __construct(
        public string $action,
        public ?string $description = null,
    ) {}

    public function broadcastAs(): string
    {
        return 'activity.changed';
    }

    public function broadcastPayload(): array
    {
        return [
            'action' => $this->action,
            'description' => $this->description,
        ];
    }
}
