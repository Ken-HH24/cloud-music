import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import Header from '../../components/Header';
import Scroll from '../../components/Scroll';
import SongList from '../../components/SongList';
import { AlbumTypes } from './store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPlaylist } from './store/actionCreators';
import { connect } from 'react-redux';
import { RouteConfigComponentProps } from 'react-router-config';

interface AlbumUrlParams {
    id: string
}

export type AlbumProps = RouteConfigComponentProps<AlbumUrlParams> & IStateProps & IDispatchProps;

const Album: React.FC<AlbumProps> = (props) => {
    const { playList, getPlaylist } = props;
    const { id } = props.match.params;

    const [showStatus, setShowStatus] = useState(true);
    const [isMarquee, setIsMarquee] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getPlaylist(id);
    }, [])

    const renderDesc = () => {
        return (
            <div className='desc-wrapper'>
                <div className='album-bg' style={{ backgroundImage: `url(${playList.coverImgUrl})` }} />
                <div className='album-desc'>
                    <img className='album-cover' alt='cover' src={playList.coverImgUrl} />
                    <div>
                        <span className='album-title'>{playList.name}</span>
                        <span className='album-author'>{playList.description}</span>
                    </div>
                </div>
                <div className='menu-wrapper'>
                    <div className='menu-item'>
                        <FontAwesomeIcon icon='comment-dots' />
                        <span>评论</span>
                    </div>
                    <div className='menu-item'>
                        <FontAwesomeIcon icon='heart' />
                        <span>点赞</span>
                    </div>
                    <div className='menu-item'>
                        <FontAwesomeIcon icon='plus' />
                        <span>收藏</span>
                    </div>
                    <div className='menu-item'>
                        <FontAwesomeIcon icon='ellipsis-v' />
                        <span>更多</span>
                    </div>
                </div>
            </div>
        )
    }

    const handleBack = useCallback(() => {
        setShowStatus(false);
    }, []);

    const handleScroll = useCallback((pos: any) => {
        const minScrollY = -40;
        const percent = Math.abs(pos.y / minScrollY);
        const headerDOM = headerRef.current!;
        console.log(pos, percent);
        if (pos.y < minScrollY) {
            headerDOM.style.backgroundColor = '#e74c3c';
            headerDOM.style.opacity = Math.min(1, (percent - 1) / 2).toString();
            setIsMarquee(true);

        } else {
            headerDOM.style.backgroundColor = '';
            headerDOM.style.opacity = '1';
            setIsMarquee(false);
        }
    }, [headerRef])

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            appear={true}
            unmountOnExit
            classNames='fly'
            onExited={props.history.goBack}
        >
            <div className='album-wrapper'>
                <Header ref={headerRef} title={playList.name} isMarquee={isMarquee} handleBack={handleBack} />
                <div className='album-content'>
                    <Scroll onScroll={handleScroll}>
                        {renderDesc()}
                        <SongList tracks={playList.tracks} />
                    </Scroll>
                </div>
            </div>
        </CSSTransition>
    )
}

interface IStateProps {
    playList: AlbumTypes.PlayListItem
}

interface IDispatchProps {
    getPlaylist: (id: string) => void
}

const mapStateToProps = (state: any): IStateProps => {
    return {
        playList: state.album.playList
    }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
    return {
        getPlaylist(id: string) {
            const action = getPlaylist(id);
            dispatch(action)
        }
    }
}

export default withRouter<AlbumProps, React.FC<AlbumProps>>(connect(mapStateToProps, mapDispatchToProps)(Album));
