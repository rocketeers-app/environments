import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

/**
 * Renders markdown the way an agent writes it: GFM tables and task lists, fenced code, and
 * links that leave the page in a new tab. Raw HTML is never rendered, so text from a session
 * cannot inject markup into the page.
 */
export function Markdown({
    children,
    className,
}: {
    children: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'prose prose-sm max-w-none break-words dark:prose-invert prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto',
                className,
            )}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ href, children: label }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            {label}
                        </a>
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
