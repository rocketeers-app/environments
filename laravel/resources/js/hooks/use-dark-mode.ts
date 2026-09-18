import { useSyncExternalStore } from 'react';

/**
 * One observer for the whole app. IconProvider is rendered 146 times across the app and
 * used to create a MutationObserver per instance, each re-reading the class list and
 * calling setState on mount — so a table of 13 rows paid 13 observers and 13 extra render
 * passes, torn down and rebuilt every time the rows remounted.
 */
let listeners: Array<() => void> = [];
let observer: MutationObserver | null = null;
let snapshot = false;

const read = () =>
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');

const subscribe = (onStoreChange: () => void) => {
    listeners = [...listeners, onStoreChange];

    if (observer === null && typeof document !== 'undefined') {
        snapshot = read();

        observer = new MutationObserver(() => {
            const next = read();

            if (next === snapshot) {
                return;
            }

            snapshot = next;
            listeners.forEach((listener) => listener());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
    }

    return () => {
        listeners = listeners.filter((listener) => listener !== onStoreChange);

        if (listeners.length === 0 && observer !== null) {
            observer.disconnect();
            observer = null;
        }
    };
};

export function useDarkMode(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => snapshot,
        () => false,
    );
}
