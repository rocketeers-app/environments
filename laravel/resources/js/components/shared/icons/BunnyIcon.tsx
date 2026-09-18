export default function BunnyIcon({
    isDark: _isDark,
    className,
    ...props
}: { isDark?: boolean } & React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 39 43"
            className={className}
            {...props}
        >
            <linearGradient
                id="bunnyGradient1"
                x1="16.85"
                y1="6.11"
                x2="36.49"
                y2="6.11"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="1e-05" stopColor="#fbaa19" stopOpacity="1" />
                <stop offset="1" stopColor="#ef3e23" stopOpacity="1" />
            </linearGradient>
            <path
                fill="url(#bunnyGradient1)"
                fillRule="evenodd"
                d="M 21 6.849998 L 30.870001 12.209999 L 21.75 0 C 20.275917 1.97823 19.988899 4.59967 21 6.849998 L 21 6.849998 Z"
            />
            <linearGradient
                id="bunnyGradient2"
                x1="15.770003"
                y1="31.080038"
                x2="17.310006"
                y2="26.870001"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="1e-05" stopColor="#f78d1e" stopOpacity="1" />
                <stop offset="1" stopColor="#f37121" stopOpacity="1" />
            </linearGradient>
            <path
                fill="url(#bunnyGradient2)"
                fillRule="evenodd"
                d="M 16.540001 26.73 C 17.780025 26.730049 18.786261 27.733372 18.789911 28.973392 C 18.793543 30.213413 17.793221 31.22263 16.553215 31.23 C 15.31321 31.237293 14.301023 30.239977 14.29 29 C 14.284665 28.399805 14.519361 27.822357 14.941896 27.396065 C 15.364433 26.969772 15.939781 26.73 16.540001 26.73 L 16.540001 26.73 Z"
            />
            <linearGradient
                id="bunnyGradient3"
                x1="8.863363"
                y1="32.53"
                x2="25.519331"
                y2="6.88"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="1e-05" stopColor="#febe2d" stopOpacity="1" />
                <stop offset="1" stopColor="#f04e23" stopOpacity="1" />
            </linearGradient>
            <path
                fill="url(#bunnyGradient3)"
                fillRule="evenodd"
                d="M 9.67 1.790001 L 37.310001 16.790001 C 37.77116 17.014324 38.063847 17.482174 38.063847 17.995001 C 38.063847 18.507826 37.77116 18.975676 37.310001 19.200001 C 35.219551 20.457916 32.930164 21.350676 30.540001 21.84 L 24.790001 33.639999 C 24.790001 33.639999 22.969999 37.779999 17.959999 36.189999 C 20.059999 34.09 22.6 32.189999 22.6 28.959999 C 22.6 25.607632 19.882368 22.889999 16.530001 22.889999 C 13.177631 22.889999 10.46 25.607632 10.46 28.959999 C 10.46 33.18 14.62 34.959999 16.93 37.889999 C 17.970396 39.362736 17.832531 41.363853 16.6 42.68 C 13.73 39.84 8.18 35.049999 5.9 31.91 C 4.653479 30.326906 3.967627 28.374866 3.95 26.360001 C 4.174329 21.967899 7.124481 18.186268 11.33 16.9 C 12.58914 16.533236 13.899708 16.374481 15.21 16.43 C 17.036983 16.568411 18.81168 17.104233 20.41 18 C 22.860001 19.440001 24.049999 19.059999 25.74 17.639999 C 26.74 16.82 27.83 14.15 26.139999 13.529999 C 25.587446 13.349724 25.022661 13.209364 24.450001 13.110001 C 21.309999 12.5 15.82 11.92 13.8 10.77 C 10.59 9 8.43 5.349998 9.67 1.790001 Z"
            />
            <linearGradient
                id="bunnyGradient4"
                x1="17.048177"
                y1="17.54"
                x2="10.138625"
                y2="37.92"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="1e-05" stopColor="#ea4425" stopOpacity="1" />
                <stop offset="1" stopColor="#fdbb27" stopOpacity="1" />
            </linearGradient>
            <path
                fill="url(#bunnyGradient4)"
                fillRule="evenodd"
                d="M 22.549999 28.99 C 23.83 22.26 17 15.84 11.76 16.799999 L 12.11 16.719999 C 11.83 16.780001 11.56 16.85 11.3 16.93 C 7.094481 18.216269 4.144329 21.9979 3.92 26.389999 C 3.951872 28.410763 4.655532 30.363417 5.92 31.940001 C 8.2 35.080002 13.75 39.869999 16.620001 42.709999 C 17.852531 41.393852 17.990395 39.392735 16.950001 37.919998 C 14.59 35 10.43 33.209999 10.43 29 C 10.43 25.647631 13.147632 22.93 16.5 22.93 C 19.852369 22.93 22.57 25.647631 22.57 29 L 22.549999 28.99 Z"
            />
            <linearGradient
                id="bunnyGradient5"
                x1="0.24"
                y1="10.57"
                x2="42.04"
                y2="10.57"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="1e-05" stopColor="#f47920" stopOpacity="1" />
                <stop offset="1" stopColor="#e93825" stopOpacity="1" />
            </linearGradient>
            <path
                fill="url(#bunnyGradient5)"
                fillRule="evenodd"
                d="M 9.67 1.790001 L 30.67 13.23 L 30.67 13.23 L 31.27 13.560001 C 31.77 13.950001 32.27 14.73 31.620001 16.17 C 30.620001 18.32 26.620001 20.4 22.01 18.77 C 23.450001 19.190001 24.43 18.709999 25.690001 17.65 C 26.690001 16.83 27.780001 14.16 26.09 13.540001 C 25.537447 13.359726 24.97266 13.219364 24.4 13.119999 C 21.26 12.51 15.77 11.93 13.75 10.779999 C 10.59 9 8.43 5.349998 9.67 1.790001 Z"
            />
            <linearGradient
                id="bunnyGradient6"
                x1="-21.84"
                y1="7.78"
                x2="63.21"
                y2="7.78"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="1e-05" stopColor="#fdca0b" stopOpacity="1" />
                <stop offset="1" stopColor="#f5841f" stopOpacity="1" />
            </linearGradient>
            <path
                fill="url(#bunnyGradient6)"
                fillRule="evenodd"
                d="M 9.67 1.790001 C 11.84 9.790001 25.049999 10.450001 31.67 13.790001 L 9.67 1.790001 Z"
            />
            <linearGradient
                id="bunnyGradient7"
                x1="11.216557"
                y1="18.07"
                x2="13.789407"
                y2="48.94"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="1e-05" stopColor="#e73c25" stopOpacity="1" />
                <stop offset="1" stopColor="#faa21b" stopOpacity="1" />
            </linearGradient>
            <path
                fill="url(#bunnyGradient7)"
                fillRule="evenodd"
                d="M 16.9 37.919998 C 14.59 35 10.43 33.209999 10.43 29 C 10.441818 25.946602 12.719974 23.377253 15.75 23 C 10.924343 23.01646 7.01646 26.924343 6.999985 31.75 C 6.998906 32.341316 7.05923 32.931149 7.18 33.509998 C 9.09 35.669998 11.85 38.220001 14.18 40.380001 C 15.09 41.23 15.93 42.029999 16.620001 42.709999 C 17.194168 42.044754 17.544077 41.215477 17.620001 40.34 L 17.620001 40.34 C 17.674643 39.473469 17.419449 38.61573 16.9 37.919998 L 16.9 37.919998 Z"
            />
            <linearGradient
                id="bunnyGradient8"
                x1="-51.37"
                y1="23.08"
                x2="74.88"
                y2="23.08"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="1e-05" stopColor="#fdba12" stopOpacity="1" />
                <stop offset="1" stopColor="#f7921e" stopOpacity="1" />
            </linearGradient>
            <path
                fill="url(#bunnyGradient8)"
                fillRule="evenodd"
                d="M 22.52 29.709999 C 22.551571 29.471268 22.56827 29.230804 22.57 28.99 C 23.83 22.26 17 15.84 11.76 16.799999 C 12.878886 16.529612 14.029779 16.415195 15.18 16.459999 C 22.049999 16.74 23.969999 24.08 22.52 29.709999 Z"
            />
            <linearGradient
                id="bunnyGradient9"
                x1="0.089614"
                y1="16.72"
                x2="4.798754"
                y2="17.56"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="1e-05" stopColor="#febe2d" stopOpacity="1" />
                <stop offset="1" stopColor="#f04e23" stopOpacity="1" />
            </linearGradient>
            <path
                fill="url(#bunnyGradient9)"
                fillRule="evenodd"
                d="M 2.26 14.84 L 2.26 14.84 C 3.509779 14.845505 4.52 15.860209 4.52 17.110001 L 4.52 19.370001 L 2.26 19.370001 C 1.011837 19.370001 0 18.358164 0 17.110001 L 0 17.110001 C 0 15.860209 1.010221 14.845505 2.26 14.84 L 2.26 14.84 Z"
            />
        </svg>
    );
}
