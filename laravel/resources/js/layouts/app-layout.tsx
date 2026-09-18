import type { ReactNode } from 'react';
import { useDetectFormatting } from '@/hooks/use-detect-formatting';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { NavGroup } from '@/types';

/**
 * The app shell, mounted as an Inertia persistent layout (`Page.layout = withAppLayout`)
 * so it survives navigations instead of remounting with every page.
 */
export default function AppLayout({
    children,
    mainNav,
}: {
    children: ReactNode;
    mainNav?: NavGroup[];
}) {
    useDetectFormatting();

    return <AppLayoutTemplate mainNav={mainNav}>{children}</AppLayoutTemplate>;
}

export const withAppLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
