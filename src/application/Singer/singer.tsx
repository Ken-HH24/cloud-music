import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router';
import { RouteConfigComponentProps } from 'react-router-config';
import { CSSTransition } from 'react-transition-group';
import Header from '../../components/Header';
import SongList from '../../components/SongList';
import Scroll from '../../components/Scroll';
import Loading from '../../components/Loading';
import { ISingerState as IStateProps } from './store/reducer';
import { actionCreators, SingerTypes } from './store';
import { connect } from 'react-redux';

interface SingerUrlParams {
    id: string
}

type SingerProps = RouteConfigComponentProps<SingerUrlParams> & IStateProps & IDispatchToProps

const Singer: React.FC<SingerProps> = (props) => {
    const {
        singer,
        loading,
        getSingerDetail
    } = props;

    const [showStatus, setShowStatus] = useState(true);
    const singerImgRef = useRef<HTMLImageElement>(null);
    const singerSongRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const collectButtonRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<any>(null);
    const initialHeight = useRef(0);

    const OFFSET = 5;
    const initDOM = () => {
        if (loading)
            return;
        const offsetHeight = singerImgRef.current!.offsetHeight;
        let h: number;
        if (offsetHeight === 0)
            h = 336;
        else
            h = offsetHeight

        initialHeight.current = h;
        singerSongRef.current!.style.top = `${h - OFFSET}px`;
        layerRef.current!.style.top = `${h - OFFSET}px`;
        scrollRef.current.refresh();
    }

    useEffect(() => {
        getSingerDetail(props.match.params.id);
        initDOM();
    }, []);

    useEffect(() => {
        initDOM();
    }, [loading])

    const handleBack = useCallback(() => {
        setShowStatus(false);
    }, []);

    const handleScroll = (pos: any) => {
        const height = initialHeight.current;
        const newY = pos.y;
        const imgDOM = singerImgRef.current!;
        const btnDOM = collectButtonRef.current!;
        const headerDOM = headerRef.current!;
        const layerDOM = layerRef.current!;
        const min_ScrollY = -(height - OFFSET) + 40;

        const percent = Math.abs(newY / height);

        if (newY > 0) {
            imgDOM.style['transform'] = `scale(${1 + percent})`;
            btnDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`;
            layerDOM.style.top = `${height - OFFSET + newY}px`;
            headerDOM.style.background = 'transparent';
        } else if (newY >= min_ScrollY) {
            layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
            btnDOM.style['transform'] = `translate3d (0, ${newY}px, 0)`;
            btnDOM.style["opacity"] = `${1 - percent * 2}`;
            headerDOM.style.background = 'transparent';
        } else {
            layerDOM.style.top = `${40 - OFFSET}px`;
            headerDOM.style.zIndex = '500';
            headerDOM.style.background = '#e74c3c';
        }
    }

    const renderLoading = () => {
        const styles: CSSProperties = {
            background: '#fff',
            height: '100%',
            position: 'fixed',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0'
        }

        return (
            <Loading style={styles} />
        )
    }

    const mapSongsToTracks = (songs: SingerTypes.Song[]) => {
        return songs.map((song, index) => ({
            id: index,
            name: song.name,
            ar: [{ id: index, name: singer.artist.name }]
        }))
    }

    const renderSingerPage = () => {
        const tracks = mapSongsToTracks(singer.hotSongs);
        return (
            <div className='singer-wrapper'>
                <Header
                    title={singer.artist.name}
                    handleBack={handleBack}
                    style={{ background: 'none' }}
                    ref={headerRef}
                />
                <div className='singer-desc'>
                    <img
                        alt='singer-img'
                        className='singer-img'
                        ref={singerImgRef}
                        src={singer.artist.picUrl}
                    />
                    <div className='singer-collect-btn' ref={collectButtonRef}>
                        <FontAwesomeIcon icon='plus' />
                        <span>收藏</span>
                    </div>
                </div>
                <div className='singer-bg-layer' ref={layerRef} />
                <div className='singer-song-list' ref={singerSongRef}>
                    <Scroll ref={scrollRef} onScroll={handleScroll} threshold={0}>
                        <SongList tracks={tracks} />
                    </Scroll>
                </div>
            </div>
        )
    }

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            appear={true}
            classNames='fly'
            onExited={props.history.goBack}
        >
            {loading ? renderLoading() : renderSingerPage()}
        </CSSTransition>
    )
}

interface IDispatchToProps {
    getSingerDetail: Function
}

const mapStateToProps = (state: { singer: IStateProps }): IStateProps => {
    return {
        singer: state.singer.singer,
        loading: state.singer.loading
    }
}

const mapDispatchToProps = (dispatch: any): IDispatchToProps => {
    return {
        getSingerDetail(id: string) {
            const action = actionCreators.getSingerDetail(id);
            dispatch(action);
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Singer));