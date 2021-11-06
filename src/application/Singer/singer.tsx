import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router';
import { RouteConfigComponentProps } from 'react-router-config';
import { CSSTransition } from 'react-transition-group';
import Header from '../../components/Header';
import SongList from '../../components/SongList';
import Scroll from '../../components/Scroll';
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

    const mapSongsToTracks = (songs: SingerTypes.Song[]) => {
        return songs.map((song, index) => ({
            id: index,
            name: song.name,
            ar: [{ id: index, name: singer.artist.name }]
        }))
    }

    const tracks = mapSongsToTracks(singer.hotSongs);

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            appear={true}
            classNames='fly'
            onExited={props.history.goBack}
        >
            <div className='singer-wrapper'>
                <Header title='header' handleBack={handleBack} style={{ background: 'none' }} ref={headerRef} />
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
        </CSSTransition>
    )
}

interface IDispatchToProps {
    getSingerDetail: Function
}

const mapStateToProps = (state: { singer: IStateProps }): IStateProps => {
    return {
        singer: state.singer.singer
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