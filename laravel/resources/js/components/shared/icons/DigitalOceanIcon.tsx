export default function DigitalOceanIcon({
    isDark: _isDark,
    className,
    ...props
}: { isDark?: boolean } & React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            id="Layer_1"
            x="0"
            y="0"
            version="1.1"
            viewBox="0 0 354 354"
            {...props}
            className={className}
        >
            <g id="XMLID_690_">
                <g id="XMLID_691_">
                    <g id="XMLID_44_">
                        <g id="XMLID_48_">
                            <path
                                id="XMLID_49_"
                                d="M177 354v-68.6c72.7 0 129.1-72.1 101.2-148.5-10.2-28.1-32.9-50.8-61.2-61C140.5 48.1 68.4 104.3 68.4 177H0C0 61.2 112-29.2 233.4 8.8c53 16.7 95.3 58.8 111.8 111.8C383.2 242 292.8 354 177 354"
                                style={{ fill: '#0080ff' }}
                            />
                            <path
                                id="XMLID_47_"
                                d="M177.2 285.8h-68.4v-68.5h68.4z"
                                style={{
                                    fillRule: 'evenodd',
                                    clipRule: 'evenodd',
                                    fill: '#0080ff',
                                }}
                            />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
}
