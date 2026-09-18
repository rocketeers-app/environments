import { useEffect, useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogOptions {
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: 'default' | 'destructive';
}

type PendingConfirmation = ConfirmDialogOptions & {
    resolve: (confirmed: boolean) => void;
    container: HTMLElement | null;
};

let open: ((confirmation: PendingConfirmation) => void) | null = null;

/**
 * An in-app replacement for `window.confirm()` where no server round trip is involved, such as
 * guarding unsaved changes. Confirmations of a server action use ConfirmModal on its own route.
 *
 * Rendered inside the topmost open modal when there is one: modals are native `<dialog>` elements
 * with their own focus trap, so anything portaled outside them can be neither focused nor clicked.
 */
export function confirmDialog(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise((resolve) => {
        if (open === null) {
            resolve(false);

            return;
        }

        const wrappers = document.querySelectorAll<HTMLElement>(
            'dialog[open] .im-modal-wrapper',
        );

        open({
            ...options,
            resolve,
            container: wrappers[wrappers.length - 1] ?? null,
        });
    });
}

export function ConfirmDialogHost() {
    const [pending, setPending] = useState<PendingConfirmation | null>(null);

    useEffect(() => {
        open = (confirmation) =>
            setPending((current) => {
                current?.resolve(false);

                return confirmation;
            });

        return () => {
            open = null;
        };
    }, []);

    const settle = (confirmed: boolean) => {
        pending?.resolve(confirmed);
        setPending(null);
    };

    return (
        <AlertDialog
            open={pending !== null}
            onOpenChange={(isOpen) => !isOpen && settle(false)}
        >
            <AlertDialogContent container={pending?.container}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{pending?.title}</AlertDialogTitle>
                    {pending?.description && (
                        <AlertDialogDescription>
                            {pending.description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => settle(false)}>
                        {pending?.cancelLabel ?? 'Cancel'}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant={
                            pending?.tone === 'destructive'
                                ? 'destructive'
                                : 'default'
                        }
                        onClick={() => settle(true)}
                    >
                        {pending?.confirmLabel ?? 'Confirm'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
