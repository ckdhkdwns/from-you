"use client";

import React, { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc?: string;
}

const ImageWithFallback = (props: ImageWithFallbackProps) => {
    const { src, fallbackSrc, ...rest } = props;
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    if (!src) return null;
    return (
        <Image
            {...rest}
            src={imgSrc}
            draggable={false}
            onError={() => {
                setImgSrc(fallbackSrc || "/fallback.png");
            }}
        />
    );
};

export default ImageWithFallback;
