import { router } from '@inertiajs/react';
import { useEffect } from 'react';

import { confirmDialog } from '@/components/shared/confirm-dialog';

export const UNSAVED_CHANGES_MESSAGE =
    'You have unsaved changes. Leave this page and discard them?';

/**
 * Warns before a dirty form is abandoned — on a browser unload, and on an Inertia visit
 * that swaps the page out.
 *
 * Only plain GET navigations are guarded. Partial and state-preserving visits stay on the
 * form (polls, table search and pagination all reload props in place) and submits are the
 * opposite of abandoning, so prompting on either would fire constantly. The visit is cancelled
 * while the dialog is open and made again once leaving is confirmed.
 */
export function useUnsavedChanges(
    isDirty: boolean,
    message: string = UNSAVED_CHANGES_MESSAGE,
) {
    useEffect(() => {
        if (!isDirty) {
            return;
        }

        const onUnload = (event: BeforeUnloadEvent) => event.preventDefault();

        window.addEventListener('beforeunload', onUnload);

        let leaving = false;

        const off = router.on('before', (event) => {
            const visit = event.detail.visit;

            const staysOnPage =
                visit.method !== 'get' ||
                visit.only.length > 0 ||
                visit.except.length > 0 ||
                visit.preserveState === true ||
                visit.prefetch;

            if (staysOnPage || leaving) {
                return;
            }

            void confirmDialog({
                title: 'Discard unsaved changes?',
                description: message,
                confirmLabel: 'Leave page',
                cancelLabel: 'Stay',
                tone: 'destructive',
            }).then((confirmed) => {
                if (!confirmed) {
                    return;
                }

                leaving = true;

                router.visit(visit.url, {
                    method: visit.method,
                    data: visit.data,
                    replace: visit.replace,
                    preserveScroll: visit.preserveScroll,
                    headers: visit.headers,
                });
            });

            return false;
        });

        return () => {
            window.removeEventListener('beforeunload', onUnload);
            off();
        };
    }, [isDirty, message]);
}
