import React from 'react';
import { withRouter } from 'react-router';
import Slider from '../../components/slider';
import RecommendList from '../../components/RecommendList';

const recommendList = [
    {
        imgUrl: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17c622fc1e4b4a39949363ec8bf9d3fc~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp',
        desc: 'test test test asdfawheahaehaeh',
        count: 678
    },
    {
        imgUrl: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17c622fc1e4b4a39949363ec8bf9d3fc~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp',
        desc: 'test test test asdfawheahaehaeh',
        count: 12000
    },
    {
        imgUrl: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17c622fc1e4b4a39949363ec8bf9d3fc~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp',
        desc: 'React Hooks 与 Immutable 数据流实战',
        count: 5000
    },
    {
        imgUrl: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17c622fc1e4b4a39949363ec8bf9d3fc~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp',
        desc: 'React Hooks 与 Immutable 数据流实战',
        count: 112
    },
    {
        imgUrl: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17c622fc1e4b4a39949363ec8bf9d3fc~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp',
        desc: 'test test test asdfawheahaehaehvhaaddddddd',
        count: 53
    },
    {
        imgUrl: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17c622fc1e4b4a39949363ec8bf9d3fc~tplv-k3u1fbpfcp-zoom-crop-mark:1304:1304:1304:734.awebp',
        desc: 'test test test asdfawheahaehaehaaddddddd',
        count: 50000000
    },
]

const Recommend: React.FC = (props) => {
    return (
        <div>
            <Slider></Slider>
            <RecommendList recommendList={recommendList}/>
        </div>
    )
}

export default withRouter(Recommend);