// The three triangles of the origami bird, kept as separate subpaths: the source data is
// relative, so concatenating them would offset every one after the first.
const TINYBIRD_PATHS = [
    'm7.948 32 14.415-9.413-8.808-3.33z',
    'm0 14.112 22.363 8.474 3.775-17.6z',
    'M32 2.93 22.077 0l-3.345 7.566z',
];

export default function TinybirdIcon({
    isDark,
    className,
    ...props
}: { isDark?: boolean } & React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="none"
            {...props}
            className={className}
        >
            {TINYBIRD_PATHS.map((path) => (
                <path key={path} fill={isDark ? '#fff' : '#000'} d={path} />
            ))}
        </svg>
    );
}
