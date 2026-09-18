import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

export interface DependencyNode {
    icon?: LucideIcon;
    label: string;
    content?: ReactNode;
    href?: string;
    children?: DependencyNode[];
}

interface DependencyTreeProps {
    nodes: DependencyNode[];
}

function DependencyTreeNode({
    node,
    depth = 0,
}: {
    node: DependencyNode;
    depth?: number;
}) {
    const Icon = node.icon;

    return (
        <div className="border-t first:border-t-0">
            <div
                className="flex items-center justify-between bg-background py-2"
                style={{
                    paddingLeft: `${(depth + 1) * 16}px`,
                    paddingRight: '16px',
                }}
            >
                <div className="flex min-w-0 items-center gap-2 text-sm">
                    {node.content ?? (
                        <>
                            {Icon && (
                                <Icon
                                    className={`h-3.5 w-3.5 shrink-0 ${depth === 0 ? 'text-foreground' : 'text-muted-foreground'}`}
                                />
                            )}
                            <span
                                className={`truncate ${depth === 0 ? 'font-medium' : 'text-sm text-muted-foreground'}`}
                            >
                                {node.label}
                            </span>
                        </>
                    )}
                </div>
                {node.href && (
                    <a
                        href={node.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink className="h-3 w-3" />
                    </a>
                )}
            </div>
            {node.children?.map((child, i) => (
                <DependencyTreeNode key={i} node={child} depth={depth + 1} />
            ))}
        </div>
    );
}

export function DependencyTree({ nodes }: DependencyTreeProps) {
    if (nodes.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                Remove the following resources first:
            </div>
            <div className="overflow-hidden rounded-md border text-sm">
                {nodes.map((node, i) => (
                    <DependencyTreeNode key={i} node={node} />
                ))}
            </div>
        </div>
    );
}
