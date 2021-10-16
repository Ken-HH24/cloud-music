import React, { CSSProperties } from 'react';
import { RecommendTypes } from '../../application/Recommend/store';
import { Carousel } from 'antd';

export interface SliderProps {
    bannerList?: RecommendTypes.BannerItem[];
    style?: CSSProperties
}

const Slider: React.FC<SliderProps> = (props) => {
    const { bannerList, style } = props;
    return (
        <div className='slider-wrapper'>
            <Carousel autoplay>
                {
                    (bannerList || []).map((banner, index) => {
                        return (
                            <div className='slider-item' key={index} style={style}>
                                <img
                                    src={banner.imageUrl}
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