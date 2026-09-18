export default function PostHogIcon({
    className,
    ...props
}: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="M0 27.6v6.3c0 1.16.94 2.1 2.1 2.1h6.3L0 27.6Zm0-2.1L10.5 36h8.4L0 17.1v8.4Zm0-10.5L21 36h8.4L0 6.6V15Z"
                fill="#1D4AFF"
            />
            <path
                d="M10.5 25.5V17.1L29.4 36h-8.4l-10.5-10.5Zm0-10.5V6.6L36 32.1v1.8c0 1.16-.94 2.1-2.1 2.1h-2.4L10.5 15Z"
                fill="#F9BD2B"
            />
            <path
                d="M21 15V6.6L36 21.6v8.4L21 15Zm0 12.6v-8.4l9 9v2.1c0 1.16-.94 2.1-2.1 2.1h-2.4l-4.5-4.8Z"
                fill="#F54E00"
            />
        </svg>
    );
}
