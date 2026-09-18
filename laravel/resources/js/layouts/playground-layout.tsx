import type { ReactNode } from 'react';
import AppLayout from '@/layouts/app-layout';
import { playgroundNavGroups } from '@/lib/playground-nav';

/**
 * The app shell wearing the playground's navigation. Mounted as an Inertia persistent
 * layout so the chrome survives the partial reloads the broadcast demos fire constantly.
 */
export default function PlaygroundLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <AppLayout mainNav={playgroundNavGroups()}>{children}</AppLayout>;
}

export const withPlaygroundLayout = (page: ReactNode) => (
    <PlaygroundLayout>{page}</PlaygroundLayout>
);
