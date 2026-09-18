export default function PlanetScale({
    isDark,
    className,
    ...props
}: { isDark?: boolean } & React.SVGProps<SVGSVGElement>) {
    const fillColor = isDark ? '#fff' : '#000';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            fill="none"
            {...props}
            className={className}
        >
            <path
                fill={fillColor}
                d="M0 20C0 8.954 8.954 0 20 0c8.121 0 15.112 4.84 18.245 11.794l-26.45 26.45a20 20 0 0 1-3.225-1.83L24.984 20H20L5.858 34.142A19.94 19.94 0 0 1 0 20M39.999 20.007 20.006 40c11.04-.004 19.99-8.953 19.993-19.993"
            />
        </svg>
    );
}
