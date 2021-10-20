import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import getHorizenBar from '../../components/HorizenBar';
import Scroll from '../../components/Scroll';
import { actionCreators } from './store';
import { SingerTagItem, AlphaItem, ArtistItem } from './store/types';

export type SingersProps = IStateProps & IDispatchProps;

const Singers: React.FC<SingersProps> = (props) => {
    const {
        singerTagList,
        alphaList,
        singerList,
        page,
        pageSize,
        changeSingerPage,
        getSingerList,
        addSingerList
    } = props;

    const [singerTag, setSingerTag] = useState<SingerTagItem>();
    const [alpha, setAlpha] = useState<AlphaItem>();

    const HorizenBarSinger = getHorizenBar<SingerTagItem>();
    const HorizenBarAlpha = getHorizenBar<AlphaItem>();

    useEffect(() => {
        getSingerList();
    }, [])

    const handleSingerTagClick = (newSingerTag: SingerTagItem) => {
        setSingerTag(newSingerTag);
        getSingerList(newSingerTag, alpha);
        changeSingerPage(1);
    }

    const handleAlphaClick = (newAlpha: AlphaItem) => {
        setAlpha(newAlpha);
        getSingerList(singerTag, newAlpha);
        changeSingerPage(1);
    }

    const handlePullUpLoadMore = () => {
        const offset = page * pageSize;
        console.log('load more', offset);
        changeSingerPage(page + 1);
        addSingerList(singerTag, alpha, offset);
    }

    return (
        <div className='singers-wrapper'>
            <HorizenBarSinger title='热门:' items={singerTagList} activeItem={singerTag} handleItemClick={handleSingerTagClick} />
            <HorizenBarAlpha title='首字母:' items={alphaList} activeItem={alpha} handleItemClick={handleAlphaClick} />
            <div className='singer-list-wrapper'>
                <Scroll
                    onPullUp={handlePullUpLoadMore}
                >
                    <div>
                        {
                            singerList.map(singer => {
                                return (
                                    <div className='singer-item-wrapper' key={singer.id}>
                                        <img className='singer-pic' src={singer.picUrl} alt='singer'></img>
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
    page: number;
    pageSize: number;
}

interface IDispatchProps {
    getSingerList: (singerTag?: SingerTagItem, alpha?: AlphaItem) => void;
    changeSingerPage: (newPage: number) => void;
    addSingerList: (singerTag?: SingerTagItem, alpha?: AlphaItem, offset?: number) => void;
}

const mapStateToProps = (state: any): IStateProps => {
    return {
        singerList: state.singers.singerList,
        alphaList: state.singers.alphaList,
        singerTagList: state.singers.singerTagList,
        page: state.singers.page,
        pageSize: state.singers.pageSize
    }
}

const defaultSingerTag: SingerTagItem = {
    name: '全部',
    key: '全部',
    area: '全部',
    type: '全部'
}

const defaultAlphaItem: AlphaItem = {
    name: '-1',
    key: '-1'
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
    return {
        getSingerList(singerTag: SingerTagItem = defaultSingerTag, alpha: AlphaItem = defaultAlphaItem) {
            const action = actionCreators.getSingerList(singerTag, alpha);
            dispatch(action);
        },

        changeSingerPage(newPage: number) {
            const action = actionCreators.changeSingerPage(newPage);
            dispatch(action);
        },

        addSingerList(singerTag: SingerTagItem = defaultSingerTag, alpha: AlphaItem = defaultAlphaItem, offset: number = 0) {
            const action = actionCreators.getMoreSingerList(singerTag, alpha, offset);
            dispatch(action);
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Singers));
