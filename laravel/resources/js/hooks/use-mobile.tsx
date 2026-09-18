import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(onChange: () => void) {
    const mql = window.matchMedia(MOBILE_QUERY);

    mql.addEventListener('change', onChange);

    return () => mql.removeEventListener('change', onChange);
}

/**
 * Resolved synchronously on the very first render: an effect-based value starts
 * out `false`, so a phone paints the desktop sidebar for one frame and the
 * header then animates from its collapsed height, shoving the content down.
 */
export function useIsMobile() {
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(MOBILE_QUERY).matches,
        () => false,
    );
}
