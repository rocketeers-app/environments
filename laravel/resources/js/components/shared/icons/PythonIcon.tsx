export default function PythonIcon({
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
            <rect width="64" height="64" rx="12" fill="#3776ab" />
            <text
                x="32"
                y="43"
                textAnchor="middle"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="700"
                fontSize="28"
                fill="#ffd43b"
            >
                Py
            </text>
        </svg>
    );
}
