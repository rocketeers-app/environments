<?php

use App\Events\ActivityChanged;
use App\Events\BatchProgressed;
use App\Events\JobRunRecorded;
use App\Events\RecordChanged;
use App\Jobs\TestJob;
use App\Models\TestRecord;
use Illuminate\Broadcasting\BroadcastEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;

it('broadcasts playground events on the public playground channel', function () {
    $event = new RecordChanged('created', 1, 'hello');

    expect($event->broadcastOn())->toBeInstanceOf(Channel::class)
        ->and($event->broadcastOn()->name)->toBe('playground')
        ->and($event->broadcastAs())->toBe('record.changed')
        ->and($event->broadcastWith())->toMatchArray([
            'type' => 'record.changed',
            'action' => 'created',
            'recordId' => 1,
            'payload' => 'hello',
        ]);
});

it('queues broadcasts on the dedicated broadcast queue', function () {
    config()->set('broadcasting.queue', 'broadcasts');

    $events = [
        new RecordChanged('created', 1, 'hello'),
        new JobRunRecorded(1, null, 'Job #1 done'),
        new BatchProgressed(['id' => 'abc'], 'progress'),
        new ActivityChanged('logged', 'something happened'),
    ];

    foreach ($events as $event) {
        expect($event->broadcastQueue())->toBe('broadcasts');
    }
});

it('pushes a queued broadcast onto the broadcast queue and not the default one', function () {
    config()->set('broadcasting.default', 'null');
    config()->set('broadcasting.queue', 'broadcasts');

    Queue::fake();

    RecordChanged::dispatch('created', 1, 'hello');

    Queue::assertPushedOn('broadcasts', BroadcastEvent::class);
});

it('broadcasts when a record is created and deleted', function () {
    Event::fake([RecordChanged::class]);

    $this->post(route('play.db.store'), ['payload' => 'from a test'])
        ->assertRedirect();

    $record = TestRecord::sole();

    $this->delete(route('play.db.delete', $record))->assertRedirect();

    Event::assertDispatchedTimes(RecordChanged::class, 2);
    Event::assertDispatched(RecordChanged::class, fn (RecordChanged $event) => $event->action === 'created' && $event->payload === 'from a test');
    Event::assertDispatched(RecordChanged::class, fn (RecordChanged $event) => $event->action === 'deleted');
});

it('broadcasts when an activity is logged and cleared', function () {
    Event::fake([ActivityChanged::class]);

    $this->post(route('play.activity.log'), ['description' => 'clicked'])
        ->assertRedirect();

    $this->post(route('play.activity.clear'))->assertRedirect();

    Event::assertDispatched(ActivityChanged::class, fn (ActivityChanged $event) => $event->action === 'logged' && $event->description === 'clicked');
    Event::assertDispatched(ActivityChanged::class, fn (ActivityChanged $event) => $event->action === 'cleared');
});

it('broadcasts a step for every finished job', function () {
    Event::fake([JobRunRecorded::class]);

    (new TestJob(7))->handle();

    Event::assertDispatched(JobRunRecorded::class, fn (JobRunRecorded $event) => $event->message === 'Job #7 done');
});

it('broadcasts batch progress when a batch is dispatched', function () {
    Event::fake([BatchProgressed::class]);

    $this->post(route('play.jobs.batch'), ['count' => 3])->assertRedirect();

    Event::assertDispatched(BatchProgressed::class, function (BatchProgressed $event) {
        return $event->stage === 'queued' && $event->batch['totalJobs'] === 3;
    });
});
