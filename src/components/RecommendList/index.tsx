import React from 'react';
import { RecommendTypes } from '../../application/Recommend/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCount } from '../../api/utils';

export interface RecommendListPorps {
    recommendList?: RecommendTypes.RecommendItem[];
}

const RecommendList: React.FC<RecommendListPorps> = (props) => {
    const { recommendList } = props;
    
    return (
        <div className='recommend-list-wrapper'>
            <h1 className='recommend-list-title'>
                recommend list
            </h1>
            <div className='recommend-list-content'>
                {
                    (recommendList || []).map((recommendItem, index) => {
                        return (
                            <div className='recommend-item-wrapper' key={index}>
                                <div className='recommend-item-img-wrapper'>
                                    <img
                                        className='recommend-item-img'
                                        src={recommendItem.picUrl}
                                        alt='img'
                                    ></img>
                                    <div className='recommend-item-info'>
                                        <FontAwesomeIcon icon='headphones-alt' />
                                        <span className='recommend-item-count'>
                                            {getCount(recommendItem.playCount)}
                                        </span>
                                    </div>
                                </div>
                                <div className='recommend-item-desc'>
                                    {recommendItem.name}
                                </div>
                            </div>
                        )
                        
                    })
                }
            </div>
        </div>
    )
}

RecommendList.defaultProps = {
    recommendList: []
}

export default RecommendList;