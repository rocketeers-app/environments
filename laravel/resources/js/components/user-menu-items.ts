import type { LucideIcon } from 'lucide-react';
import {
    Activity,
    DollarSign,
    Folder,
    Monitor,
    Moon,
    Settings,
    Sun,
} from 'lucide-react';
import type { Appearance } from '@/hooks/use-appearance';
import {
    activityIndex as ActivityIndex,
    profileEdit as edit,
    financesIndex as FinancesIndex,
    projectsIndex as ProjectsIndex,
} from '@/lib/design-routes';

/**
 * The user menu's entries, shared by the navbar dropdown and the command palette so the
 * two stay identical — on mobile the palette is the only place the menu is reachable.
 */
export type UserMenuItem = {
    title: string;
    href: string;
    icon: LucideIcon;
};

export type AppearanceOption = {
    value: Appearance;
    title: string;
    /** Label for a flat list with no "Theme" parent to lend it context. */
    standaloneTitle?: string;
    icon: LucideIcon;
};

export function userMenuItems(): UserMenuItem[] {
    return [
        { title: 'Activity', href: ActivityIndex().url, icon: Activity },
        { title: 'Finance', href: FinancesIndex().url, icon: DollarSign },
        { title: 'Projects', href: ProjectsIndex().url, icon: Folder },
        { title: 'Settings', href: edit().url, icon: Settings },
    ];
}

export function appearanceOptions(): AppearanceOption[] {
    return [
        {
            value: 'light',
            title: 'Light',
            standaloneTitle: 'Light Mode',
            icon: Sun,
        },
        {
            value: 'dark',
            title: 'Dark',
            standaloneTitle: 'Dark Mode',
            icon: Moon,
        },
        { value: 'system', title: 'System', icon: Monitor },
    ];
}
