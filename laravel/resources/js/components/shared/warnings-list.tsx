import { CircleAlert, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export interface Warning {
    type: string;
    message: string;
    severity?: 'warning' | 'critical';
    detail?: string;
    action?: { label: string; onClick: () => void };
}

export function WarningsList({ warnings }: { warnings: Warning[] }) {
    if (warnings.length === 0) {
        return null;
    }

    const criticalCount = warnings.filter(
        (w) => w.severity === 'critical',
    ).length;
    const warningCount = warnings.length - criticalCount;

    const summaryParts: React.ReactNode[] = [];

    if (warningCount > 0) {
        summaryParts.push(
            <span key="warnings">
                {warningCount} warning{warningCount > 1 ? 's' : ''}
            </span>,
        );
    }

    if (criticalCount > 0) {
        if (summaryParts.length > 0) {
            summaryParts.push(<span key="sep">, </span>);
        }

        summaryParts.push(
            <span key="critical" className="font-medium text-destructive">
                {criticalCount} critical
            </span>,
        );
    }

    return (
        <details className="group" open={criticalCount > 0}>
            <summary className="flex cursor-pointer items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                {criticalCount > 0 ? (
                    <CircleAlert className="h-4 w-4 text-destructive" />
                ) : (
                    <TriangleAlert className="h-4 w-4" />
                )}
                <span>{summaryParts} found</span>
            </summary>
            <div className="mt-2 flex flex-col gap-2">
                {warnings.map((warning) => {
                    const isCritical = warning.severity === 'critical';

                    return (
                        <Alert
                            key={warning.type}
                            variant={isCritical ? 'destructive' : 'default'}
                            className={
                                isCritical
                                    ? 'border-destructive [&>svg]:text-destructive'
                                    : 'border-amber-500/50 text-amber-600 dark:text-amber-400 [&>svg]:text-amber-500'
                            }
                        >
                            {isCritical ? (
                                <CircleAlert className="h-4 w-4" />
                            ) : (
                                <TriangleAlert className="h-4 w-4" />
                            )}
                            <AlertDescription>
                                <span>{warning.message}</span>
                                {warning.detail && (
                                    <pre className="mt-2 overflow-x-auto rounded bg-muted p-2 text-xs whitespace-pre-wrap">
                                        {warning.detail}
                                    </pre>
                                )}
                                {warning.action && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={warning.action.onClick}
                                    >
                                        {warning.action.label}
                                    </Button>
                                )}
                            </AlertDescription>
                        </Alert>
                    );
                })}
            </div>
        </details>
    );
}
