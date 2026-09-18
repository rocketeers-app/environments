export default function RealtimeRegisterIcon({
    isDark,
    className,
    ...props
}: { isDark?: boolean } & React.SVGProps<SVGSVGElement>) {
    const bodyFill = !isDark ? '#0b1b33' : '#ffffff';
    const accentFill = '#ff6a3d';

    return (
        <svg
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={className}
        >
            <path
                d="M24 6c9.94 0 18 8.06 18 18s-8.06 18-18 18S6 33.94 6 24h5.4c0 6.96 5.64 12.6 12.6 12.6S36.6 30.96 36.6 24 30.96 11.4 24 11.4c-3.6 0-6.85 1.51-9.15 3.93l4.35 4.27H7.2V7.2l3.85 3.78A17.94 17.94 0 0 1 24 6z"
                fill={bodyFill}
            />
            <path
                d="M24 15.6a2.7 2.7 0 0 1 2.7 2.7v5.58l4.06 2.35a2.7 2.7 0 1 1-2.7 4.68l-5.41-3.13a2.7 2.7 0 0 1-1.35-2.34V18.3a2.7 2.7 0 0 1 2.7-2.7z"
                fill={accentFill}
            />
        </svg>
    );
}
