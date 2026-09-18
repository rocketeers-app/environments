export default function FastApiIcon({
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
            <rect width="64" height="64" rx="12" fill="#009688" />
            <path d="M36 10 18 36h12l-4 18 20-28H34l2-16Z" fill="#ffffff" />
        </svg>
    );
}
