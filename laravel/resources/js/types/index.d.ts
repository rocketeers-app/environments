import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        flashDataType: {
            success?: string;
            error?: string;
            warning?: string;
            skipped?: { email: string; reason: string }[];
            storage_id?: string;
        };
    }
}

export type TeamRoleRef = string | { name: string };

export interface TeamAbilities {
    settings: boolean;
    members: boolean;
    providers: boolean;
    notificationChannels: boolean;
    billing: boolean;
    ai: boolean;
    delete: boolean;
}

export interface Auth {
    user: User;
    userRoles: TeamRoleRef[];
    teams: Team[];
    currentTeam: Team;
    can: TeamAbilities;
}

export type DefaultDomainType = 'rocketeers' | 'self-managed';
export type DomainGenerationType = 'uuid' | 'slug';

export interface Team {
    id: string;
    name: string;
    slug: string;
    default_domain?: DefaultDomainType | null;
    default_domain_managed?: string | null;
    default_self_managed_domain_provider_account_id?: string | null;
    default_self_managed_domain_id?: string | null;
    default_self_managed_domain_generation_type?: DomainGenerationType | null;
    force_2fa?: boolean;
    default_ai_provider?: string | null;
    mcp_enabled?: boolean;
    agent_concurrent_runs?: number;
}
export interface Project {
    id: string;
    name: string;
    slug: string;
    team_id: string;
}

export interface NavigationServerOption {
    id: string;
    name: string;
    provider_slug: string | null;
    url: string;
}

export interface NavigationEnvironmentOption {
    id: string;
    name: string;
    label: string | null;
    domain: string | null;
    url: string;
}

/**
 * `name` reads "3 servers" and `current_id` is null when the environment spans more than one,
 * in which case `providers` holds one slug per server for the stacked icons.
 */
export interface NavigationServer {
    name: string;
    url: string;
    providers: (string | null)[];
    current_id: string | null;
    project_id: string | null;
}

export interface NavigationEnvironment {
    name: string;
    label: string | null;
    domain: string | null;
    url: string;
    current_id: string;
    project_id: string | null;
}

export interface NavigationContext {
    server: NavigationServer | null;
    environment: NavigationEnvironment | null;
}

export interface NavigationOptions {
    server: NavigationServerOption[];
    environment: NavigationEnvironmentOption[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
    dropdown?: {
        title: string;
        href: string;
        status?: string;
        provider?: string;
        region?: string;
    }[];
}

export interface NavGroup {
    title?: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    exact?: boolean;
    /** Extra paths that keep this item active, for pages it links to as tabs rather than as nav items. */
    match?: string[];
    /** Drop this item from the tab strip on small screens, where it is reached through the logo or the mobile menu instead. */
    hideOnMobile?: boolean;
    /** A destination outside the Inertia app, so the tab strip renders a plain anchor and the browser does a full document load. */
    external?: boolean;
    items?: NavItem[];
    /** Sections tucked behind the "…" menu at the end of the section strip. */
    more?: NavItem[];
}

export interface ActiveShell {
    sessionId: string;
    serverSlug: string;
    serverName: string;
    providerSlug: string | null;
    title: string;
    startedByName: string | null;
    startedAt: string | null;
}

export interface FormattingPreferences {
    timezone: string;
    locale: string;
    currency: string;
}

export interface AppNotification {
    id: string;
    type: string;
    /** How many events this row stands for; above 1 the message says so. */
    count: number;
    subject: string;
    message: string;
    icon: string;
    tone: string;
    url: string | null;
    read_at: string | null;
    created_at: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    formatting: FormattingPreferences;
    currentProject: Project | null;
    projects: Project[] | null;
    hasClients: boolean;
    navigationContext?: NavigationContext;
    navigationOptions?: NavigationOptions;
    sidebarOpen: boolean;
    clientIp?: string | null;
    activeShells?: ActiveShell[];
    hasLaravelEnvironments?: boolean;
    notificationCount?: number;
    notifications?: AppNotification[];
    [key: string]: unknown;
    userRoles?: TeamRoleRef[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    timezone: string | null;
    locale: string | null;
    currency: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
