<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Every playground event is broadcast on the public "playground" channel and is
// queued on its own broadcast queue so slow application jobs never delay it.
abstract class PlaygroundEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    abstract public function broadcastAs(): string;

    abstract public function broadcastPayload(): array;

    public function broadcastOn(): Channel
    {
        return new Channel('playground');
    }

    public function broadcastQueue(): string
    {
        return config('broadcasting.queue');
    }

    public function broadcastWith(): array
    {
        return [
            'type' => $this->broadcastAs(),
            'at' => now()->toIso8601String(),
            ...$this->broadcastPayload(),
        ];
    }
}
