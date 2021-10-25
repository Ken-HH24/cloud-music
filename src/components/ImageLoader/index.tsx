import React, { CSSProperties, ImgHTMLAttributes, useRef, useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import Icon from '../Icon';
import Loading from '../Loading';

export interface ImageLoaderProps extends ImgHTMLAttributes<HTMLImageElement> {
    className?: string
    style?: CSSProperties
}

const ImageLoader: React.FC<ImageLoaderProps> = (props) => {
    const { className, style, ...restProps } = props;
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useIntersectionObserver(imgRef, {
        onIntersect: (entries, observerElement) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observerElement.unobserve(imgRef.current!);
            }
        }
    })

    return (
        <div ref={imgRef}>
            {
                isVisible && <img
                    alt='img'
                    className={className}
                    onLoad={() => { setIsLoaded(true) }}
                    style={{
                        ...style,
                        display: `${isLoaded ? '' : 'none'}`
                    }}
                    {...restProps}
                />
            }
            {
                (isVisible && !isLoaded) &&
                // <Icon
                //     icon='spinner'
                //     className={className}
                //     style={{
                //         boxShadow: 'none',
                //         border: 'none',
                //         ...style
                //     }}
                //     spin
                //     size='1x'
                // />
                <Loading className={className} />
            }
        </div>
    )
}

export default ImageLoader;