export default function SpaceshipIcon({
    isDark,
    className,
    ...props
}: { isDark?: boolean } & React.SVGProps<SVGSVGElement>) {
    const bodyFill = !isDark ? '#0b0b13' : '#ffffff';
    const accentFill = '#6c5ce7';

    return (
        <svg
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={className}
        >
            <path
                d="M24 3c5.6 5.2 8.8 12.2 8.8 20.1 0 2.6-.35 5.1-1 7.5h-15.6c-.65-2.4-1-4.9-1-7.5C15.2 15.2 18.4 8.2 24 3z"
                fill={bodyFill}
            />
            <circle cx="24" cy="19" r="4.2" fill={accentFill} />
            <path
                d="M15.6 24.6 8.6 32.4c-.6.7-.9 1.5-.9 2.4v5.4l7.3-4.9c-.4-3.4-.5-6.9.6-10.7z"
                fill={accentFill}
            />
            <path
                d="M32.4 24.6l7 7.8c.6.7.9 1.5.9 2.4v5.4l-7.3-4.9c.4-3.4.5-6.9-.6-10.7z"
                fill={accentFill}
            />
            <path
                d="M20.4 33.6h7.2l-3.6 9.4-3.6-9.4z"
                fill={accentFill}
                opacity={0.7}
            />
        </svg>
    );
}
