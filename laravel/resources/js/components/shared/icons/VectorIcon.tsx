const VECTOR_PATH =
    'M100.325 37h14.877l-35.43 58.46-7.35-12.097zM51.243 95.153L86.486 37h-17.58L51.603 65.43 34.292 37H16z';

export default function VectorIcon({
    className,
    ...props
}: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="10 10 112 112"
            {...props}
            className={className}
        >
            <path fill="#10E7FF" fillRule="evenodd" d={VECTOR_PATH} />
        </svg>
    );
}
