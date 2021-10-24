import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Scroll from '../../components/Scroll';
import Icon from '../../components/Icon';
import HorizenBarComponent from '../../components/HorizenBar';
import { actionCreators } from './store';
import { SingerTagItem, AlphaItem, ArtistItem } from './store/types';
import LazyLoad, { forceCheck } from 'react-lazyload';
import ImageLoader from '../../components/ImageLoader';

export type SingersProps = IStateProps & IDispatchProps;

const Singers: React.FC<SingersProps> = (props) => {
    const {
        singerTagList,
        alphaList,
        singerList,
        activeInitial,
        activeSingerTag,
        page,
        pageSize,
        changeSingerPage,
        getSingerList,
        addSingerList,
        changeActiveSingerTag,
        changeInitial
    } = props;

    useEffect(() => {
        getSingerList(activeSingerTag, activeInitial);
    }, [])

    const handleSingerTagClick = (key: string) => {
        getSingerList(key, activeInitial);
        changeActiveSingerTag(key);
        changeSingerPage(1);
    }

    const handleAlphaClick = (newAlpha: string) => {
        getSingerList(activeSingerTag, newAlpha);
        changeInitial(newAlpha);
        changeSingerPage(1);
    }

    const handlePullUpLoadMore = () => {
        const offset = page * pageSize;
        console.log('load more', offset);
        changeSingerPage(page + 1);
        addSingerList(activeSingerTag, activeInitial, offset);
    }

    return (
        <div className='singers-wrapper'>
            <HorizenBarComponent title='热门：' onSelect={handleSingerTagClick}>
                {
                    singerTagList.map((singerTag, index) => (
                        <HorizenBarComponent.Item key={singerTag.key} index={singerTag.key}>
                            {singerTag.name}
                        </HorizenBarComponent.Item>
                    ))
                }
            </HorizenBarComponent>
            <HorizenBarComponent title='首字母：' onSelect={handleAlphaClick}>
                {
                    alphaList.map((alpha, index) => (
                        <HorizenBarComponent.Item key={alpha.name} index={alpha.name}>
                            {alpha.name}
                        </HorizenBarComponent.Item>
                    ))
                }
            </HorizenBarComponent>
            <div className='singer-list-wrapper'>
                <Scroll
                    onPullUp={handlePullUpLoadMore}
                    onScroll={forceCheck}
                    pullingDownLoading
                    pullingUpLoading
                >
                    <div>
                        {
                            singerList.map(singer => {
                                return (
                                    <div className='singer-item-wrapper' key={singer.id}>
                                        <ImageLoader className='singer-pic' src={singer.picUrl} />
                                        <div className='singer-name'>{singer.name}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Scroll>
            </div>
        </div>
    )
}

interface IStateProps {
    singerList: ArtistItem[];
    alphaList: AlphaItem[];
    singerTagList: SingerTagItem[];
    activeSingerTag: string;
    activeInitial: string;
    page: number;
    pageSize: number;
}

interface IDispatchProps {
    getSingerList: (singerTag: string, alpha: string) => void;
    changeSingerPage: (newPage: number) => void;
    addSingerList: (singerTag: string, alpha: string, offset?: number) => void;
    changeActiveSingerTag: (key: string) => void;
    changeInitial: (initial: string) => void;
}

const mapStateToProps = (state: any): IStateProps => {
    return {
        singerList: state.singers.singerList,
        alphaList: state.singers.alphaList,
        singerTagList: state.singers.singerTagList,
        activeSingerTag: state.singers.activeSingerTag,
        activeInitial: state.singers.activeInitial,
        page: state.singers.page,
        pageSize: state.singers.pageSize
    }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
    return {
        getSingerList(key: string, alpha: string) {
            const action = actionCreators.getSingerList(key, alpha);
            dispatch(action);
        },

        changeSingerPage(newPage: number) {
            const action = actionCreators.changeSingerPage(newPage);
            dispatch(action);
        },

        addSingerList(key: string, alpha: string, offset: number = 0) {
            const action = actionCreators.getMoreSingerList(key, alpha, offset);
            dispatch(action);
        },

        changeActiveSingerTag(key: string) {
            const action = actionCreators.changeActiveSingerTag(key);
            dispatch(action);
        },

        changeInitial(initial: string) {
            const action = actionCreators.changeInitial(initial);
            dispatch(action);
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Singers));
