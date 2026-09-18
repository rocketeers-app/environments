import type { SharedData } from '@/types';

// The shared `auth.userRoles` prop serializes Spatie Role models, but some
// controllers hand back plain role-name strings — accept either shape.
export function hasTeamRole(
    userRoles: SharedData['auth']['userRoles'] | undefined,
    role: string,
): boolean {
    return (userRoles ?? []).some(
        (entry) => (typeof entry === 'string' ? entry : entry?.name) === role,
    );
}

export function isTeamOwner(
    userRoles: SharedData['auth']['userRoles'] | undefined,
): boolean {
    return hasTeamRole(userRoles, 'owner');
}
