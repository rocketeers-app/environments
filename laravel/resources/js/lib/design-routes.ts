/**
 * Stand-in for the Wayfinder-generated route helpers the design system was lifted from.
 *
 * The copied components link with `href={someRoute()}` and `someRoute.url()`, shapes that
 * Wayfinder produces from the origin app's routes. This playground has none of those routes,
 * so the helpers are hand-written here with the same call signature and the origin app's
 * paths — the navigation highlights, breadcrumbs and active-state maths all key off the
 * path, and they only read right against the real ones.
 *
 * Wayfinder regenerates `resources/js/actions` and `resources/js/routes` on every build, so
 * these deliberately live under `lib/` where they survive.
 */

export type RouteMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface RouteDefinition {
    url: string;
    method: RouteMethod;
}

export interface RouteHelper {
    (...args: unknown[]): RouteDefinition;
    url(...args: unknown[]): string;
    definition: { methods: RouteMethod[]; url: string };
}

function fill(template: string, args: unknown[]): string {
    const value = args[0];

    if (!template.includes('{')) {
        return template;
    }

    const param =
        value === null || value === undefined
            ? ''
            : typeof value === 'object'
              ? String(
                    (value as Record<string, unknown>).slug ??
                        (value as Record<string, unknown>).id ??
                        '',
                )
              : String(value);

    return template.replace(/\{[^}]+\}/, param).replace(/\/+$/, '') || '/';
}

function route(template: string, method: RouteMethod = 'get'): RouteHelper {
    const helper = ((...args: unknown[]): RouteDefinition => ({
        url: fill(template, args),
        method,
    })) as RouteHelper;

    helper.url = (...args: unknown[]) => fill(template, args);
    helper.definition = { methods: [method], url: template };

    return helper;
}

export const home = route('/');
export const dashboard = route('/');
export const logout = route('/logout', 'post');
export const login = route('/login');
export const register = route('/register');

export const activityIndex = route('/activity');
export const financesIndex = route('/finances');
export const projectsIndex = route('/projects');
export const projectsShow = route('/projects/{project}');
export const projectSwitch = route('/projects/{project}/switch', 'patch');
export const projectClear = route('/projects/clear', 'patch');

export const notificationsReadAll = route('/notifications/read', 'patch');
export const notificationsShow = route('/notifications/{notification}');

export const profileEdit = route('/settings/profile');
export const detectedFormatting = route(
    '/settings/profile/detected-formatting',
    'patch',
);
export const notificationSettingsIndex = route('/settings/notifications');
export const passwordEdit = route('/settings/password');
export const twoFactorShow = route('/settings/two-factor');
export const passkeysIndex = route('/settings/passkeys');
export const apiTokensIndex = route('/settings/api-tokens');
export const team = route('/settings/team');
export const teamMembersIndex = route('/settings/members');
export const providerAccounts = route('/settings/provider-accounts');
export const providerNotificationChannels = route(
    '/settings/notification-channels',
);
export const subscription = route('/settings/subscription');
export const agentSettings = route('/settings/agents');
export const aiSettings = route('/settings/mcp');
export const teamSetupIndex = route('/teams/setup');

export const hostingOverviewIndex = route('/hosting');
export const environmentsIndex = route('/environments');
export const serversIndex = route('/servers');
export const repositoriesIndex = route('/repositories');
export const deploymentsIndex = route('/deployments');
export const databasesIndex = route('/databases');
export const daemonsIndex = route('/daemons');
export const storagesIndex = route('/storages');
export const cronIndex = route('/cron');
export const commandsIndex = route('/commands');
export const developOverviewIndex = route('/develop');
export const tasksIndex = route('/tasks');
export const agentsIndex = route('/agents');
export const crawlsIndex = route('/crawls');
export const recipesIndex = route('/recipes');
export const pullRequestsIndex = route('/pull-requests');
export const monitoringOverviewIndex = route('/monitoring');
export const monitoringStatusIndex = route('/monitoring/status');
export const monitoringQueuesIndex = route('/monitoring/queues');
export const healthIndex = route('/health');
export const backupsIndex = route('/backups');
export const certificatesIndex = route('/certificates');
export const errorsIndex = route('/errors');
export const issuesIndex = route('/issues');
export const performanceIndex = route('/performance');
export const requestsIndex = route('/requests');
export const usersIndex = route('/users');
export const indexationIndex = route('/indexation');
export const securityIndex = route('/security');
export const secretsIndex = route('/security/secrets');
export const codeQualityIndex = route('/security/code-quality');
export const pentestsIndex = route('/security/pentests');
export const vulnerabilitiesIndex = route('/security/vulnerabilities');

export const projectSwitcher = {
    switchProject: projectSwitch,
    clear: projectClear,
};
