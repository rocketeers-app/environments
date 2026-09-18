import { useForm } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Trash2, TriangleAlert } from 'lucide-react';
import type { FormEventHandler, ReactNode } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { AppModalSize } from '@/components/ui/modal';
import {
    AppModal,
    AppModalBody,
    AppModalFooter,
    AppModalForm,
    AppModalHeader,
    ModalCancelButton,
    useModalClose,
} from '@/components/ui/modal';

interface ConfirmModalProps {
    title: string;
    description: ReactNode;
    url: string;
    confirmLabel: string;
    successMessage: string;
    errorMessage: string;
    method?: 'delete' | 'post' | 'put' | 'patch';
    /** Payload sent with the request, for endpoints that need more than the URL. */
    data?: Record<string, unknown>;
    onSuccess?: () => void;
    tone?: 'default' | 'destructive';
    icon?: LucideIcon | ReactNode;
    size?: AppModalSize;
    /** Summary of what is being acted on, rendered between the header and the footer. */
    children?: ReactNode;
    /** Withholds the confirm button. Implied by `blockedReason`. */
    canConfirm?: boolean;
    /** Short sentence explaining why the action is unavailable, shown in a destructive panel. */
    blockedReason?: ReactNode;
    /** Richer explanation of what blocks the action, e.g. a dependency tree. */
    blockedContent?: ReactNode;
    confirmDisabled?: boolean;
}

/** The one shape for "are you sure?" — a destructive or neutral confirmation of a single action. */
export function ConfirmModal({ size = 'sm', ...props }: ConfirmModalProps) {
    return (
        <AppModal size={size}>
            <ConfirmModalContent {...props} />
        </AppModal>
    );
}

function ConfirmModalContent({
    title,
    description,
    url,
    confirmLabel,
    successMessage,
    errorMessage,
    method = 'delete',
    data,
    onSuccess,
    tone = 'destructive',
    icon,
    children,
    canConfirm = true,
    blockedReason,
    blockedContent,
    confirmDisabled = false,
}: Omit<ConfirmModalProps, 'size'>) {
    const close = useModalClose();
    const form = useForm(method, url, (data ?? {}) as Record<string, never>);
    const blocked = !canConfirm || Boolean(blockedReason);

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        form[method](url, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(successMessage);
                onSuccess?.();
                close();
            },
            onError: () => toast.error(errorMessage),
        });
    };

    return (
        <AppModalForm onSubmit={submit}>
            <AppModalHeader
                title={title}
                description={description}
                icon={icon ?? (tone === 'destructive' ? Trash2 : TriangleAlert)}
                tone={tone}
            />

            {(children || blocked) && (
                <AppModalBody className="space-y-4">
                    {children && (
                        <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
                            {children}
                        </div>
                    )}
                    {blockedReason && (
                        <div className="rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2.5 text-sm text-muted-foreground">
                            {blockedReason}
                        </div>
                    )}
                    {blocked && blockedContent}
                </AppModalBody>
            )}

            <AppModalFooter>
                <ModalCancelButton disabled={form.processing}>
                    {blocked ? 'Close' : 'Cancel'}
                </ModalCancelButton>
                {!blocked && (
                    <Button
                        type="submit"
                        variant={
                            tone === 'destructive' ? 'destructive' : 'default'
                        }
                        loading={form.processing}
                        disabled={confirmDisabled}
                    >
                        {confirmLabel}
                    </Button>
                )}
            </AppModalFooter>
        </AppModalForm>
    );
}
