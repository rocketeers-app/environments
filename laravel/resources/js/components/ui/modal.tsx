import { Modal, useModal } from '@inertiaui/modal-react';
import type { LucideIcon } from 'lucide-react';
import { X } from 'lucide-react';
import {
    createContext,
    createElement,
    isValidElement,
    useCallback,
    useContext,
    type ComponentProps,
    type ElementType,
    type ReactNode,
} from 'react';

import { Button } from '@/components/ui/button';
import { UNSAVED_CHANGES_MESSAGE } from '@/hooks/use-unsaved-changes';
import { cn } from '@/lib/utils';
import { confirmDialog } from '@/components/shared/confirm-dialog';

/**
 * The app's one modal shape. The panel itself is the card — content sits directly in it,
 * so there is a single padding ring instead of a panel wrapped around a <Card>.
 */
// The backdrop blurs rather than dims (shared/inertia-modal.css), so the panel carries the
// separation itself: a real shadow instead of the card's shadow-sm.
export const MODAL_PANEL_CLASSES =
    'bg-table-header text-card-foreground flex flex-col gap-5 rounded-2xl border-[10px] border-sidebar bg-clip-padding shadow-2xl ring-1 ring-black/5 dark:ring-white/10';

export const MODAL_PADDING_CLASSES = 'p-4 sm:p-6';

export const SLIDEOVER_PANEL_CLASSES =
    'bg-table-header text-card-foreground flex h-dvh flex-col gap-5 border-l shadow-2xl';

const SIZE_MAX_WIDTHS = {
    sm: 'md',
    md: '2xl',
    lg: '4xl',
    xl: '7xl',
} as const;

export type AppModalSize = keyof typeof SIZE_MAX_WIDTHS;

/**
 * Closes the modal the calling page is rendered in. Reads the modal off the stack rather
 * than a ref, so it also works above the <AppModal> element — which is where a page's
 * submit handlers live.
 */
export function useModalClose(): () => void {
    const modal = useModal();

    return useCallback(() => modal?.close(), [modal]);
}

/** The user-initiated close (close button, cancel button), which `guardUnsaved` can intercept. */
const DismissContext = createContext<(() => void) | null>(null);

function useDismiss(): () => void {
    const dismiss = useContext(DismissContext);

    if (!dismiss) {
        throw new Error('This component must be rendered inside an <AppModal>.');
    }

    return dismiss;
}

type AppModalProps = {
    children: ReactNode;
    size?: AppModalSize;
    slideover?: boolean;
    /** Blocks Esc and click-outside, and asks for confirmation on the close button. */
    guardUnsaved?: boolean;
    className?: string;
    onClose?: () => void;
    onAfterLeave?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
};

export function AppModal({
    children,
    size = 'md',
    slideover = false,
    guardUnsaved = false,
    className,
    ...modalProps
}: AppModalProps) {
    const panelClasses = slideover
        ? SLIDEOVER_PANEL_CLASSES
        : `${MODAL_PANEL_CLASSES} max-h-[calc(100dvh-2rem)]`;

    return (
        <Modal
            maxWidth={SIZE_MAX_WIDTHS[size]}
            slideover={slideover}
            position={slideover ? 'right' : 'center'}
            paddingClasses={MODAL_PADDING_CLASSES}
            panelClasses={cn(panelClasses, className)}
            closeButton={false}
            closeExplicitly={guardUnsaved}
            {...modalProps}
        >
            {({ close }) => {
                const dismiss = async () => {
                    if (
                        guardUnsaved &&
                        !(await confirmDialog({
                            title: 'Discard unsaved changes?',
                            description: UNSAVED_CHANGES_MESSAGE,
                            confirmLabel: 'Discard',
                            cancelLabel: 'Keep editing',
                            tone: 'destructive',
                        }))
                    ) {
                        return;
                    }

                    close();
                };

                return (
                    <DismissContext.Provider value={dismiss}>
                        {children}
                        <ModalCloseButton onClick={dismiss} />
                    </DismissContext.Provider>
                );
            }}
        </Modal>
    );
}

export function ModalCloseButton({ className, ...props }: ComponentProps<'button'>) {
    return (
        <button
            type="button"
            {...props}
            className={cn(
                'absolute top-3 right-3 z-10 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                className,
            )}
        >
            <X className="size-4" />
            <span className="sr-only">Close</span>
        </button>
    );
}

export function AppModalForm({ className, ...props }: ComponentProps<'form'>) {
    return <form className={cn('flex min-h-0 flex-1 flex-col gap-5', className)} {...props} />;
}

interface AppModalHeaderProps {
    title: ReactNode;
    description?: ReactNode;
    /** A lucide icon component, or any node when a brand/provider glyph is needed. */
    icon?: LucideIcon | ReactNode;
    tone?: 'default' | 'destructive';
    className?: string;
    children?: ReactNode;
}

export function AppModalHeader({
    title,
    description,
    icon,
    tone = 'default',
    className,
    children,
}: AppModalHeaderProps) {
    // Lucide icons are forwardRef objects rather than plain functions, so component types
    // are told apart from already-built elements with isValidElement rather than typeof.
    const iconNode = icon
        ? isValidElement(icon)
            ? icon
            : createElement(icon as ElementType, { className: 'size-4' })
        : null;

    return (
        <div
            className={cn(
                'flex shrink-0 items-start gap-3 pr-8',
                className,
            )}
        >
            {iconNode && (
                <div
                    className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground [&_svg]:size-4',
                        tone === 'destructive' &&
                            'border-destructive/25 bg-destructive/10 text-destructive',
                    )}
                >
                    {iconNode}
                </div>
            )}
            <div className="min-w-0 space-y-1">
                <h2 className="text-xl leading-tight font-bold">{title}</h2>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
                {children}
            </div>
        </div>
    );
}

export function AppModalBody({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot="modal-body"
            className={cn('min-h-0 flex-1 overflow-y-auto rounded-xl border bg-background p-4 sm:p-5', className)}
            {...props}
        />
    );
}

export function AppModalFooter({
    secondary,
    className,
    children,
    ...props
}: ComponentProps<'div'> & { secondary?: ReactNode }) {
    return (
        <div
            className={cn(
                'flex shrink-0 items-center gap-2',
                secondary ? 'justify-between' : 'justify-end',
                className,
            )}
            {...props}
        >
            {secondary && <div className="flex items-center gap-2">{secondary}</div>}
            <div className="flex items-center justify-end gap-2">{children}</div>
        </div>
    );
}

export function ModalCancelButton({
    children = 'Cancel',
    ...props
}: Omit<ComponentProps<typeof Button>, 'variant' | 'type' | 'onClick'>) {
    const dismiss = useDismiss();

    return (
        <Button type="button" variant="cancel" onClick={dismiss} {...props}>
            {children}
        </Button>
    );
}
