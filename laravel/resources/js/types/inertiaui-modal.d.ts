declare module '@inertiaui/modal-react' {
    import type { LinkProps } from '@inertiajs/react';
    import type { ReactNode } from 'react';

    export interface ModalRenderProps {
        close: () => void;
        modalContext: ModalInstance;
        isOpen: boolean;
        onTopOfStack: boolean;
        [key: string]: unknown;
    }

    export interface ModalProps {
        children: ReactNode | ((props: ModalRenderProps) => ReactNode);
        className?: string;
        ref?: React.RefObject<ModalInstance | null>;
        maxWidth?: string;
        panelClasses?: string;
        paddingClasses?: string;
        position?: string;
        slideover?: boolean;
        closeButton?: boolean;
        closeExplicitly?: boolean;
        closeOnClickOutside?: boolean;
        onClose?: () => void;
        onAfterLeave?: () => void;
        onFocus?: () => void;
        onBlur?: () => void;
    }

    export interface ModalLinkProps extends Omit<LinkProps, 'as'> {
        children: ReactNode;
        className?: string;
        navigate?: boolean;
        onClose?: () => void;
        onAfterLeave?: () => void;
    }

    export interface VisitModalOptions {
        method?: string;
        data?: Record<string, unknown>;
        headers?: Record<string, string>;
        navigate?: boolean;
        onClose?: () => void;
        onAfterLeave?: () => void;
        listeners?: Record<string, (...args: unknown[]) => void>;
        [key: string]: unknown;
    }

    export interface ModalResponseData {
        component: string;
        props?: Record<string, unknown>;
        url?: string;
        baseUrl?: string;
        id?: string | null;
        [key: string]: unknown;
    }

    export interface ModalStack {
        stack: ModalInstance[];
        visitModal: (
            url: string,
            options?: VisitModalOptions,
        ) => Promise<unknown>;
        pushFromResponseData: (
            responseData: ModalResponseData,
            config?: Record<string, unknown>,
            onClose?: (() => void) | null,
            onAfterLeave?: (() => void) | null,
        ) => Promise<ModalInstance>;
        closeAll: (force?: boolean) => void;
    }

    export interface ModalInstance {
        close: () => void;
        reload: (options?: Record<string, unknown>) => void;
        emit: (event: string, ...args: unknown[]) => void;
        setOpen: (open: boolean) => void;
        getParentModal: () => ModalInstance | null;
        getChildModal: () => ModalInstance | null;
    }

    export const Modal: React.FC<ModalProps>;
    export const ModalLink: React.FC<ModalLinkProps>;
    export const useModalStack: () => ModalStack;
    export const useModal: () => ModalInstance | null;
    export function renderApp<P>(
        App: React.ComponentType<P>,
        pageProps: P,
    ): React.ReactElement;
    export const putConfig: (
        key: string | Record<string, unknown>,
        value?: unknown,
    ) => void;
}
