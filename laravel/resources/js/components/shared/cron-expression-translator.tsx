import cronstrue from 'cronstrue';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    expression: string;
    className?: string;
}

export default function CronExpressionTranslator({
    expression,
    className,
}: Props) {
    const [translation, setTranslation] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!expression) {
            setTranslation(null);
            setError(null);

            return;
        }

        try {
            const result = cronstrue.toString(expression, {
                use24HourTimeFormat: true,
            });
            setTranslation(result);
            setError(null);
        } catch {
            setTranslation(null);
            setError('Invalid cron expression');
        }
    }, [expression]);

    if (!expression) {
        return null;
    }

    return (
        <div className={cn('mt-1.5 flex items-start gap-2 text-sm', className)}>
            {error ? (
                <span className="text-red-500">{error}</span>
            ) : (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                    {translation}
                </span>
            )}
        </div>
    );
}
