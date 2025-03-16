'use client';

export default function BluredEval() {
    return (
        <svg
            width={'100%'}
            height={'100%'}
            viewBox="0 0 1440 836"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
        >
            <g filter="url(#filter0_f_74_857)">
                <ellipse
                    cx={720}
                    cy={38}
                    rx={743}
                    ry={598}
                    fill="url(#paint0_linear_74_857)"
                    fillOpacity="0.2"
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_74_857"
                    x={-223}
                    y={-760}
                    width={1886}
                    height={1596}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur stdDeviation={100} result="effect1_foregroundBlur_74_857" />
                </filter>
                <linearGradient
                    id="paint0_linear_74_857"
                    x1="231.027"
                    y1="-377.661"
                    x2="203.721"
                    y2="833.009"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FFCDE0" />
                    <stop offset="0.215" stopColor="#F8D3D5" />
                    <stop offset="0.415" stopColor="#FFC8F8" />
                    <stop offset={1} stopColor="#F8D3D5" />
                </linearGradient>
            </defs>
        </svg>
    );
}
