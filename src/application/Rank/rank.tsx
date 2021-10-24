import React, { useEffect, useState } from 'react';
import { RankItem } from './store/types';
import { actionCreators } from '../Rank/store';
import { connect } from 'react-redux';
import { splitRankListIndex } from '../../api/utils';
import ImageLoader from '../../components/ImageLoader';
import Scroll from '../../components/Scroll';

export type RankProps = IStateProps & IDispatchProps;

const Rank: React.FC<RankProps> = (props) => {
    const {
        rankList,
        getRankList
    } = props;

    const [officialList, setOfficialList] = useState<RankItem[]>([]);
    const [globalList, setGlobalList] = useState<RankItem[]>([]);

    useEffect(() => {
        if (!rankList.length) {
            getRankList();
        }
    }, []);

    useEffect(() => {
        const index = splitRankListIndex(rankList);
        setOfficialList(rankList.slice(0, index));
        setGlobalList(rankList.slice(index, rankList.length));
    }, [rankList])

    const renderOfficialList = () => {
        console.log('official', officialList)
        return (
            <div className='official-list-wrapper'>
                <span>官方榜</span>
                <div className='official-list-container'>
                    {
                        officialList.map((rank, index) => {
                            return (
                                <div className='official-list-item' key={index}>
                                    <ImageLoader className='official-list-item-img' alt='' src={rank.coverImgUrl} />
                                    <div className='official-list-item-info'>
                                        {
                                            rank.tracks.map((track, index) => (
                                                <span key={index}>
                                                    {`${index + 1}. ${track.first} - ${track.second}`}
                                                </span>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div >
        )
    }

    const renderGlobalList = () => {
        return (
            <div className='global-list-wrapper'>
                <span>全球榜</span>
                <div className='global-list-container'>
                    {
                        globalList.map((rank, index) => {
                            return (
                                <div className='global-list-item' key={index}>
                                    <ImageLoader className='global-list-item-img' src={rank.coverImgUrl} />
                                    <span className='global-list-item-update'>{rank.updateFrequency}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    return (
        <div className='rank-wrapper'>
            <Scroll direction='Y'>
                {renderOfficialList()}
                {renderGlobalList()}
            </Scroll>
        </div>
    )
}

interface IStateProps {
    rankList: RankItem[]
}

interface IDispatchProps {
    getRankList: () => void
}

const mapStateToProps = (state: { rank: IStateProps }): IStateProps => {
    return {
        rankList: state.rank.rankList
    }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
    return {
        getRankList() {
            const action = actionCreators.getRankList();
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rank);