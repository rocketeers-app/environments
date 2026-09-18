import { Check, Monitor } from 'lucide-react';
import {
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { appearanceOptions } from '@/components/user-menu-items';
import { useAppearance } from '@/hooks/use-appearance';

export function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();

    const options = appearanceOptions();
    const CurrentIcon =
        options.find((option) => option.value === appearance)?.icon ?? Monitor;

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <CurrentIcon className="h-4 w-4" />
                Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => updateAppearance(option.value)}
                    >
                        <option.icon className="h-4 w-4" />
                        <span>{option.title}</span>
                        {appearance === option.value && (
                            <Check className="ml-auto h-4 w-4" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
}
