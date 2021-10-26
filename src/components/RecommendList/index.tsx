import React from 'react';
import { RecommendTypes } from '../../application/Recommend/store';
import LazyLoad from 'react-lazyload';
import { getCount } from '../../api/utils';
import { RouteComponentProps, withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface RecommendListPorps extends RouteComponentProps {
    recommendList?: RecommendTypes.RecommendItem[];
}

const RecommendList: React.FC<RecommendListPorps> = (props) => {
    const { recommendList } = props;

    const enterDetail = (id: number) => {
        props.history.push(`/recommend/${id}`)
    }

    return (
        <div className='recommend-list-wrapper'>
            <h1 className='recommend-list-title'>
                recommend list
            </h1>
            <div className='recommend-list-content'>
                {
                    (recommendList || []).map((recommendItem, index) => {
                        return (
                            <div
                                className='recommend-item-wrapper'
                                key={index}
                                onClick={() => { enterDetail(recommendItem.id) }}
                            >
                                <div className='recommend-item-img-wrapper'>
                                    <LazyLoad placeholder={<FontAwesomeIcon icon='spinner' spin />}>
                                        <img
                                            className='recommend-item-img'
                                            src={recommendItem.picUrl}
                                            alt='img'
                                        ></img>
                                    </LazyLoad>
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

export default withRouter(RecommendList);