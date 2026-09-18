import { Link, router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { userMenuItems } from '@/components/user-menu-items';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/lib/design-routes';
import type { User } from '@/types';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {userMenuItems().map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                        <Link
                            className="block w-full"
                            href={item.href}
                            as="button"
                            onClick={cleanup}
                        >
                            <item.icon />
                            {item.title}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <ThemeToggle />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
