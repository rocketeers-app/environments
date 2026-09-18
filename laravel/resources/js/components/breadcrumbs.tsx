import { Link } from '@inertiajs/react';
import { ChevronsUpDown, Search, Server } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { regionCode } from '@/lib/region';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const ServerDropdown = ({
    servers,
}: {
    servers: BreadcrumbItemType['dropdown'];
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredServers = useMemo(() => {
        if (!servers) {
            return [];
        }

        if (!searchTerm) {
            return servers;
        }

        return servers.filter(
            (server) =>
                server.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                server.provider
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                server.region?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [servers, searchTerm]);

    return (
        <div className="w-64">
            {/* Search Input */}
            <div className="border-b p-2">
                <div className="relative">
                    <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search servers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-8 pl-8 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                            // Prevent dropdown from closing when typing
                            e.stopPropagation();
                        }}
                        onClick={(e) => {
                            // Prevent dropdown from closing when clicking input
                            e.stopPropagation();
                        }}
                    />
                </div>
            </div>

            {/* Scrollable Server List */}
            <div className="max-h-64 overflow-y-auto overscroll-contain">
                {filteredServers.length > 0 ? (
                    filteredServers.map((server) => (
                        <DropdownMenuItem key={server.href} asChild>
                            <Link
                                href={server.href}
                                className="flex items-center gap-3 p-2"
                                onClick={(e) => {
                                    // Allow navigation but prevent dropdown from staying open
                                    e.stopPropagation();
                                }}
                            >
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10">
                                    <Server className="h-3 w-3 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate font-medium">
                                        {server.title}
                                    </div>
                                    {server.provider && server.region && (
                                        <div className="text-xs text-muted-foreground">
                                            {server.provider} •{' '}
                                            {regionCode(server.region)}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No servers found
                    </div>
                )}
            </div>
        </div>
    );
};

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;

                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <div className="flex items-center gap-2">
                                                {item.dropdown &&
                                                    item.dropdown.length >
                                                        0 && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 w-6 p-0"
                                                                >
                                                                    <ChevronsUpDown className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Toggle
                                                                        menu
                                                                    </span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="start"
                                                                className="p-0"
                                                            >
                                                                <ServerDropdown
                                                                    servers={
                                                                        item.dropdown
                                                                    }
                                                                />
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                            </div>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={item.href}>
                                                    {item.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
