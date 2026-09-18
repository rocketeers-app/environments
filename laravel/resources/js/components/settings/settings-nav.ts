import {
    Bell,
    BellIcon,
    Bot as BotIcon,
    Building2Icon,
    CloudyIcon,
    CreditCardIcon,
    Fingerprint,
    Key,
    KeyRound,
    Shield,
    SparklesIcon,
    User,
    UsersIcon,
} from 'lucide-react';
import {
    agentSettings,
    aiSettings,
    apiTokensIndex,
    profileEdit as edit,
    passwordEdit as editPassword,
    teamMembersIndex as membersIndex,
    notificationSettingsIndex as notificationsIndex,
    passkeysIndex,
    providerAccounts,
    providerNotificationChannels,
    twoFactorShow as show,
    subscription,
    team,
} from '@/lib/design-routes';
import type { NavItem, TeamAbilities } from '@/types';

const accountNavItems = (): NavItem[] => [
    {
        title: 'Profile',
        href: edit().url,
        icon: User,
    },
    {
        title: 'Notifications',
        href: notificationsIndex().url,
        icon: Bell,
    },
];

const securityNavItems = (isOwner: boolean): NavItem[] => [
    {
        title: 'Password',
        href: editPassword(),
        icon: Key,
    },
    {
        title: '2FA Authentication',
        href: show(),
        icon: Shield,
    },
    {
        title: 'Passkeys',
        href: passkeysIndex.url(),
        icon: Fingerprint,
    },
    ...(isOwner
        ? [
              {
                  title: 'API Tokens',
                  href: apiTokensIndex.url(),
                  icon: KeyRound,
              },
          ]
        : []),
];

const teamNavItems = (can: TeamAbilities): NavItem[] => {
    const items: NavItem[] = [];

    if (can.settings) {
        items.push({
            title: 'Team',
            href: team().url,
            icon: Building2Icon,
        });
    }

    if (can.members) {
        items.push({
            title: 'Members',
            href: membersIndex().url,
            icon: UsersIcon,
        });
    }

    if (can.providers) {
        items.push({
            title: 'Provider accounts',
            href: providerAccounts().url,
            icon: CloudyIcon,
        });
    }

    if (can.notificationChannels) {
        items.push({
            title: 'Notifications',
            href: providerNotificationChannels().url,
            icon: BellIcon,
        });
    }

    if (can.billing) {
        items.push({
            title: 'Subscription',
            href: subscription().url,
            icon: CreditCardIcon,
        });
    }

    return items;
};

const aiNavItems = (can: TeamAbilities): NavItem[] => {
    const items: NavItem[] = [];

    if (can.settings) {
        items.push({
            title: 'Agents',
            href: agentSettings().url,
            icon: BotIcon,
        });
    }

    if (can.ai) {
        items.push({
            title: 'MCP',
            href: aiSettings().url,
            icon: SparklesIcon,
        });
    }

    return items;
};

const section = (title: string, items: NavItem[]): NavItem | null =>
    items[0]?.href ? { title, href: items[0].href, items } : null;

/**
 * The settings sections, shaped like a main-nav item's sections: each links to its first
 * page and owns its pages as children, so the section strip lights it on any of them and
 * the subject sidebar lists them.
 */
export const settingsSections = (
    isOwner: boolean,
    can?: TeamAbilities,
): NavItem[] =>
    [
        section('Account', accountNavItems()),
        section('Security', securityNavItems(isOwner)),
        section('Team', can ? teamNavItems(can) : []),
        section('AI', can ? aiNavItems(can) : []),
    ].filter((item): item is NavItem => item !== null);
