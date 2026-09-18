import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/lib/design-routes';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-8">
                <div className="flex flex-col gap-6">
                    <Link
                        href={home()}
                        className="flex w-fit items-center gap-2.5 rounded-md font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                        <span aria-hidden="true">
                            <AppLogoIcon className="h-6 w-auto" />
                        </span>
                        <span className="text-lg font-semibold tracking-tight">
                            Rocketeers
                        </span>
                    </Link>

                    <div className="space-y-1.5">
                        <h1 className="text-xl font-medium">{title}</h1>
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}
