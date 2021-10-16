import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import Slider from '../../components/slider';
import Scroll from '../../components/Scroll';
import RecommendList from '../../components/RecommendList';
import { RecommendTypes, actionCreators } from './store';
import { connect } from 'react-redux';

// const items = [
//     {
//         imgUrl: 'https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3299f4346c04040a60b435a64098854~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp?',
//         desc: 'test test test asdfawheahaehaeh',
//         count: 678
//     },
//     {
//         imgUrl: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17c622fc1e4b4a39949363ec8bf9d3fc~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp',
//         desc: 'test test test asdfawheahaehaeh',
//         count: 12000
//     }
// ]

// const recommendList = [
//     {
//         imgUrl: 'https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3299f4346c04040a60b435a64098854~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp?',
//         desc: 'test test test asdfawheahaehaeh',
//         count: 678
//     },
//     {
//         imgUrl: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17c622fc1e4b4a39949363ec8bf9d3fc~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp',
//         desc: 'test test test asdfawheahaehaeh',
//         count: 12000
//     }
// ];
// for (let i = 0; i < 10; i++){
//     recommendList.push(...items);
// }

export interface IRecommendProps {
    bannerList?: RecommendTypes.BannerItem[];
    recommendList?: RecommendTypes.RecommendItem[];
    getBannerListDispatch?: Function;
    getRecommendListDispatch?: Function;
}

const Recommend: React.FC<IRecommendProps> = (props) => {
    const { bannerList, recommendList, getBannerListDispatch, getRecommendListDispatch } = props;

    useEffect(() => {
        getBannerListDispatch && getBannerListDispatch();
        getRecommendListDispatch && getRecommendListDispatch();
    }, [])

    return (
        <div className='recommend-wrapper'>
            <Scroll
                onPullDown={() => { console.log('pulling down') }}
                onPullUp={() => { console.log('pulling up') }}
                onScroll={() => { console.log('scroll') }}
            >
                <div>
                    <Slider bannerList={bannerList}></Slider>
                    <RecommendList recommendList={recommendList}/>
                </div>
            </Scroll>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        bannerList: state.recommend.bannerList,
        recommendList: state.recommend.recommendList
    }
}

const mapDispatchToProps = (dispatch: any) => {
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