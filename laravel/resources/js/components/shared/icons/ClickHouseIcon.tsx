const CLICKHOUSE_PATH =
    'M27 25.7c0-.6.5-1.2 1.2-1.2H37c.6 0 1.2.5 1.2 1.2v97.7c0 .6-.5 1.2-1.2 1.2h-8.8c-.6 0-1.2-.5-1.2-1.2zm22.2 0c0-.6.5-1.2 1.2-1.2h8.8c.6 0 1.2.5 1.2 1.2v97.7c0 .6-.5 1.2-1.2 1.2h-8.8c-.6 0-1.2-.5-1.2-1.2zm22.2 0c0-.6.5-1.2 1.2-1.2h8.8c.6 0 1.2.5 1.2 1.2v97.7c0 .6-.5 1.2-1.2 1.2h-8.8c-.6 0-1.2-.5-1.2-1.2zm22.2 0c0-.6.5-1.2 1.2-1.2h8.8c.6 0 1.2.5 1.2 1.2v97.7c0 .6-.5 1.2-1.2 1.2h-8.8c-.6 0-1.2-.5-1.2-1.2zm22.3 38.9c0-.6.5-1.2 1.2-1.2h8.8c.6 0 1.2.5 1.2 1.2v19.9c0 .6-.5 1.2-1.2 1.2h-8.8c-.6 0-1.2-.5-1.2-1.2z';

export default function ClickHouseIcon({
    isDark,
    className,
    ...props
}: { isDark?: boolean } & React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 150 150"
            {...props}
            className={className}
        >
            <path fill={isDark ? '#fff' : '#000'} d={CLICKHOUSE_PATH} />
        </svg>
    );
}
