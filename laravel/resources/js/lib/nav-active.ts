import type { NavGroup, NavItem } from '@/types';

export function hrefToUrl(href: string | { url: string }): string {
    return typeof href === 'string' ? href : href.url;
}

/**
 * Inertia's page url is a path, except after a modal closes: the modal package pushes
 * `window.location.href` back as the url, origin and all. An origin left in front makes
 * every nav path miss, so the whole section strip unmounts until the next real visit.
 */
export function normalizePath(url: string): string {
    return url
        .replace(/^[a-z][a-z\d+.-]*:\/\/[^/]*/i, '')
        .split(/[?#]/)[0]
        .replace(/\/+$/, '');
}

/**
 * The path the navigation reads back. Modals run with `navigate: true`, so an open modal
 * puts its own url — which needs to match no nav item, e.g. `/servers/{id}/reset` under a
 * strip built from `/servers/{slug}` — into Inertia's page url. A modal is a layer over
 * the page you are still looking at, so the strips follow that page instead.
 */
export function navPath(
    url: string,
    modal?: { url?: string; baseUrl?: string } | null,
): string {
    const currentPath = normalizePath(url);

    if (
        !modal?.baseUrl ||
        !modal.url ||
        normalizePath(modal.url) !== currentPath
    ) {
        return currentPath;
    }

    return normalizePath(modal.baseUrl);
}

/** A parent covers its sections' paths, so a hub stays active on any page below it. */
export function itemPaths(item: NavItem): string[] {
    return [
        ...(item.href ? [normalizePath(hrefToUrl(item.href))] : []),
        ...(item.match?.map(normalizePath) ?? []),
        ...(item.items?.flatMap(itemPaths) ?? []),
        ...(item.more?.flatMap(itemPaths) ?? []),
    ];
}

/**
 * Only the deepest matching item lights up. A plain prefix match would keep an
 * overview item (/servers/1) active on every child page (/servers/1/domains).
 */
export function resolveActivePath(
    groups: NavGroup[],
    currentPath: string,
): string | null {
    const paths: string[] = [];

    groups.forEach((group) =>
        group.items?.forEach((item) => {
            paths.push(...itemPaths(item));
        }),
    );

    return (
        paths
            .filter(
                (path) =>
                    currentPath === path || currentPath.startsWith(path + '/'),
            )
            .sort((a, b) => b.length - a.length)[0] ?? null
    );
}

export function isItemActive(
    item: NavItem,
    activePath: string | null,
    currentPath: string,
): boolean {
    if (!item.href) {
        return false;
    }

    const paths = itemPaths(item);

    if (item.exact) {
        return paths.includes(currentPath);
    }

    return activePath !== null && paths.includes(activePath);
}
