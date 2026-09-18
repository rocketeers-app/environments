import type { PropsWithChildren, ReactNode } from 'react';
import { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { PageHeader } from '@/components/page-header';
import { PageTitle } from '@/components/page-title';
import { PageActions } from '@/contexts/page-actions-context';
import { useSubjectNav } from '@/contexts/subject-nav-context';
import { hrefToUrl } from '@/lib/nav-active';
import { cn } from '@/lib/utils';
import type { NavGroup } from '@/types';

export default function SubjectLayout({
    children,
    sidebarNavGroups = [],
    description,
    title,
    className,
    actions = null,
    header = null,
    sidebarFooter = null,
    backHref,
}: PropsWithChildren<{
    sidebarNavGroups?: NavGroup[];
    description?: string;
    title?: string;
    className?: string;
    actions?: React.ReactNode;
    header?: ReactNode;
    sidebarFooter?: ReactNode;
    backHref?: string;
}>) {
    const { setSubjectNav, setSubjectFooter, clearSubjectNav, headerSlot } =
        useSubjectNav();
    const navKey = JSON.stringify(
        sidebarNavGroups.map((group) => [
            group.title,
            group.items.map((item) =>
                item.href ? hrefToUrl(item.href) : item.title,
            ),
        ]),
    );

    // Layout effect, not passive: the sidebar renders before this subtree, so a
    // passive effect would let the browser paint the main nav first and swap it
    // for the subject's a frame later. This lands before the first paint.
    useLayoutEffect(() => {
        if (sidebarNavGroups.length === 0) {
            clearSubjectNav();

            return;
        }

        setSubjectNav(sidebarNavGroups, backHref);

        return () => clearSubjectNav();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navKey]);

    useLayoutEffect(() => {
        setSubjectFooter(sidebarFooter);
    }, [sidebarFooter]);

    return (
        <div className="px-6 pt-2 pb-6">
            {actions ? <PageActions>{actions}</PageActions> : null}
            {headerSlot &&
                createPortal(
                    header ?? (
                        <PageHeader>
                            <PageTitle
                                title={title || 'Settings'}
                                subtitle={description}
                            />
                        </PageHeader>
                    ),
                    headerSlot,
                )}
            <section className={cn('space-y-12', className)}>
                {children}
            </section>
        </div>
    );
}
