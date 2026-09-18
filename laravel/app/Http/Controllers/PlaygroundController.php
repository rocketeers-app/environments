<?php

namespace App\Http\Controllers;

use App\Events\ActivityChanged;
use App\Events\BatchProgressed;
use App\Events\RecordChanged;
use App\Jobs\TestJob;
use App\Models\Activity;
use App\Models\JobRun;
use App\Models\TestRecord;
use App\Models\User;
use App\Support\BatchSnapshot;
use Illuminate\Bus\Batch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PlaygroundController extends Controller
{
    public function index(Request $request)
    {
        $start = defined('LARAVEL_START') ? LARAVEL_START : $request->server('REQUEST_TIME_FLOAT', microtime(true));

        return Inertia::render('welcome', [
            'requestTime' => [
                'at' => now()->toIso8601String(),
                'durationMs' => round((microtime(true) - $start) * 1000, 2),
            ],
            'auth' => ['user' => $request->user()?->only('id', 'name', 'email')],
            'session' => ['counter' => $request->session()->get('counter', 0)],
            'records' => TestRecord::latest()->take(10)->get(),
            'recentJobs' => JobRun::latest()->take(20)->get(),
            'activeBatch' => $this->batchSnapshot($request),
            'recentActivities' => Activity::latest()->take(15)->get()->map(fn ($a) => [
                'id' => $a->id,
                'log_name' => $a->log_name,
                'description' => $a->description,
                'event' => $a->event,
                'causer_id' => $a->causer_id,
                'subject_type' => $a->subject_type ? class_basename($a->subject_type) : null,
                'subject_id' => $a->subject_id,
                'properties' => $a->properties,
                'created_at' => $a->created_at?->toIso8601String(),
            ]),
        ]);
    }

    public function storeRecord(Request $request)
    {
        $data = $request->validate(['payload' => 'required|string|max:255']);
        $record = TestRecord::create([
            'user_id' => $request->user()?->id,
            'payload' => $data['payload'],
        ]);

        RecordChanged::dispatch('created', $record->id, $record->payload);

        return back();
    }

    public function deleteRecord(TestRecord $record)
    {
        $record->delete();

        RecordChanged::dispatch('deleted', $record->id, $record->payload);

        return back();
    }

    public function incrementSession(Request $request)
    {
        $request->session()->put('counter', $request->session()->get('counter', 0) + 1);

        return back();
    }

    public function clearSession(Request $request)
    {
        $request->session()->forget('counter');

        return back();
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return back();
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (! Auth::attempt($data)) {
            return back()->withErrors(['email' => 'Invalid credentials']);
        }

        $request->session()->regenerate();

        return back();
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return back();
    }

    public function dispatchJob()
    {
        TestJob::dispatch();

        return back();
    }

    public function dispatchBatch(Request $request)
    {
        $count = (int) $request->input('count', 5);
        $count = max(1, min($count, 200));

        $jobs = collect(range(1, $count))->map(fn ($i) => new TestJob($i))->all();

        $batch = Bus::batch($jobs)
            ->name('Playground batch')
            ->progress(fn (Batch $batch) => BatchProgressed::dispatch(BatchSnapshot::make($batch), 'progress'))
            ->finally(fn (Batch $batch) => BatchProgressed::dispatch(BatchSnapshot::make($batch), 'finished'))
            ->dispatch();

        $request->session()->put('active_batch_id', $batch->id);

        BatchProgressed::dispatch(BatchSnapshot::make($batch), 'queued');

        return back();
    }

    public function logActivity(Request $request)
    {
        $data = $request->validate([
            'description' => 'required|string|max:255',
            'event' => 'nullable|string|max:50',
        ]);

        $logger = activity('playground')
            ->event($data['event'] ?? 'custom')
            ->withProperties([
                'ip' => $request->ip(),
                'agent' => substr((string) $request->userAgent(), 0, 120),
            ]);

        if ($user = $request->user()) {
            $logger->causedBy($user)->performedOn($user);
        }

        $logger->log($data['description']);

        ActivityChanged::dispatch('logged', $data['description']);

        return back();
    }

    public function clearActivities()
    {
        Activity::query()->delete();

        ActivityChanged::dispatch('cleared');

        return back();
    }

    private function batchSnapshot(Request $request): ?array
    {
        $id = $request->session()->get('active_batch_id');
        if (! $id) {
            return null;
        }

        $batch = Bus::findBatch($id);
        if (! $batch) {
            return null;
        }

        return BatchSnapshot::make($batch);
    }
}
