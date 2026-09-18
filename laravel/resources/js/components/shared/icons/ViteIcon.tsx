export default function ViteIcon({
    className,
    ...props
}: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 256 257"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={className}
        >
            <defs>
                <linearGradient
                    id="vite-icon-a"
                    x1="-.8%"
                    x2="57.6%"
                    y1="7.7%"
                    y2="78.4%"
                >
                    <stop offset="0%" stopColor="#41d1ff" />
                    <stop offset="100%" stopColor="#bd34fe" />
                </linearGradient>
                <linearGradient
                    id="vite-icon-b"
                    x1="43.4%"
                    x2="50.3%"
                    y1="2.2%"
                    y2="89%"
                >
                    <stop offset="0%" stopColor="#ffea83" />
                    <stop offset="8.3%" stopColor="#ffdd35" />
                    <stop offset="100%" stopColor="#ffa800" />
                </linearGradient>
            </defs>
            <path
                fill="url(#vite-icon-a)"
                d="M255.2 37.9 134.9 253c-2.5 4.4-8.9 4.5-11.4 0L.8 37.9c-2.8-4.9 1.4-10.8 6.9-9.8l120.4 21.5c.8.1 1.6.1 2.3 0L248.3 28c5.5-1 9.7 4.9 6.9 9.9Z"
            />
            <path
                fill="url(#vite-icon-b)"
                d="M185.4.1 96.4 17.5a3.3 3.3 0 0 0-2.6 3l-5.5 92.5a3.3 3.3 0 0 0 4 3.4l24.8-5.7c2.4-.6 4.6 1.5 4.1 3.9l-7.4 36.1c-.5 2.5 1.8 4.6 4.3 3.9l15.3-4.7c2.4-.7 4.8 1.4 4.3 3.9l-11.7 56.6c-.7 3.6 4 5.6 6 2.6l1.3-2.1 72.5-144.7c1.3-2.5-.9-5.4-3.7-4.9l-25.5 4.9c-2.5.5-4.7-1.9-4-4.3l16.6-57.7c.7-2.5-1.4-4.8-4-4.3Z"
            />
        </svg>
    );
}
