import { LayoutGrid, Server } from 'lucide-react';
import type { NavGroup } from '@/types';

/**
 * The playground's own tab strip, in the shape `AppMainNav` reads. The design system ships
 * the origin app's navigation (`mainNavGroups`) untouched for reference; this is what the
 * playground runs on, so every tab leads somewhere that exists here. No item carries
 * sections: the playground is a single dense page, and a section link would send an Inertia
 * visit that remounts it and drops the live-step log.
 */
export const playgroundNavGroups = (): NavGroup[] => [
    {
        items: [
            {
                title: 'Playground',
                href: '/',
                icon: LayoutGrid,
                exact: true,
            },
            {
                title: 'Horizon',
                href: '/horizon',
                icon: Server,
                external: true,
                hideOnMobile: true,
            },
        ],
    },
];
