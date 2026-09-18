export default function LeasewebIcon({
    isDark: _isDark,
    className,
    ...props
}: { isDark?: boolean } & React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            {...props}
            className={className}
        >
            <rect width="24" height="24" fill="#0a2540" />
            <rect
                x="5.5"
                y="6"
                width="13"
                height="3.4"
                rx="1.2"
                fill="#ffffff"
            />
            <rect
                x="5.5"
                y="10.3"
                width="13"
                height="3.4"
                rx="1.2"
                fill="#ffffff"
            />
            <rect
                x="5.5"
                y="14.6"
                width="13"
                height="3.4"
                rx="1.2"
                fill="#ff5c35"
            />
            <circle cx="8" cy="7.7" r="0.9" fill="#0a2540" />
            <circle cx="8" cy="12" r="0.9" fill="#0a2540" />
            <circle cx="8" cy="16.3" r="0.9" fill="#0a2540" />
        </svg>
    );
}
