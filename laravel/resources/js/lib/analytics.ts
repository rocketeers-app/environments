import type { PostHog } from 'posthog-js';

type AnalyticsTask = (posthog: PostHog) => void;

const posthogKey: string | undefined = import.meta.env.VITE_POSTHOG_KEY;
const enabled = typeof window !== 'undefined' && Boolean(posthogKey);

let instance: PostHog | null = null;
let pending: AnalyticsTask[] = [];
let started = false;

function load() {
    import('posthog-js').then(({ default: posthog }) => {
        if (!posthogKey) {
            return;
        }

        posthog.init(posthogKey, {
            api_host:
                import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com',
            capture_pageview: false,
            capture_pageleave: true,
        });

        instance = posthog;
        pending.forEach((task) => task(posthog));
        pending = [];
    });
}

function start() {
    started = true;

    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(load, { timeout: 2000 });
    } else {
        window.setTimeout(load, 1000);
    }
}

/**
 * Runs `task` against PostHog, which is code-split and fetched on idle rather than pulled
 * into the entry chunk — keeping it off the critical path shortens the blank frame between
 * first paint and React mounting. Calls made before it lands are queued and replayed.
 */
export function analytics(task: AnalyticsTask): void {
    if (!enabled) {
        return;
    }

    if (instance) {
        task(instance);

        return;
    }

    pending.push(task);

    if (!started) {
        start();
    }
}
