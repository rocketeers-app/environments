// Provider region slugs are stored lowercase ("ams3", "fsn1") but read as codes, so they display uppercase.
export function regionCode(region: string | null | undefined): string {
    return region ? region.toUpperCase() : '';
}
