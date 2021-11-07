import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import Slider from '../../components/Slider';
import Scroll from '../../components/Scroll';
import Loading from '../../components/Loading';
import RecommendList from '../../components/RecommendList';
import { RecommendTypes, actionCreators } from './store';
import { connect } from 'react-redux';
import { forceCheck } from 'react-lazyload';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';

export type RecommendProps = IStateProps & IDispatchProps & RouteConfigComponentProps

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
        console.log(renderRoutes(props.route?.routes))
    }, [])


    const renderRecommend = () => {
        return (
            <Scroll onScroll={() => { forceCheck() }}>
                <div>
                    <Slider bannerList={bannerList}></Slider>
                    <RecommendList recommendList={recommendList} />
                </div>
            </Scroll>
        )
    }

    return (
        <div className='recommend-wrapper'>
            {enterLoading ? <Loading style={{ height: '100%' }} /> : renderRecommend()}
            {renderRoutes(props.route?.routes)}
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