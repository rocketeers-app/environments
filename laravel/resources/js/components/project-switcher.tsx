import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Check, FolderKanban, Layers, Settings } from 'lucide-react';
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
    projectSwitcher as ProjectSwitcherController,
    projectsIndex,
    projectsShow as showProject,
} from '@/lib/design-routes';
import type { Project, SharedData } from '@/types';

function staysOnPageWhenSwitching(
    page: ReturnType<typeof usePage<SharedData>>,
    project: Project,
): boolean {
    const { component } = page;
    const { navigationContext } = page.props;
    const activeSegment =
        navigationContext?.environment ?? navigationContext?.server;

    if (activeSegment?.project_id != null) {
        return String(activeSegment.project_id) === String(project.id);
    }

    return (
        !component.includes('/') ||
        component.endsWith('/index') ||
        component.startsWith('teams/')
    );
}

export function ProjectSwitcher() {
    const page = usePage<SharedData>();
    const { currentProject, projects } = page.props;

    const projectList = Array.isArray(projects) ? projects : [];

    if (projectList.length <= 1) {
        return null;
    }

    async function switchProject(project: Project) {
        const url = ProjectSwitcherController.switchProject.url({ project });

        if (staysOnPageWhenSwitching(page, project)) {
            router.patch(url);

            return;
        }

        await axios.patch(url, null, {
            headers: { Accept: 'application/json' },
        });

        router.visit(showProject({ project: project.id }).url);
    }

    return (
        <>
            <span className="shrink-0 text-muted-foreground/50">/</span>
            <div className="flex min-w-0 items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="max-w-48 min-w-0 gap-2 pr-2"
                >
                    <Link
                        href={
                            currentProject
                                ? showProject({ project: currentProject.slug })
                                      .url
                                : projectsIndex.url()
                        }
                    >
                        {currentProject ? (
                            <FolderKanban className="size-4 shrink-0 text-muted-foreground" />
                        ) : (
                            <Layers className="size-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className="truncate font-medium">
                            {currentProject
                                ? currentProject.name
                                : 'All projects'}
                        </span>
                    </Link>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Switch project"
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
                            Projects
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                if (currentProject) {
                                    router.patch(
                                        ProjectSwitcherController.clear.url(),
                                    );
                                }
                            }}
                            className="cursor-pointer"
                        >
                            <Layers className="size-4 text-muted-foreground" />
                            All projects
                            {!currentProject && (
                                <Check className="ml-auto size-4" />
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {projectList.map((project) => (
                            <DropdownMenuItem
                                key={project.id}
                                onClick={() => {
                                    if (
                                        !currentProject ||
                                        project.id !== currentProject.id
                                    ) {
                                        switchProject(project);
                                    }
                                }}
                                className="cursor-pointer"
                            >
                                <FolderKanban className="size-4 text-muted-foreground" />
                                {project.name}
                                {currentProject?.id === project.id && (
                                    <Check className="ml-auto size-4" />
                                )}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => router.visit(projectsIndex.url())}
                            className="cursor-pointer"
                        >
                            <Settings className="size-4" />
                            Manage projects
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
