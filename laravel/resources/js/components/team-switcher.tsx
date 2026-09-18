import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Check, Plus, Settings } from 'lucide-react';
import { SwitcherTriangles } from '@/components/switcher-triangles';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    projectClear as clearProject,
    dashboard,
    team as teamIndex,
    teamSetupIndex,
} from '@/lib/design-routes';
import type { SharedData } from '@/types';

export function TeamSwitcher() {
    const { auth } = usePage<SharedData>().props;
    const { currentTeam, teams } = auth;

    if (!currentTeam || !teams) {
        return null;
    }

    async function switchTeam(teamSlug: string) {
        const path = window.location.pathname;
        const segments = path.split('/').filter(Boolean);

        if (segments.length > 0 && segments[0] === currentTeam.slug) {
            segments[0] = teamSlug;
        } else {
            segments.unshift(teamSlug);
        }

        await axios
            .patch(clearProject.url(teamSlug), null, {
                headers: { Accept: 'application/json' },
            })
            .catch(() => undefined);

        router.visit('/' + segments.join('/') + window.location.search);
    }

    return (
        <div className="flex min-w-0 items-center">
            <Button
                variant="ghost"
                size="sm"
                asChild
                className="max-w-48 min-w-0 gap-2 pr-2 pl-2 sm:pl-3"
            >
                <Link href={dashboard(currentTeam.slug).url}>
                    <div className="flex size-5 shrink-0 items-center justify-center rounded bg-primary text-[10px] font-semibold text-primary-foreground">
                        {currentTeam.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate font-medium">
                        {currentTeam.name}
                    </span>
                </Link>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Switch team"
                        className="group shrink-0 px-1.5 has-[>svg]:px-1.5 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                    >
                        <SwitcherTriangles />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="min-w-56 rounded-lg"
                    align="start"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Teams
                    </DropdownMenuLabel>
                    {teams.map((team) => (
                        <DropdownMenuItem
                            key={team.id}
                            onClick={() => {
                                if (team.id !== currentTeam.id) {
                                    switchTeam(team.slug);
                                }
                            }}
                            className="cursor-pointer"
                        >
                            <div className="flex size-6 items-center justify-center rounded-sm bg-primary text-xs font-semibold text-primary-foreground">
                                {team.name.charAt(0).toUpperCase()}
                            </div>
                            {team.name}
                            {team.id === currentTeam.id && (
                                <Check className="ml-auto size-4" />
                            )}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => router.visit(teamIndex.url())}
                        className="cursor-pointer"
                    >
                        <Settings className="size-4" />
                        Manage team
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.visit(teamSetupIndex.url())}
                        className="cursor-pointer"
                    >
                        <Plus className="size-4" />
                        Create team
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
