import React, { useEffect, useState } from 'react';
import { RankItem } from './store/types';
import { actionCreators } from '../Rank/store';
import { connect } from 'react-redux';
import { splitRankListIndex } from '../../api/utils';
import ImageLoader from '../../components/ImageLoader';
import Scroll from '../../components/Scroll';
import { withRouter } from 'react-router';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';

export type RankProps = RouteConfigComponentProps & IStateProps & IDispatchProps;

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

    const enterDetail = (id: number) => {
        props.history.push(`/rank/${id}`)
    }

    const renderOfficialList = () => {
        return (
            <div className='official-list-wrapper'>
                <span>官方榜</span>
                <div className='official-list-container'>
                    {
                        officialList.map((rank, index) => {
                            return (
                                <div
                                    className='official-list-item'
                                    key={index}
                                    onClick={() => enterDetail(rank.id)}
                                >
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
                                <div
                                    className='global-list-item'
                                    key={index}
                                    onClick={() => { enterDetail(rank.id) }}
                                >
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
            {renderRoutes(props.route?.routes)}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Rank));