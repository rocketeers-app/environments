import { GitBranch } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Environment chips are hollow and only colour on hover (staging amber, production red);
 * a chip carrying a branch lights label and branch separately, as they are separate targets.
 */
type EnvironmentStyle = {
    label?: string;
    frameClassName: string;
    segmentClassName: string;
    dotClassName: string;
};

export const environmentStyles: Record<
    string,
    EnvironmentStyle & { label: string }
> = {
    production: {
        label: 'Production',
        frameClassName: 'hover:border-red-500',
        segmentClassName:
            'hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400',
        dotClassName: 'bg-red-500',
    },
    staging: {
        label: 'Staging',
        frameClassName: 'hover:border-amber-500',
        segmentClassName:
            'hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400',
        dotClassName: 'bg-amber-500',
    },
    // development: {
    //     label: 'Development',
    //     frameClassName: 'hover:border-blue-500',
    //     segmentClassName:
    //         'hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400',
    //     dotClassName: 'bg-blue-500',
    // },
};

const fallback: EnvironmentStyle = {
    frameClassName: 'hover:border-foreground/60',
    segmentClassName: 'hover:text-foreground',
    dotClassName: 'bg-muted-foreground',
};

type SegmentRenderer = (node: ReactNode, className: string) => ReactNode;

const renderSegment: SegmentRenderer = (node, className) => (
    <span className={className}>{node}</span>
);

export function EnvironmentTypeBadge({
    label,
    branch,
    className,
    renderLabel = renderSegment,
    renderBranch = renderSegment,
}: {
    label: string;
    branch?: string | null;
    className?: string;
    renderLabel?: SegmentRenderer;
    renderBranch?: SegmentRenderer;
}) {
    const style = environmentStyles[label] ?? fallback;
    const segment = (extra?: string) =>
        cn(
            'inline-flex items-center gap-1 px-2 py-0.5 transition-colors [&>svg]:size-3',
            style.segmentClassName,
            extra,
        );

    return (
        <Badge
            variant="outline"
            className={cn(
                'rounded-sm border-foreground/25 bg-transparent text-xs font-medium text-muted-foreground uppercase transition-colors',
                branch
                    ? 'gap-0 p-0'
                    : [style.frameClassName, style.segmentClassName],
                className,
            )}
        >
            {branch ? (
                <>
                    {renderLabel(
                        environmentStyles[label]?.label ?? label,
                        segment(),
                    )}
                    <span className="h-3 w-px shrink-0 bg-current opacity-30" />
                    {renderBranch(
                        <>
                            <GitBranch />
                            {branch}
                        </>,
                        segment('normal-case'),
                    )}
                </>
            ) : (
                renderLabel(environmentStyles[label]?.label ?? label, '')
            )}
        </Badge>
    );
}
