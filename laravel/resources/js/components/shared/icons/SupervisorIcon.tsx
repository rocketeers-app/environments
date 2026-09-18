const GREY = '#4a4a4a';

const ARMS = [
    'M17 35C8 36 3 42 5 49c1 3 5 3.5 6 .5',
    'M47 35c9 1 14 7 12 14c-1 3-5 3.5-6 .5',
    'M21 44c-6 4-9 10-6 15c1.5 2.5 5 2.5 6 0',
    'M43 44c6 4 9 10 6 15c-1.5 2.5-5 2.5-6 0',
    'M28 46c-4 5-5 10-3 14c1.5 2.5 5 2 5-1',
    'M36 46c4 5 5 10 3 14c-1.5 2.5-5 2-5-1',
];

/** Supervisor's octopus mascot, redrawn as a vector because the project only ships it as a 32px bitmap. */
export default function SupervisorIcon({
    className,
    ...props
}: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            {...props}
            className={className}
        >
            <g fill={GREY}>
                <circle cx="32" cy="17" r="14" />
                <path d="M23 24h18v10H23z" />
                <ellipse cx="32" cy="37" rx="16" ry="9" />
            </g>
            <g fill="#fff">
                <circle cx="26" cy="37" r="4" />
                <circle cx="38" cy="37" r="4" />
            </g>
            <g fill={GREY}>
                <circle cx="27" cy="37.6" r="1.9" />
                <circle cx="39" cy="37.6" r="1.9" />
            </g>
            <g
                fill="none"
                stroke={GREY}
                strokeWidth="4.4"
                strokeLinecap="round"
            >
                {ARMS.map((d) => (
                    <path key={d} d={d} />
                ))}
            </g>
        </svg>
    );
}
