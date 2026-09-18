import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import type { SharedData } from '@/types';

/** The signed-in user's avatar and menu, at the right end of the app navbar. */
export function UserMenu() {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    if (!auth?.user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open user menu"
                    data-test="user-menu-button"
                    className="rounded-full p-0 data-[state=open]:bg-accent"
                >
                    <Avatar className="size-8 overflow-hidden rounded-full">
                        <AvatarImage
                            src={auth.user.gravatar as string}
                            alt={auth.user.name}
                        />
                        <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56 rounded-lg" align="end">
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
