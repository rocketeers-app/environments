import { useCallback, useEffect, useRef } from 'react';

const ACTIVE_SELECTOR = '[aria-current="page"],[data-state="active"]';
const PEEK = 32;

interface Span {
    left: number;
    right: number;
}

/**
 * How far the strip has to scroll for `item` to sit inside `viewport` with `peek` pixels of
 * its neighbour still showing; 0 when it already does, negative to scroll towards the start.
 */
export function scrollDelta(viewport: Span, item: Span, peek = PEEK): number {
    const before = viewport.left - item.left + peek;
    const after = item.right - viewport.right + peek;

    if (before > 0) {
        return -before;
    }

    return after > 0 ? after : 0;
}

/**
 * Keeps the active item of a horizontally scrolling strip inside its scroll viewport, so a
 * tab bar too wide for a phone never opens parked on a section the user cannot see. It moves
 * only when the active item is out of view — a strip the user scrolled by hand stays put —
 * and leaves a sliver of the neighbouring item showing so the strip still reads as scrollable.
 *
 * @returns ref for the scroll container; the active item is looked up inside it.
 */
export function useScrollActiveIntoView<T extends HTMLElement>(
    selector: string = ACTIVE_SELECTOR,
) {
    const ref = useRef<T>(null);
    const seen = useRef<Element | null>(null);

    const reveal = useCallback(
        (behavior: ScrollBehavior) => {
            const container = ref.current;
            const active = container?.querySelector(selector);

            if (!container || !active) {
                return;
            }

            const left = scrollDelta(
                container.getBoundingClientRect(),
                active.getBoundingClientRect(),
            );

            if (left !== 0) {
                container.scrollBy({ left, behavior });
            }
        },
        [selector],
    );

    useEffect(() => {
        const active = ref.current?.querySelector(selector) ?? null;

        if (!active || active === seen.current) {
            return;
        }

        reveal(seen.current === null ? 'auto' : 'smooth');
        seen.current = active;
    });

    useEffect(() => {
        const container = ref.current;

        if (!container) {
            return;
        }

        const observer = new ResizeObserver(() => reveal('auto'));
        observer.observe(container);

        return () => observer.disconnect();
    }, [reveal]);

    return ref;
}
