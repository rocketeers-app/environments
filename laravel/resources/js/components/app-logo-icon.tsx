import { cn } from '@/lib/utils';

export default function AppLogoIcon({ className }: { className?: string }) {
    return (
        <svg
            className={cn('text-emerald-400', className)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Rocketeers"
            role="img"
        >
            <path transform="rotate(45 12 12)" d="M12 3 19 19 12 15 5 19Z" />
        </svg>
    );
}
