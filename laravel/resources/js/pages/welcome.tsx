import { Head, router, useForm } from '@inertiajs/react';
import { useConnectionStatus, useEchoPublic } from '@laravel/echo-react';
import {
    Activity as ActivityIcon,
    Database as DatabaseIcon,
    Layers as LayersIcon,
    Radio as RadioIcon,
    Trash2 as TrashIcon,
    Zap as ZapIcon,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import PlaygroundController from '@/actions/App/Http/Controllers/PlaygroundController';
import { PageHeader } from '@/components/page-header';
import { PageTitle } from '@/components/page-title';
import { EmptyState } from '@/components/shared/empty-state';
import { Panel, PanelContent, PanelHeader } from '@/components/shared/panel';
import { Widget, WidgetGrid } from '@/components/shared/widget';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableFrame,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { withPlaygroundLayout } from '@/layouts/playground-layout';
import { cn } from '@/lib/utils';

interface User {
    id: number;
    name: string;
    email: string;
}

interface TestRecord {
    id: number;
    user_id: number | null;
    payload: string;
    created_at: string;
}

interface JobRun {
    id: number;
    batch_id: string | null;
    status: string;
    message: string;
    created_at: string;
}

interface BatchSnapshot {
    id: string;
    totalJobs: number;
    pendingJobs: number;
    processedJobs: number;
    failedJobs: number;
    finished: boolean;
    cancelled: boolean;
}

interface ActivityEntry {
    id: number;
    log_name: string | null;
    description: string;
    event: string | null;
    causer_id: number | null;
    subject_type: string | null;
    subject_id: number | null;
    properties: Record<string, unknown> | null;
    created_at: string | null;
}

interface RequestTime {
    at: string;
    durationMs: number;
}

type BroadcastPayload = { type: string; at: string } & Record<string, unknown>;

interface LiveStep {
    key: number;
    type: string;
    at: string;
    label: string;
}

const BROADCAST_EVENTS = [
    '.record.changed',
    '.job.ran',
    '.batch.progress',
    '.activity.changed',
];

const RELOAD_PROPS: Record<string, string[]> = {
    'record.changed': ['records'],
    'job.ran': ['recentJobs'],
    'batch.progress': ['activeBatch', 'recentJobs'],
    'activity.changed': ['recentActivities'],
};

type BadgeTone = React.ComponentProps<typeof Badge>['variant'];

const STEP_TONE: Record<string, BadgeTone> = {
    'record.changed': 'soft-blue',
    'job.ran': 'soft-gray',
    'batch.progress': 'soft-green',
    'activity.changed': 'soft-orange',
};

const CONNECTION_TONE: Record<string, BadgeTone> = {
    connected: 'soft-green',
    connecting: 'soft-orange',
};

function describe(event: BroadcastPayload): string {
    switch (event.type) {
        case 'record.changed':
            return `record #${event.recordId} ${event.action} — ${event.payload}`;
        case 'job.ran':
            return `${event.message}${event.batchId ? ' (batched)' : ''}`;
        case 'batch.progress': {
            const batch = event.batch as BatchSnapshot;

            return `batch ${event.stage}: ${batch.processedJobs}/${batch.totalJobs} processed, ${batch.pendingJobs} pending`;
        }
        case 'activity.changed':
            return event.action === 'cleared'
                ? 'activity log cleared'
                : `logged: ${event.description}`;
        default:
            return event.type;
    }
}

function time(value: string | null): string {
    return value ? new Date(value).toLocaleTimeString() : '';
}

interface Props {
    auth: { user: User | null };
    session: { counter: number };
    requestTime: RequestTime;
    records: TestRecord[];
    recentJobs: JobRun[];
    activeBatch: BatchSnapshot | null;
    recentActivities: ActivityEntry[];
}

export default function Welcome({
    auth,
    session,
    requestTime,
    records,
    recentJobs,
    activeBatch,
    recentActivities,
}: Props) {
    const [polling, setPolling] = useState(false);
    const [live, setLive] = useState(true);
    const [steps, setSteps] = useState<LiveStep[]>([]);
    const stepKey = useRef(0);
    const connection = useConnectionStatus();

    const onBroadcast = useCallback((event: BroadcastPayload) => {
        stepKey.current += 1;

        setSteps((prev) =>
            [
                {
                    key: stepKey.current,
                    type: event.type,
                    at: event.at,
                    label: describe(event),
                },
                ...prev,
            ].slice(0, 40),
        );

        router.reload({
            only: [...(RELOAD_PROPS[event.type] ?? []), 'requestTime'],
            showProgress: false,
            async: true,
        });
    }, []);

    const { listen, stopListening } = useEchoPublic(
        'playground',
        BROADCAST_EVENTS,
        onBroadcast,
        [onBroadcast],
    );

    useEffect(() => {
        if (live) {
            listen();
        } else {
            stopListening();
        }
    }, [live, listen, stopListening]);

    useEffect(() => {
        if (!polling) {
            return;
        }

        const id = setInterval(() => {
            router.reload({
                only: [
                    'requestTime',
                    'records',
                    'recentJobs',
                    'activeBatch',
                    'session',
                    'recentActivities',
                ],
                showProgress: false,
                async: true,
            });
        }, 2000);

        return () => clearInterval(id);
    }, [polling]);

    return (
        <div className="flex flex-col gap-6 px-6 py-2 pb-6">
            <Head title="Playground" />

            <PageHeader>
                <PageTitle
                    title="Laravel Playground"
                    subtitle="DB · Session · Auth · Polling · Broadcasting · Jobs · Batches · Activity Log"
                    addon={<ConnectionBadge status={connection} />}
                />
                <div className="mt-4 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Switch
                            id="live"
                            checked={live}
                            onCheckedChange={setLive}
                        />
                        <Label htmlFor="live">
                            Live {live ? 'listening' : 'paused'}
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            id="polling"
                            checked={polling}
                            onCheckedChange={setPolling}
                        />
                        <Label htmlFor="polling">
                            Polling {polling ? 'on (2s)' : 'off'}
                        </Label>
                    </div>
                </div>
            </PageHeader>

            <WidgetGrid>
                <Widget
                    label="Render time"
                    value={
                        <span className="font-mono">
                            {requestTime.durationMs} ms
                        </span>
                    }
                />
                <Widget label="Session counter" value={session.counter} />
                <Widget label="Records" value={records.length} />
                <Widget label="Recent jobs" value={recentJobs.length} />
                <Widget label="Activities" value={recentActivities.length} />
            </WidgetGrid>

            <LiveStepsPanel
                steps={steps}
                live={live}
                status={connection}
                onClear={() => setSteps([])}
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <AuthPanel user={auth.user} />
                <SessionPanel counter={session.counter} />
                <DbPanel records={records} canTag={!!auth.user} />
                <JobsPanel jobs={recentJobs} />
                <BatchPanel batch={activeBatch} />
                <PollPanel
                    polling={polling}
                    jobsCount={recentJobs.length}
                    recordsCount={records.length}
                />
            </div>

            <ActivityLogPanel activities={recentActivities} />
        </div>
    );
}

Welcome.layout = withPlaygroundLayout;

function ConnectionBadge({ status }: { status: string }) {
    return (
        <Badge
            variant={CONNECTION_TONE[status] ?? 'soft-red'}
            className="font-mono"
        >
            {status}
        </Badge>
    );
}

function LiveStepsPanel({
    steps,
    live,
    status,
    onClear,
}: {
    steps: LiveStep[];
    live: boolean;
    status: string;
    onClear: () => void;
}) {
    return (
        <Panel id="broadcasting">
            <PanelHeader className="justify-between">
                <span className="flex items-center gap-2">
                    <RadioIcon className="size-4 text-muted-foreground" />
                    Live steps (Reverb WebSocket)
                </span>
                <span className="flex items-center gap-3 text-xs font-normal text-muted-foreground">
                    {live ? 'listening' : 'paused'}
                    <ConnectionBadge status={status} />
                    <Button variant="ghost" size="sm" onClick={onClear}>
                        Clear
                    </Button>
                </span>
            </PanelHeader>
            <PanelContent className="flex flex-col gap-3">
                <p className="text-xs text-muted-foreground">
                    Every step below arrived over the{' '}
                    <code className="font-mono">playground</code> channel — no
                    polling involved. Broadcasts are queued on the{' '}
                    <code className="font-mono">broadcasts</code> queue, so they
                    stay instant while the slow jobs run on{' '}
                    <code className="font-mono">default</code>.
                </p>
                {steps.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        No events yet — dispatch a job or a batch and watch them
                        stream in.
                    </p>
                ) : (
                    <ul className="max-h-64 space-y-1 overflow-auto">
                        {steps.map((step) => (
                            <li
                                key={step.key}
                                className="flex items-start justify-between gap-3 rounded-md border border-border px-2 py-1.5 text-xs"
                            >
                                <span className="flex min-w-0 flex-1 items-center gap-2">
                                    <Badge
                                        variant={
                                            STEP_TONE[step.type] ?? 'soft-gray'
                                        }
                                        className="font-mono"
                                    >
                                        {step.type}
                                    </Badge>
                                    <span className="truncate">
                                        {step.label}
                                    </span>
                                </span>
                                <span className="shrink-0 font-mono text-muted-foreground">
                                    {time(step.at)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </PanelContent>
        </Panel>
    );
}

function AuthPanel({ user }: { user: User | null }) {
    const login = useForm({ email: '', password: '' });
    const register = useForm({ name: '', email: '', password: '' });

    if (user) {
        return (
            <Panel>
                <PanelHeader>Auth</PanelHeader>
                <PanelContent className="flex flex-1 flex-col items-start gap-3">
                    <p className="text-sm">
                        Logged in as <strong>{user.name}</strong>{' '}
                        <span className="text-muted-foreground">
                            ({user.email})
                        </span>
                    </p>
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.post(
                                PlaygroundController.logout.url(),
                                {},
                                { preserveScroll: true },
                            )
                        }
                    >
                        Log out
                    </Button>
                </PanelContent>
            </Panel>
        );
    }

    return (
        <Panel>
            <PanelHeader>Auth</PanelHeader>
            <PanelContent className="flex-1">
                <Tabs defaultValue="login">
                    <TabsList>
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="pt-4">
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={(event) => {
                                event.preventDefault();
                                login.post(PlaygroundController.login.url(), {
                                    preserveScroll: true,
                                });
                            }}
                        >
                            <Input
                                type="email"
                                placeholder="email"
                                value={login.data.email}
                                onChange={(event) =>
                                    login.setData('email', event.target.value)
                                }
                            />
                            <Input
                                type="password"
                                placeholder="password"
                                value={login.data.password}
                                onChange={(event) =>
                                    login.setData(
                                        'password',
                                        event.target.value,
                                    )
                                }
                            />
                            {login.errors.email && (
                                <p className="text-sm text-destructive">
                                    {login.errors.email}
                                </p>
                            )}
                            <Button
                                type="submit"
                                className="self-start"
                                loading={login.processing}
                            >
                                Sign in
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="register" className="pt-4">
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={(event) => {
                                event.preventDefault();
                                register.post(
                                    PlaygroundController.register.url(),
                                    { preserveScroll: true },
                                );
                            }}
                        >
                            <Input
                                placeholder="name"
                                value={register.data.name}
                                onChange={(event) =>
                                    register.setData('name', event.target.value)
                                }
                            />
                            <Input
                                type="email"
                                placeholder="email"
                                value={register.data.email}
                                onChange={(event) =>
                                    register.setData(
                                        'email',
                                        event.target.value,
                                    )
                                }
                            />
                            <Input
                                type="password"
                                placeholder="password (min 6)"
                                value={register.data.password}
                                onChange={(event) =>
                                    register.setData(
                                        'password',
                                        event.target.value,
                                    )
                                }
                            />
                            {Object.values(register.errors).map((error, i) => (
                                <p key={i} className="text-sm text-destructive">
                                    {error}
                                </p>
                            ))}
                            <Button
                                type="submit"
                                className="self-start"
                                loading={register.processing}
                            >
                                Create account
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </PanelContent>
        </Panel>
    );
}

function SessionPanel({ counter }: { counter: number }) {
    return (
        <Panel>
            <PanelHeader>Session</PanelHeader>
            <PanelContent className="flex flex-1 flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                    Counter:{' '}
                    <span className="font-mono text-2xl font-semibold text-foreground tabular-nums">
                        {counter}
                    </span>
                </p>
                <div className="flex gap-2">
                    <Button
                        onClick={() =>
                            router
                                .optimistic((props: Props) => ({
                                    session: {
                                        counter: props.session.counter + 1,
                                    },
                                }))
                                .post(
                                    PlaygroundController.incrementSession.url(),
                                    {},
                                    { preserveScroll: true },
                                )
                        }
                    >
                        Increment
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() =>
                            router
                                .optimistic(() => ({ session: { counter: 0 } }))
                                .post(
                                    PlaygroundController.clearSession.url(),
                                    {},
                                    { preserveScroll: true },
                                )
                        }
                    >
                        Clear
                    </Button>
                </div>
            </PanelContent>
        </Panel>
    );
}

function DbPanel({
    records,
    canTag,
}: {
    records: TestRecord[];
    canTag: boolean;
}) {
    const form = useForm({ payload: '' });

    return (
        <Panel id="database">
            <PanelHeader>
                <DatabaseIcon className="size-4 text-muted-foreground" />
                Database
            </PanelHeader>
            <PanelContent className="flex flex-1 flex-col gap-3">
                <form
                    className="flex gap-2"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(PlaygroundController.storeRecord.url(), {
                            preserveScroll: true,
                            onSuccess: () => form.reset('payload'),
                        });
                    }}
                >
                    <Input
                        placeholder={
                            canTag
                                ? 'New record (tagged to you)'
                                : 'New record (anonymous)'
                        }
                        value={form.data.payload}
                        onChange={(event) =>
                            form.setData('payload', event.target.value)
                        }
                    />
                    <Button type="submit" loading={form.processing}>
                        Add
                    </Button>
                </form>

                {records.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                        No records yet.
                    </p>
                ) : (
                    <ul className="max-h-56 space-y-1 overflow-auto">
                        {records.map((record) => (
                            <li
                                key={record.id}
                                className="flex items-center justify-between gap-2 rounded-md border border-border px-2 py-1.5 text-sm"
                            >
                                <span className="min-w-0 truncate">
                                    <span className="font-mono text-xs text-muted-foreground">
                                        #{record.id}
                                    </span>{' '}
                                    {record.payload}
                                    {record.user_id && (
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            (user {record.user_id})
                                        </span>
                                    )}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`Delete record ${record.id}`}
                                    className="size-8 text-muted-foreground hover:text-destructive"
                                    onClick={() =>
                                        router
                                            .optimistic((props: Props) => ({
                                                records: props.records.filter(
                                                    (row) =>
                                                        row.id !== record.id,
                                                ),
                                            }))
                                            .delete(
                                                PlaygroundController.deleteRecord.url(
                                                    record.id,
                                                ),
                                                { preserveScroll: true },
                                            )
                                    }
                                >
                                    <TrashIcon />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </PanelContent>
        </Panel>
    );
}

function JobsPanel({ jobs }: { jobs: JobRun[] }) {
    return (
        <Panel id="jobs">
            <PanelHeader>
                <ZapIcon className="size-4 text-muted-foreground" />
                Jobs
            </PanelHeader>
            <PanelContent className="flex flex-1 flex-col gap-3">
                <Button
                    className="self-start"
                    onClick={() =>
                        router.post(
                            PlaygroundController.dispatchJob.url(),
                            {},
                            { preserveScroll: true },
                        )
                    }
                >
                    Dispatch single job
                </Button>
                <p className="text-sm text-muted-foreground">
                    {jobs.length} recent runs — each one broadcasts{' '}
                    <code className="font-mono">job.ran</code> when it finishes.
                </p>
                {jobs.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                        Nothing has run yet.
                    </p>
                ) : (
                    <ul className="max-h-40 space-y-1 overflow-auto text-xs">
                        {jobs.map((job) => (
                            <li
                                key={job.id}
                                className="flex justify-between gap-2"
                            >
                                <span className="truncate">{job.message}</span>
                                <span className="shrink-0 font-mono text-muted-foreground">
                                    {time(job.created_at)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </PanelContent>
        </Panel>
    );
}

function BatchPanel({ batch }: { batch: BatchSnapshot | null }) {
    const [count, setCount] = useState(5);
    const pct =
        batch && batch.totalJobs > 0
            ? (batch.processedJobs / batch.totalJobs) * 100
            : 0;

    return (
        <Panel>
            <PanelHeader>
                <LayersIcon className="size-4 text-muted-foreground" />
                Batch
            </PanelHeader>
            <PanelContent className="flex flex-1 flex-col gap-3">
                <div className="flex gap-2">
                    <Input
                        type="number"
                        min={1}
                        max={50}
                        className="w-24"
                        value={count}
                        onChange={(event) =>
                            setCount(Number(event.target.value))
                        }
                    />
                    <Button
                        onClick={() =>
                            router.post(
                                PlaygroundController.dispatchBatch.url(),
                                { count },
                                { preserveScroll: true },
                            )
                        }
                    >
                        Dispatch batch
                    </Button>
                </div>

                {batch ? (
                    <>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                                {batch.processedJobs} / {batch.totalJobs}{' '}
                                processed · {batch.pendingJobs} pending ·{' '}
                                {batch.failedJobs} failed
                            </span>
                            <Badge
                                variant={
                                    batch.finished
                                        ? 'soft-green'
                                        : 'soft-orange'
                                }
                            >
                                {batch.finished ? 'finished' : 'running'}
                            </Badge>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className={cn(
                                    'h-full rounded-full bg-emerald-500 transition-all',
                                )}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <p className="font-mono text-xs text-muted-foreground">
                            id: {batch.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Progress arrives per finished job via the batch{' '}
                            <code className="font-mono">progress()</code> and{' '}
                            <code className="font-mono">finally()</code>{' '}
                            callbacks.
                        </p>
                    </>
                ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                        No active batch.
                    </p>
                )}
            </PanelContent>
        </Panel>
    );
}

function ActivityLogPanel({ activities }: { activities: ActivityEntry[] }) {
    const form = useForm({ description: '', event: 'custom' });

    return (
        <div id="activity" className="flex flex-col gap-3">
            <Panel>
                <PanelHeader>
                    <ActivityIcon className="size-4 text-muted-foreground" />
                    Activity log
                    <span className="font-normal text-muted-foreground">
                        separate pgsql_activitylog database
                    </span>
                </PanelHeader>
                <PanelContent>
                    <form
                        className="flex flex-wrap gap-2"
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.post(PlaygroundController.logActivity.url(), {
                                preserveScroll: true,
                                onSuccess: () => form.reset('description'),
                            });
                        }}
                    >
                        <Input
                            className="min-w-64 flex-1"
                            placeholder="Description (e.g. clicked the big red button)"
                            value={form.data.description}
                            onChange={(event) =>
                                form.setData('description', event.target.value)
                            }
                        />
                        <Select
                            value={form.data.event}
                            onValueChange={(value) =>
                                form.setData('event', value)
                            }
                        >
                            <SelectTrigger className="w-36">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="custom">custom</SelectItem>
                                <SelectItem value="created">created</SelectItem>
                                <SelectItem value="updated">updated</SelectItem>
                                <SelectItem value="deleted">deleted</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" loading={form.processing}>
                            Log
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.post(
                                    PlaygroundController.clearActivities.url(),
                                    {},
                                    { preserveScroll: true },
                                )
                            }
                        >
                            Clear all
                        </Button>
                    </form>
                </PanelContent>
            </Panel>

            {activities.length === 0 ? (
                <EmptyState
                    icon={<ActivityIcon className="size-7" />}
                    title="No activities yet"
                    description="Log one above, or trigger a job — every write lands in interactive-app-activitylog."
                />
            ) : (
                <TableFrame className="table-frame-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">#</TableHead>
                                <TableHead className="w-28">Log</TableHead>
                                <TableHead className="w-28">Event</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-44">Subject</TableHead>
                                <TableHead className="w-24">At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activities.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell className="font-mono text-muted-foreground">
                                        {activity.id}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="soft-gray"
                                            className="font-mono"
                                        >
                                            {activity.log_name ?? 'default'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="soft-green"
                                            className="font-mono"
                                        >
                                            {activity.event ?? '—'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="truncate">
                                        {activity.description}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {activity.subject_type
                                            ? `${activity.subject_type}#${activity.subject_id}`
                                            : '—'}
                                        {activity.causer_id
                                            ? ` · user#${activity.causer_id}`
                                            : ''}
                                    </TableCell>
                                    <TableCell className="font-mono text-muted-foreground">
                                        {time(activity.created_at)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableFrame>
            )}
        </div>
    );
}

function PollPanel({
    polling,
    jobsCount,
    recordsCount,
}: {
    polling: boolean;
    jobsCount: number;
    recordsCount: number;
}) {
    return (
        <Panel>
            <PanelHeader>Polling</PanelHeader>
            <PanelContent className="flex flex-1 flex-col gap-2">
                <p className="text-sm">
                    Status:{' '}
                    <Badge variant={polling ? 'soft-green' : 'soft-gray'}>
                        {polling ? 'active' : 'paused'}
                    </Badge>
                </p>
                <p className="text-sm text-muted-foreground">
                    Showing {jobsCount} jobs and {recordsCount} records — toggle
                    in the header to enable 2s Inertia partial reloads (
                    <code className="font-mono">router.reload</code>). Leave it
                    off to prove the page updates purely from broadcasts.
                </p>
                <p className="text-xs text-muted-foreground">
                    Horizon dashboard:{' '}
                    <a className="underline" href="/horizon">
                        /horizon
                    </a>
                </p>
            </PanelContent>
        </Panel>
    );
}
