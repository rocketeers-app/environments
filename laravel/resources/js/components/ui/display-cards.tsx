import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
    className?: string;
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    date?: string;
    iconClassName?: string;
    titleClassName?: string;
}

function DisplayCard({
    className,
    icon = <Sparkles className="size-4 text-blue-300" />,
    title = "Featured",
    description = "Discover amazing content",
    date = "Just now",
    titleClassName = "text-blue-500",
}: DisplayCardProps) {
    return (
        <div
            className={cn(
                "relative flex h-32 w-80 shrink-0 -skew-y-[3deg] select-none flex-col justify-between rounded-xl border-2 bg-muted/70 backdrop-blur-sm px-5 py-4 transition-all duration-300 hover:border-primary/50 hover:bg-muted hover:shadow-lg",
                className
            )}
        >
            <div className="flex items-center gap-3">
                <span className="relative inline-flex items-center justify-center size-10 rounded-full bg-primary/10 p-2 shrink-0">
                    {icon}
                </span>
                <div className="flex-1 min-w-0">
                    <p className={cn("text-base font-semibold truncate", titleClassName)}>{title}</p>
                    <p className="text-sm text-muted-foreground truncate">{description}</p>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium">{date}</p>
            </div>
        </div>
    );
}

interface DisplayCardsProps {
    cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
    const defaultCards = [
        {
            icon: <Sparkles className="size-4 text-blue-300" />,
            title: "Featured",
            description: "Discover amazing content",
            date: "Just now",
        },
        {
            icon: <Sparkles className="size-4 text-blue-300" />,
            title: "Popular",
            description: "Trending this week",
            date: "2 days ago",
        },
        {
            icon: <Sparkles className="size-4 text-blue-300" />,
            title: "New",
            description: "Latest updates",
            date: "Today",
        },
    ];

    const displayCards = cards || defaultCards;

    if (displayCards.length === 0) {
        return null;
    }

    // Duplicate cards for seamless infinite scroll
    const duplicatedCards = [...displayCards, ...displayCards];

    // Calculate animation duration based on number of cards
    // Each card takes ~3 seconds to pass, adjust based on desired speed
    const cardWidth = 320; // w-80 = 20rem = 320px
    const gap = 16; // gap-4 = 1rem = 16px
    const totalWidth = (cardWidth + gap) * displayCards.length;
    const animationDuration = displayCards.length * 3; // 3 seconds per card

    return (
        <div className="w-full overflow-hidden">
            <style>{`
                @keyframes slide {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-${totalWidth}px);
                    }
                }
                .infinite-slide {
                    animation: slide ${animationDuration}s linear infinite;
                }
                .infinite-slide:hover {
                    animation-play-state: paused;
                }
            `}</style>
            <div
                className="flex gap-4 infinite-slide"
                style={{
                    width: `${totalWidth * 2}px`,
                }}
            >
                {duplicatedCards.map((cardProps, index) => (
                    <DisplayCard key={index} {...cardProps} />
                ))}
            </div>
        </div>
    );
}
