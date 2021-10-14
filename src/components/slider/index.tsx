import React, { CSSProperties } from 'react';
import { Carousel } from 'antd';

export interface Banner {
    imgUrl: string;
}

export interface SliderProps {
    // bannerList: Banner[];
    style?: CSSProperties
}

const Slider: React.FC<SliderProps> = (props) => {
    const { style } = props;
    return (
        <div className='slider-wrapper'>
            <Carousel autoplay>
                {
                    [1, 2, 3].map((val, index) => {
                        return (
                            <div className='slider-item' key={index} style={style}>
                                <img
                                    src='https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/406351d47d8c47f1b0bf2bb36425af9c~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp?'
                                    style={{ width: '100%', height: '100%' }}
                                    alt='recommend'
                                />
                            </div>
                        )
                    })
                }                
            </Carousel>
        </div>
    )
}

export default Slider;