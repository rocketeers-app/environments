export default function RubyIcon({
    className,
    ...props
}: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={className}
        >
            <rect width="64" height="64" rx="12" fill="#cc342d" />
            <path
                d="M32 12l14 10-14 30-14-30z"
                fill="#ffffff"
                fillOpacity="0.92"
            />
            <path d="M18 22h28l-14 30z" fill="#a1231d" fillOpacity="0.35" />
        </svg>
    );
}
