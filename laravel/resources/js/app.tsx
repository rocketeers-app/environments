import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { putConfig, renderApp } from '@inertiaui/modal-react';
import { configureEcho } from '@laravel/echo-react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';
import { ConfirmDialogHost } from './components/shared/confirm-dialog';
import { PageErrorBoundary } from './components/shared/error-boundary';
import {
    MODAL_PADDING_CLASSES,
    MODAL_PANEL_CLASSES,
    SLIDEOVER_PANEL_CLASSES,
} from './components/ui/modal';
import { Toaster } from './components/ui/sonner';
import { initializeTheme } from './hooks/use-appearance';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Playground';

const TOASTERS = {
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
} as const;

router.on('flash', (event) => {
    Object.entries(event.detail.flash).forEach(([key, message]) => {
        const notify = TOASTERS[key as keyof typeof TOASTERS];

        if (!notify || !message) {
            return;
        }

        (Array.isArray(message) ? message : [message]).forEach((line) =>
            notify(String(line)),
        );
    });
});

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    setup({ el, App, props }) {
        const target = el as HTMLElement & { __reactRoot?: Root };
        const root =
            target.__reactRoot ?? (target.__reactRoot = createRoot(target));

        putConfig({
            type: 'modal',
            navigate: true,
            useNativeDialog: true,
            modal: {
                closeButton: true,
                closeExplicitly: false,
                closeOnClickOutside: true,
                maxWidth: '2xl',
                paddingClasses: MODAL_PADDING_CLASSES,
                panelClasses: MODAL_PANEL_CLASSES,
                position: 'center',
            },
            slideover: {
                closeButton: true,
                closeExplicitly: false,
                closeOnClickOutside: true,
                maxWidth: 'lg',
                paddingClasses: MODAL_PADDING_CLASSES,
                panelClasses: SLIDEOVER_PANEL_CLASSES,
                position: 'right',
            },
        });

        root.render(
            <>
                <PageErrorBoundary>{renderApp(App, props)}</PageErrorBoundary>
                <Toaster />
                <ConfirmDialogHost />
            </>,
        );
    },
    progress: {
        color: '#34d399',
        showSpinner: false,
    },
});

initializeTheme();
