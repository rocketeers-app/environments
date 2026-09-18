export default function RemixIcon({
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
                fill={isDark ? '#ffffff' : '#121212'}
            />
            <text
                x="32"
                y="43"
                textAnchor="middle"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="800"
                fontSize="30"
                fill={isDark ? '#121212' : '#ffffff'}
            >
                R
            </text>
        </svg>
    );
}
