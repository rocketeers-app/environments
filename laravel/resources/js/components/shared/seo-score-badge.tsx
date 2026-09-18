import { cn } from '@/lib/utils';

interface SeoScoreBadgeProps {
    score: number | null | undefined;
    size?: 'sm' | 'md';
    className?: string;
}

function scoreColor(score: number): string {
    if (score >= 80) {
        return 'stroke-emerald-400 text-emerald-600 dark:text-emerald-400';
    }

    if (score >= 50) {
        return 'stroke-amber-400 text-amber-600 dark:text-amber-400';
    }

    return 'stroke-rose-400 text-rose-600 dark:text-rose-400';
}

function trackColor(): string {
    return 'stroke-muted';
}

export function SeoScoreBadge({
    score,
    size = 'sm',
    className,
}: SeoScoreBadgeProps) {
    if (score === null || score === undefined) {
        return <span className="text-sm text-muted-foreground">--</span>;
    }

    const s = size === 'md' ? 36 : 28;
    const strokeWidth = size === 'md' ? 3 : 2.5;
    const radius = (s - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const fontSize =
        size === 'md' ? 'text-xs font-bold' : 'text-[10px] font-semibold';

    return (
        <div
            className={cn(
                'relative inline-flex shrink-0 items-center justify-center',
                className,
            )}
            title={`SEO Score: ${score}/100`}
            style={{ width: s, height: s }}
        >
            <svg
                viewBox={`0 0 ${s} ${s}`}
                style={{ width: s, height: s }}
                className="-rotate-90"
            >
                <circle
                    cx={s / 2}
                    cy={s / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className={trackColor()}
                />
                <circle
                    cx={s / 2}
                    cy={s / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={scoreColor(score)}
                />
            </svg>
            <span
                className={cn(
                    'absolute inset-0 flex items-center justify-center',
                    fontSize,
                    scoreColor(score),
                )}
            >
                {score}
            </span>
        </div>
    );
}
