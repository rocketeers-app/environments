import type { PropsWithChildren } from 'react';
import { AppContent } from '@/components/app-content';
import { AppFooter } from '@/components/app-footer';
import { AppMainNav } from '@/components/app-main-nav';
import { AppSectionNav } from '@/components/app-section-nav';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeaderCustom } from '@/components/app-sidebar-header-custom';
import {
    AppSubjectHeaderSlot,
    AppSubjectNav,
} from '@/components/app-subject-nav';
import { PageErrorBoundary } from '@/components/shared/error-boundary';
import { PageActionsProvider } from '@/contexts/page-actions-context';
import { SubjectNavProvider } from '@/contexts/subject-nav-context';
import { appContainer } from '@/lib/layout';
import { cn } from '@/lib/utils';
import type { NavGroup } from '@/types';

// The support button is NOT rendered here — it lives at the React root (app.tsx) as a
// sibling of the Inertia app, so a page-component crash can never unmount it. This
// boundary only gives an in-content fallback when a sub-component of the page throws.
export default function AppSidebarLayout({
    children,
    mainNav,
}: PropsWithChildren<{ mainNav?: NavGroup[] }>) {
    return (
        <SubjectNavProvider>
            <PageActionsProvider>
                <AppShell variant="sidebar">
                    <AppSidebarHeaderCustom />
                    <AppMainNav groups={mainNav} />
                    <AppContent
                        variant="sidebar"
                        className="min-h-0 overflow-hidden"
                    >
                        <div
                            scroll-region=""
                            className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto"
                        >
                            <div className="flex w-full flex-1 flex-col rounded-b-xl border border-t-0 border-sidebar-border bg-sidebar">
                                <AppSectionNav groups={mainNav} />
                                <div
                                    className={cn(
                                        appContainer,
                                        'flex flex-1 flex-col',
                                    )}
                                >
                                    <AppSubjectHeaderSlot />
                                    <div className="flex flex-1 flex-col md:flex-row md:items-start">
                                        <AppSubjectNav />
                                        <div className="flex min-w-0 flex-1 flex-col py-4">
                                            <PageErrorBoundary>
                                                {children}
                                            </PageErrorBoundary>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <AppFooter />
                        </div>
                    </AppContent>
                </AppShell>
            </PageActionsProvider>
        </SubjectNavProvider>
    );
}
