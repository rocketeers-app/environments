/**
 * Single owner of the `theme-color` meta, which iOS Safari uses to tint its
 * toolbars. The appearance hook sets the base colour; a full-bleed surface such
 * as the bottom-docked shell overrides it so the toolbar below it does not
 * leak white against a black terminal.
 */
const SELECTOR = 'meta[name="theme-color"]';

let base = '#ffffff';
let override: string | null = null;

function paint(): void {
    if (typeof document === 'undefined') {
        return;
    }

    document.querySelector(SELECTOR)?.setAttribute('content', override ?? base);
}

export function setBaseThemeColor(color: string): void {
    base = color;
    paint();
}

export function overrideThemeColor(color: string | null): void {
    override = color;
    paint();
}
