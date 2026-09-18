import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Activity as ActivityIcon,
    AppWindow as AppWindowIcon,
    Archive as ArchiveIcon,
    Bot as BotIcon,
    Boxes as BoxesIcon,
    Bug as BugIcon,
    ChartNoAxesColumn as ChartNoAxesColumnIcon,
    CircleAlert as CircleAlertIcon,
    Clock as ClockIcon,
    Code as CodeIcon,
    Cpu as CpuIcon,
    Crosshair as CrosshairIcon,
    Database as DatabaseIcon,
    FileCode as FileCodeIcon,
    FolderGit as FolderGitIcon,
    Gauge as GaugeIcon,
    GitPullRequest as GitPullRequestIcon,
    HardDrive as HardDriveIcon,
    HeartPulse as HeartPulseIcon,
    KeyRound as KeyRoundIcon,
    Layers as LayersIcon,
    LayoutGrid as LayoutGridIcon,
    Rocket as RocketIcon,
    ScrollText as ScrollTextIcon,
    Search as SearchIcon,
    Server as ServerIcon,
    ShieldAlert as ShieldAlertIcon,
    ShieldCheck as ShieldCheckIcon,
    Terminal as TerminalIcon,
    Users as UsersIcon,
} from 'lucide-react';
import { useId } from 'react';
import { useNavPath } from '@/hooks/use-nav-path';
import { useScrollActiveIntoView } from '@/hooks/use-scroll-active-into-view';
import {
    agentsIndex as AgentsIndex,
    backupsIndex as BackupsIndex,
    certificatesIndex as CertificatesIndex,
    codeQualityIndex as CodeQualityIndex,
    commandsIndex as CommandsIndex,
    crawlsIndex as CrawlsIndex,
    cronIndex as CronIndex,
    daemonsIndex as DaemonsIndex,
    databasesIndex as DatabasesIndex,
    deploymentsIndex as DeploymentsIndex,
    developOverviewIndex as DevelopOverviewIndex,
    environmentsIndex as EnvironmentsIndex,
    errorsIndex as ErrorsIndex,
    healthIndex as HealthIndex,
    hostingOverviewIndex as HostingOverviewIndex,
    dashboard as index,
    indexationIndex as IndexationIndex,
    issuesIndex as IssuesIndex,
    monitoringOverviewIndex as MonitoringOverviewIndex,
    monitoringQueuesIndex as MonitoringQueuesIndex,
    monitoringStatusIndex as MonitoringStatusIndex,
    pentestsIndex as PentestsIndex,
    performanceIndex as PerformanceIndex,
    pullRequestsIndex as PullRequestsIndex,
    recipesIndex as RecipesIndex,
    repositoriesIndex as RepositoriesIndex,
    requestsIndex as RequestsIndex,
    secretsIndex as SecretsIndex,
    securityIndex as SecurityIndex,
    serversIndex as ServersIndex,
    storagesIndex as StoragesIndex,
    tasksIndex as TasksIndex,
    usersIndex as UsersIndex,
    vulnerabilitiesIndex as VulnerabilitiesIndex,
} from '@/lib/design-routes';
import { appTabsItemX, appTabsRow } from '@/lib/layout';
import { isItemActive, resolveActivePath } from '@/lib/nav-active';
import { cn } from '@/lib/utils';
import type { NavGroup, SharedData } from '@/types';

interface MainNavOptions {
    hasLaravelEnvironments?: boolean;
}

export const mainNavGroups = ({
    hasLaravelEnvironments = false,
}: MainNavOptions = {}): NavGroup[] => [
    {
        items: [
            {
                title: 'Dashboard',
                href: index(),
                icon: LayoutGridIcon,
                exact: true,
                hideOnMobile: true,
            },
            {
                title: 'Hosting',
                href: HostingOverviewIndex(),
                icon: AppWindowIcon,
                items: [
                    {
                        title: 'Overview',
                        href: HostingOverviewIndex(),
                        icon: LayoutGridIcon,
                        exact: true,
                    },
                    {
                        title: 'Environments',
                        href: EnvironmentsIndex(),
                        icon: BoxesIcon,
                    },
                    {
                        title: 'Servers',
                        href: ServersIndex(),
                        icon: ServerIcon,
                    },
                    {
                        title: 'Repositories',
                        href: RepositoriesIndex(),
                        icon: FolderGitIcon,
                    },
                    {
                        title: 'Scripts',
                        href: TasksIndex(),
                        match: [RecipesIndex().url],
                        icon: ScrollTextIcon,
                    },
                ],
                more: [
                    {
                        title: 'Storages',
                        href: StoragesIndex(),
                        icon: HardDriveIcon,
                    },
                    {
                        title: 'Databases',
                        href: DatabasesIndex(),
                        icon: DatabaseIcon,
                    },
                    {
                        title: 'Daemons',
                        href: DaemonsIndex(),
                        icon: CpuIcon,
                    },
                    {
                        title: 'Cron',
                        href: CronIndex(),
                        icon: ClockIcon,
                    },
                    {
                        title: 'Certificates',
                        href: CertificatesIndex(),
                        icon: ShieldCheckIcon,
                    },
                    {
                        title: 'Deployments',
                        href: DeploymentsIndex(),
                        icon: RocketIcon,
                    },
                    {
                        title: 'Commands',
                        href: CommandsIndex(),
                        icon: TerminalIcon,
                    },
                ],
            },
            {
                title: 'Monitoring',
                href: MonitoringOverviewIndex(),
                icon: HeartPulseIcon,
                items: [
                    {
                        title: 'Overview',
                        href: MonitoringOverviewIndex(),
                        icon: LayoutGridIcon,
                        exact: true,
                    },
                    {
                        title: 'Status',
                        href: MonitoringStatusIndex(),
                        icon: ActivityIcon,
                    },
                    {
                        title: 'Requests',
                        href: RequestsIndex(),
                        icon: ChartNoAxesColumnIcon,
                    },
                    {
                        title: 'Audits',
                        href: PerformanceIndex(),
                        match: [HealthIndex().url, CrawlsIndex().url],
                        icon: GaugeIcon,
                    },
                    ...(hasLaravelEnvironments
                        ? [
                              {
                                  title: 'Queues',
                                  href: MonitoringQueuesIndex(),
                                  icon: LayersIcon,
                              },
                          ]
                        : []),
                    {
                        title: 'Backups',
                        href: BackupsIndex(),
                        icon: ArchiveIcon,
                    },
                    {
                        title: 'Indexation',
                        href: IndexationIndex(),
                        icon: SearchIcon,
                    },
                    {
                        title: 'Users',
                        href: UsersIndex(),
                        icon: UsersIcon,
                    },
                ],
            },
            {
                title: 'Security',
                href: SecurityIndex(),
                icon: ShieldAlertIcon,
                items: [
                    {
                        title: 'Overview',
                        href: SecurityIndex(),
                        icon: ShieldAlertIcon,
                        exact: true,
                    },
                    {
                        title: 'Vulnerabilities',
                        href: VulnerabilitiesIndex(),
                        icon: ShieldAlertIcon,
                    },
                    {
                        title: 'Secrets',
                        href: SecretsIndex(),
                        icon: KeyRoundIcon,
                    },
                    {
                        title: 'Pentests',
                        href: PentestsIndex(),
                        icon: CrosshairIcon,
                    },
                    {
                        title: 'Code Quality',
                        href: CodeQualityIndex(),
                        icon: FileCodeIcon,
                    },
                ],
            },
            {
                title: 'Develop',
                href: DevelopOverviewIndex(),
                icon: CodeIcon,
                items: [
                    {
                        title: 'Overview',
                        href: DevelopOverviewIndex(),
                        icon: LayoutGridIcon,
                        exact: true,
                    },
                    {
                        title: 'Agents',
                        href: AgentsIndex(),
                        icon: BotIcon,
                    },
                    {
                        title: 'Pull Requests',
                        href: PullRequestsIndex(),
                        icon: GitPullRequestIcon,
                    },
                    {
                        title: 'Issues',
                        href: IssuesIndex(),
                        icon: CircleAlertIcon,
                    },
                    {
                        title: 'Errors',
                        href: ErrorsIndex(),
                        icon: BugIcon,
                    },
                ],
            },
        ],
    },
];

// The groups are rebuilt on every render rather than memoized: their hrefs come from the
// Wayfinder url defaults, which carry the current team, so a cached array survives a team
// switch and keeps pointing at the team the user just left.
interface AppMainNavProps {
    groups?: NavGroup[];
}

export function AppMainNav({ groups: providedGroups }: AppMainNavProps = {}) {
    const page = usePage<SharedData>();
    const stripRef = useScrollActiveIntoView<HTMLDivElement>();
    const indicatorId = useId();
    const currentPath = useNavPath();
    const groups =
        providedGroups ??
        mainNavGroups({
            hasLaravelEnvironments: page.props.hasLaravelEnvironments,
        });
    const items = groups.flatMap((group) => group.items ?? []);
    const activePath = resolveActivePath(groups, currentPath);

    return (
        <nav className="relative w-full shrink-0 bg-background">
            <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-sidebar-border"
            />
            <motion.div
                ref={stripRef}
                layoutScroll
                className={cn(
                    appTabsRow,
                    'relative flex items-end gap-0.5 overflow-x-auto pt-2 pb-px sm:gap-1',
                )}
            >
                {items.map((item) => {
                    const active = isItemActive(item, activePath, currentPath);
                    const Tab = item.external ? 'a' : Link;

                    return (
                        <Tab
                            key={item.title}
                            href={item.href as string}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'relative flex h-12 shrink-0 items-center rounded-t-lg bg-background text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar/60 hover:text-foreground',
                                appTabsItemX,
                                item.hideOnMobile && 'hidden sm:flex',
                                active && 'z-10',
                                active &&
                                    'text-foreground [text-shadow:0_1px_0_oklch(1_0_0/0.85)] hover:bg-background dark:[text-shadow:0_1px_0_oklch(0_0_0/0.3)]',
                            )}
                        >
                            {active && (
                                <motion.span
                                    aria-hidden
                                    layoutId={indicatorId}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 38,
                                    }}
                                    style={{
                                        borderTopLeftRadius: 8,
                                        borderTopRightRadius: 8,
                                    }}
                                    className="pointer-events-none absolute inset-x-0 top-0 -bottom-px bg-sidebar bevel-tab"
                                />
                            )}
                            <span className="relative">{item.title}</span>
                        </Tab>
                    );
                })}
            </motion.div>
        </nav>
    );
}
