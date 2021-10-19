import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import Slider from '../../components/Slider';
import Scroll from '../../components/Scroll';
import Icon from '../../components/Icon';
import RecommendList from '../../components/RecommendList';
import { RecommendTypes, actionCreators } from './store';
import { connect } from 'react-redux';
import { forceCheck } from 'react-lazyload';

export type RecommendProps = IStateProps & IDispatchProps;

const Recommend: React.FC<RecommendProps> = (props) => {
    const {
        bannerList,
        enterLoading,
        recommendList,
        getBannerListDispatch,
        getRecommendListDispatch
    } = props;

    useEffect(() => {
        if (!bannerList.length)
            getBannerListDispatch();
        if (!recommendList.length)
            getRecommendListDispatch();
    }, [])

    const renderRecommend = () => {
        return (
            <Scroll
                onPullDown={() => { console.log('pulling down') }}
                onPullUp={() => { console.log('pulling up') }}
                onScroll={() => { forceCheck() }}
            >
                <div>
                    <Slider bannerList={bannerList}></Slider>
                    <RecommendList recommendList={recommendList} />
                </div>
            </Scroll>
        )
    }

    return (
        <div className='recommend-wrapper'>
            {enterLoading ? <Icon icon='spinner' spin size='4x' /> : renderRecommend()}
        </div>
    )
}

interface IStateProps {
    bannerList: RecommendTypes.BannerItem[];
    recommendList: RecommendTypes.RecommendItem[];
    enterLoading: boolean;
}

interface IDispatchProps {
    getBannerListDispatch: () => void;
    getRecommendListDispatch: () => void;
}

const mapStateToProps = (state: any): IStateProps => {
    return {
        bannerList: state.recommend.bannerList,
        recommendList: state.recommend.recommendList,
        enterLoading: state.recommend.enterLoading
    }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
    return {
        getBannerListDispatch() {
            const action = actionCreators.getBannerList();
            dispatch(action);
        },

        getRecommendListDispatch() {
            const action = actionCreators.getRecommendList();
            dispatch(action);
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Recommend));