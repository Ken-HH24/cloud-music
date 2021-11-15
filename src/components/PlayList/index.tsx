import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { modeToIcon, playMode } from '../../api/config';
import { IPlayerStateProps, mapPlayerStateToProps, IPlayerDispatchProps, mapPlayerDispatchToProps, PlayerTypes } from '../../application/Player/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import Scroll from '../Scroll';
import { useClickOutside } from '../../hooks/useClickOutside';

interface BasePlayListProps {
    isShow: boolean
    handleModeChange: (newMode: playMode) => void
}

export type PlayListProps = BasePlayListProps & Partial<IPlayerStateProps> & Partial<IPlayerDispatchProps>

const PlayList: React.FC<PlayListProps> = (props) => {
    const {
        mode,
        isShow,
        currentSong,
        handleModeChange,
        sequencePlayList,
        changeCurrentSong,
        changeShowPlayList,
    } = props;

    const tracks = sequencePlayList!;
    const playListRef = useRef<HTMLDivElement>(null);
    useClickOutside(playListRef, () => { changeShowPlayList && changeShowPlayList(false); });

    const handlePlayListClose = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        changeShowPlayList && changeShowPlayList(false);
    }

    const handleSongPlay = (song: PlayerTypes.Song) => {
        changeCurrentSong && changeCurrentSong(song);
    }

    const handleModeClick = () => {
        switch (mode) {
            case 'loop':
                handleModeChange('random');
                break;
            case 'random':
                handleModeChange('sequence');
                break;
            case 'sequence':
                handleModeChange('loop');
                break;
            default:
                break;
        }
    }

    const renderScroll = () => {
        const id = currentSong?.id;
        return (
            <Scroll>
                <main>
                    {
                        tracks.map(track => {
                            const isPlaying = id === track.id;
                            const classNames = `playList-track-item ${isPlaying ? 'isPlaying' : ''}`
                            return (
                                <div
                                    key={track.id}
                                    className={classNames}
                                    onClick={() => { handleSongPlay(track) }}
                                >
                                    <span>{track.name}</span>
                                    <span>{track.ar[0].name}</span>
                                    {isPlaying && <FontAwesomeIcon icon='music' />}
                                    <FontAwesomeIcon icon='times' className='delete' />

                                </div>
                            )
                        })
                    }
                </main>
            </Scroll>
        )
    }

    return (
        <CSSTransition
            in={isShow}
            timeout={300}
            appear
            mountOnEnter
            unmountOnExit
            classNames='bottomToTop'
        >
            <div className='playList' ref={playListRef}>
                <header>
                    <div className='playList-mode' onClick={handleModeClick}>
                        <FontAwesomeIcon icon={modeToIcon[mode!]} />
                        <span>{mode}</span>
                    </div>
                </header>
                {renderScroll()}
                <footer>
                    <span onClick={(e) => { handlePlayListClose(e) }}>close</span>
                </footer>
            </div>
        </CSSTransition>
    )
}

export default connect(mapPlayerStateToProps, mapPlayerDispatchToProps)(PlayList);