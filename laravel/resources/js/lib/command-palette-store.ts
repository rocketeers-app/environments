/**
 * Module-level store for the command palette (the mobile menu behind the ⋮ button).
 *
 * The palette is a lazy chunk that pulls ~60 modules, so on a phone it can still be
 * loading for a second or more after the header is tappable. It used to be opened by
 * dispatching a DOM CustomEvent, which nobody was listening for yet during that window,
 * so the first tap was silently dropped. This store holds the request instead and
 * replays it the moment the palette mounts. Requests older than OPEN_REQUEST_TTL_MS are
 * discarded, so a tap the user has long since given up on does not pop the palette open
 * out of nowhere.
 */
type OpenHandler = () => void;

const OPEN_REQUEST_TTL_MS = 5000;

let handler: OpenHandler | null = null;
let requestedAt: number | null = null;

export function openCommandPalette(): void {
    if (handler) {
        handler();

        return;
    }

    requestedAt = Date.now();
}

export function onOpenCommandPalette(nextHandler: OpenHandler): () => void {
    handler = nextHandler;

    const pendingAt = requestedAt;
    requestedAt = null;

    if (pendingAt !== null && Date.now() - pendingAt < OPEN_REQUEST_TTL_MS) {
        nextHandler();
    }

    return () => {
        if (handler === nextHandler) {
            handler = null;
        }
    };
}
