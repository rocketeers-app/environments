export function CountryFlag({
    code,
    className,
    title,
}: {
    code: string;
    className?: string;
    title?: string;
}) {
    return (
        <img
            src={`/vendor/flags/${code.toUpperCase()}.svg`}
            alt={code}
            title={title}
            width={20}
            height={14}
            loading="lazy"
            className={
                className ?? 'h-3.5 w-5 shrink-0 rounded-sm object-cover'
            }
        />
    );
}
