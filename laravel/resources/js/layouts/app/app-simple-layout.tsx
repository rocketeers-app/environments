import type { ReactNode } from 'react';
import { AppContent } from '@/components/app-content';
import { AppFooter } from '@/components/app-footer';
import { AppMainNav } from '@/components/app-main-nav';
import { AppSectionNav } from '@/components/app-section-nav';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeaderCustom } from '@/components/app-sidebar-header-custom';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent } from '@/components/ui/card';
import { PageActionsProvider } from '@/contexts/page-actions-context';
import { appContainer } from '@/lib/layout';
import { cn } from '@/lib/utils';

interface AppSimpleLayoutProps {
    children: ReactNode;
    breadcrumbs?: unknown;
    title?: ReactNode;
    description?: string;
    cardWidth?: string;
    /** Opt-in overrides for a page that frames its own content inside the card. */
    cardClassName?: string;
    contentClassName?: string;
}

export default function AppSimpleLayout({
    children,
    title,
    description,
    cardWidth = 'max-w-md',
    cardClassName,
    contentClassName,
}: AppSimpleLayoutProps) {
    return (
        <PageActionsProvider>
            <AppShell variant="sidebar">
                <AppSidebarHeaderCustom />
                <AppMainNav />
                <AppContent
                    variant="sidebar"
                    className="min-h-0 overflow-hidden"
                >
                    <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <div className="flex w-full flex-1 flex-col rounded-b-xl border border-t-0 border-sidebar-border bg-sidebar">
                            <AppSectionNav />
                            <div
                                className={cn(
                                    appContainer,
                                    'flex flex-1 items-center-safe justify-center p-4 sm:p-6 sm:pt-4',
                                )}
                            >
                                <div className={cn('w-full', cardWidth)}>
                                    <Card
                                        className={cn('w-full', cardClassName)}
                                    >
                                        <CardContent
                                            className={cn(
                                                'p-4',
                                                contentClassName,
                                            )}
                                        >
                                            {title ? (
                                                <PageTitle
                                                    centered
                                                    title={title}
                                                    subtitle={description}
                                                    className="mb-6"
                                                />
                                            ) : (
                                                description && (
                                                    <p className="mb-6 text-center text-sm text-muted-foreground">
                                                        {description}
                                                    </p>
                                                )
                                            )}
                                            {children}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                        <AppFooter />
                    </div>
                </AppContent>
            </AppShell>
        </PageActionsProvider>
    );
}
