export default function VultrIcon({
    className,
    ...props
}: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            preserveAspectRatio="xMidYMid"
            {...props}
            className={className}
        >
            <path
                fill="#007BFC"
                d="M21.07 50.34a10.49 10.49 0 0 0-8.99 5.16 10.55 10.55 0 0 0-.06 10.46l59.7 104.7a10.5 10.5 0 0 0 9.05 5.28h35.84a10.5 10.5 0 0 0 9.05-5.27 10.56 10.56 0 0 0 0-10.47L75.95 55.6a10.5 10.5 0 0 0-9.05-5.27H21.07z"
            />
            <path
                fill="#51B9FF"
                d="M132.92 50.34a10.49 10.49 0 0 0-8.99 5.16 10.55 10.55 0 0 0-.06 10.46l29.85 52.35a10.5 10.5 0 0 0 9.05 5.27 10.5 10.5 0 0 0 9.05-5.27l29.85-52.35a10.55 10.55 0 0 0-.06-10.46 10.49 10.49 0 0 0-8.99-5.16h-58.6z"
            />
        </svg>
    );
}
