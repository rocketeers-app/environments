export default function LaravelHorizonIcon({
    className,
    ...props
}: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            fill="none"
            {...props}
        >
            <path
                fill="currentColor"
                fillRule="nonzero"
                d="M8.4 42.26A23.95 23.95 0 0 1 0 24c0-6.63 2.69-12.63 7.03-16.97 9.2-9.197 24.051-9.39 33.488-.437 9.436 8.954 10.022 23.795 1.32 33.464-8.702 9.67-23.523 10.646-33.418 2.203H8.4ZM6.47 25.48C9.12 23.13 11 20 16 20c8 0 8 8 16 8 5 0 6.88-3.13 9.54-5.48-.817-9.687-9.333-16.877-19.02-16.06-9.687.817-16.877 9.333-16.06 19.02h.01Z"
            />
        </svg>
    );
}
