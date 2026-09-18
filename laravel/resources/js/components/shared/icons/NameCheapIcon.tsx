export default function NameCheapIcon({
    isDark,
    className,
    ...props
}: { isDark?: boolean } & React.SVGProps<SVGSVGElement>) {
    const primaryFill = '#ff5100';
    const secondaryFill = '#ffa366';
    const gradientId = 'namecheap-gradient-light';

    return (
        <svg
            viewBox="-0.02 0 84.05 46.59"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={className}
        >
            <defs>
                <linearGradient
                    id={gradientId}
                    x1="59.990002"
                    y1="44.16"
                    x2="80.010002"
                    y2="1.23"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop
                        offset="0"
                        stopColor={!isDark ? '#d4202c' : '#e85a5a'}
                    />
                    <stop
                        offset="0.1"
                        stopColor={!isDark ? '#dc3d29' : '#e66d5a'}
                        stopOpacity="0.79"
                    />
                    <stop
                        offset="0.2"
                        stopColor={!isDark ? '#e45926' : '#e97f5a'}
                        stopOpacity="0.58"
                    />
                    <stop
                        offset="0.32"
                        stopColor={!isDark ? '#ea7123' : '#ec915a'}
                        stopOpacity="0.4"
                    />
                    <stop
                        offset="0.43"
                        stopColor={!isDark ? '#f08521' : '#efa35a'}
                        stopOpacity="0.25"
                    />
                    <stop
                        offset="0.55"
                        stopColor={!isDark ? '#f4941f' : '#f1b15a'}
                        stopOpacity="0.14"
                    />
                    <stop
                        offset="0.68"
                        stopColor={!isDark ? '#f79f1e' : '#f3bc5a'}
                        stopOpacity="0.06"
                    />
                    <stop
                        offset="0.82"
                        stopColor={!isDark ? '#f8a51d' : '#f4c25a'}
                        stopOpacity="0.02"
                    />
                    <stop
                        offset="1"
                        stopColor={!isDark ? '#f9a71d' : '#f5c85a'}
                        stopOpacity="0"
                    />
                </linearGradient>
                <linearGradient
                    id={`${gradientId}-reverse`}
                    x1="1777.48"
                    y1="1048.76"
                    x2="1797.5"
                    y2="1005.83"
                    gradientTransform="rotate(180,901.25,525.945)"
                    xlinkHref={`#${gradientId}`}
                />
            </defs>
            <title>cn-logo</title>
            <path
                d="M 76.17,0 A 7.87,7.87 0 0 0 69.29,4.05 L 69.13,4.38 63,16.54 l -7.8,15.37 5.11,10.07 0.28,0.55 A 8,8 0 0 0 64,45.76 8.05,8.05 0 0 0 67.41,42.53 L 67.69,41.98 83,11.77 83.37,11.04 a 7.86,7.86 0 0 0 -7.19,-11 z"
                fill={primaryFill}
            />
            <path
                d="m 28.85,14.63 -5.1,-10 -0.28,-0.55 a 7.89,7.89 0 0 0 -3.4,-3.22 7.92,7.92 0 0 0 -3.4,3.21 L 16.38,4.63 1.05,34.81 0.68,35.53 a 7.86,7.86 0 0 0 14.06,7 l 0.17,-0.32 6.17,-12.16 7.79,-15.36 z"
                fill={primaryFill}
            />
            <path
                d="m 76.15,0 a 7.86,7.86 0 0 0 -6.87,4.05 l -0.17,0.33 -6.17,12.16 -7.81,15.37 5.12,10.07 0.28,0.55 a 7.94,7.94 0 0 0 3.41,3.23 7.94,7.94 0 0 0 3.41,-3.23 L 67.64,41.98 83,11.77 83.36,11.04 a 7.86,7.86 0 0 0 -7.19,-11 z"
                fill={`url(#${gradientId})`}
            />
            <path
                d="m 7.86,46.58 a 7.86,7.86 0 0 0 6.87,-4 L 14.9,42.25 21.08,30.09 28.88,14.72 23.77,4.6 23.49,4.05 A 8,8 0 0 0 20.07,0.82 8,8 0 0 0 16.66,4.05 L 16.38,4.6 1,34.81 0.63,35.54 a 7.86,7.86 0 0 0 7.19,11 z"
                fill={`url(#${gradientId}-reverse)`}
            />
            <path
                d="m 28.85,14.63 -5.1,-10 -0.28,-0.55 a 7.94,7.94 0 0 0 -3.41,-3.23 8.31,8.31 0 0 1 1.49,-0.56 8.16,8.16 0 0 1 2,-0.25 h 10.68 a 7.92,7.92 0 0 1 6.86,4 l 0.28,0.55 13.81,27.36 5.09,10 0.28,0.55 A 8,8 0 0 0 64,45.76 8.05,8.05 0 0 1 60.53,46.57 H 49.79 a 7.91,7.91 0 0 1 -6.85,-4 l -0.29,-0.55 z"
                fill={secondaryFill}
            />
        </svg>
    );
}
