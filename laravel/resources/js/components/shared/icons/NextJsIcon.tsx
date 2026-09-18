export default function NextJsIcon({
    isDark,
    className,
    ...props
}: { isDark?: boolean } & React.SVGProps<SVGSVGElement>) {
    if (isDark) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                viewBox="0 0 180 180"
                {...props}
                className={className}
            >
                <circle cx="90" cy="90" r="90" fill="#e0e0e0" />
                <linearGradient
                    id="nextjs-light-a"
                    x1="93.23"
                    x2="128.73"
                    y1="52.776"
                    y2="8.776"
                    gradientTransform="matrix(1 0 0 -1 0 182)"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
                <path
                    d="M149.5 157.5 69.1 54H54v72h12.1V69.4l73.9 95.5c3.3-2.3 6.5-4.7 9.5-7.4"
                    style={{ fill: 'url(#nextjs-light-a)' }}
                />
                <path fill="#000" d="M115 54h12v72h-12z" />
            </svg>
        );
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            viewBox="0 0 180 180"
            {...props}
            className={className}
        >
            <circle cx="90" cy="90" r="90" />
            <linearGradient
                id="nextjs-a"
                x1="93.23"
                x2="128.73"
                y1="52.776"
                y2="8.776"
                gradientTransform="matrix(1 0 0 -1 0 182)"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="0" stopColor="#fff" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <path
                d="M149.5 157.5 69.1 54H54v72h12.1V69.4l73.9 95.5c3.3-2.3 6.5-4.7 9.5-7.4"
                style={{ fill: 'url(#nextjs-a)' }}
            />
            <linearGradient
                id="nextjs-b"
                x1="121.14"
                x2="120.94"
                y1="128.02"
                y2="75.147"
                gradientTransform="matrix(1 0 0 -1 0 182)"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="0" stopColor="#fff" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <path fill="url(#nextjs-b)" d="M115 54h12v72h-12z" />
        </svg>
    );
}
