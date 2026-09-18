import { AppSubjectNavDropdown } from '@/components/app-subject-nav-dropdown';
import { NavMain } from '@/components/nav-main';
import { useSubjectNav } from '@/contexts/subject-nav-context';

/**
 * The contextual sub-navigation for a subject (settings, a domain, a mail server). It lives
 * in the persistent shell, so it updates in the same commit as the page.
 */
export function AppSubjectNav() {
    const { subjectNav, subjectFooter } = useSubjectNav();

    if (!subjectNav) {
        return null;
    }

    return (
        <aside className="w-full shrink-0 px-6 pt-6 md:w-60 md:px-0 md:pt-6 md:pb-8 md:pl-4">
            <div className="md:hidden">
                <AppSubjectNavDropdown
                    groups={subjectNav.groups}
                    backHref={subjectNav.backHref}
                />
                {subjectFooter}
            </div>
            <div className="top-8 hidden flex-col gap-2 md:sticky md:flex">
                <NavMain
                    groups={subjectNav.groups}
                    collapsible={false}
                    backHref={subjectNav.backHref}
                />
                {subjectFooter}
            </div>
        </aside>
    );
}

/**
 * Where a subject page's title row lands: above the subject nav and the page, so the
 * nav starts level with the content instead of beside the heading.
 */
export function AppSubjectHeaderSlot() {
    const { setHeaderSlot } = useSubjectNav();

    return (
        <div ref={setHeaderSlot} className="px-6 pt-6 empty:hidden md:pt-10" />
    );
}
