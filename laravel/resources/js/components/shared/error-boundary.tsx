import { router } from '@inertiajs/react';
import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Catches render/runtime errors in its subtree so a single page crash renders a
 * recoverable fallback instead of unmounting the whole tree. Keep siblings that must
 * survive a crash (e.g. the support button) OUTSIDE this boundary.
 */
export class PageErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    private stopListening?: () => void;

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidMount() {
        // Recover on navigation: a crashed page should not persist its fallback
        // once the user moves to a different page.
        this.stopListening = router.on('navigate', () => {
            if (this.state.hasError) {
                this.setState({ hasError: false });
            }
        });
    }

    componentWillUnmount() {
        this.stopListening?.();
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[PageErrorBoundary]', error, info.componentStack);
        analytics((posthog) =>
            posthog.captureException(error, {
                componentStack: info.componentStack,
            }),
        );
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        if (this.props.fallback) {
            return this.props.fallback;
        }

        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
                <AppLogo className="h-10 w-auto" />
                <div className="space-y-1">
                    <p className="font-medium">Something went wrong</p>
                    <p className="text-sm text-muted-foreground">
                        This page hit an unexpected error. You can reload or
                        reach out via support.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.reload()}
                >
                    Reload page
                </Button>
            </div>
        );
    }
}
