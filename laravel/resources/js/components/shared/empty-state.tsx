import React from 'react';

/** The one empty-state block: icon bubble, title, description and a primary action. */
export interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="table-frame">
            <div className="flex flex-col items-center justify-center rounded-sm border border-table-border bg-card px-6 py-12 sm:px-10">
                {icon && (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted [&_svg]:stroke-[1.25]">
                        {icon}
                    </div>
                )}
                <h3 className="mt-4 text-center text-lg font-semibold">
                    {title}
                </h3>
                <p className="mt-2 max-w-md text-center text-muted-foreground">
                    {description}
                </p>
                {action && <div className="mt-4">{action}</div>}
            </div>
        </div>
    );
}
