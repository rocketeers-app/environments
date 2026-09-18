export default function FlaskIcon({
    className,
    isDark,
    ...props
}: React.SVGProps<SVGSVGElement> & { isDark?: boolean }) {
    return (
        <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={className}
        >
            <rect
                width="64"
                height="64"
                rx="12"
                fill={isDark ? '#f5f5f5' : '#3c3c3c'}
            />
            <path
                d="M26 12h12v3h-2v12l12 20a4 4 0 0 1-3.4 6H19.4A4 4 0 0 1 16 47l12-20V15h-2v-3Z"
                fill={isDark ? '#3c3c3c' : '#ffffff'}
            />
        </svg>
    );
}
