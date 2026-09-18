export default function MijnHostIcon({
    isDark,
    className,
    ...props
}: { isDark?: boolean } & React.SVGProps<SVGSVGElement>) {
    const bodyFill = !isDark ? '#12203a' : '#ffffff';
    const accentFill = '#1f9cf0';

    return (
        <svg
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={className}
        >
            <path
                d="M24 4.8 43.2 20.4h-5.7v18a2.4 2.4 0 0 1-2.4 2.4H12.9a2.4 2.4 0 0 1-2.4-2.4v-18H4.8L24 4.8z"
                fill={bodyFill}
            />
            <path
                d="M17.4 24h3.9v11.4h-3.9V24zm9.3 0h3.9v11.4h-3.9V24z"
                fill={accentFill}
            />
            <path d="M17.4 27.9h13.2v3.6H17.4v-3.6z" fill={accentFill} />
        </svg>
    );
}
