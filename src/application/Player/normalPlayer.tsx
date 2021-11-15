import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { PlayerTypes } from './store';
import ProgressBar from '../../components/ProgressBar';
import { formatSongTime } from '../../api/utils';
import { modeToIcon, playMode } from '../../api/config';

export interface NormalPlayerProps {
    song: PlayerTypes.Song
    playing: boolean
    percent: number
    currentTime: number
    duration: number
    fullScreen: boolean
    mode: playMode

    toggleFullScreen: Function
    togglePlaying: Function
    toggleNextSong: Function
    togglePrevSong: Function
    toggleShowPlayList: (e: React.MouseEvent, showPlayList: boolean) => void
    toggleModeChange: (mode: playMode) => void
    handleCurrentTimeChange: Function
}

const NormalPlayer: React.FC<NormalPlayerProps> = (props) => {
    const {
        song,
        mode,
        playing,
        percent,
        currentTime,
        duration,
        fullScreen,
        toggleFullScreen,
        togglePlaying,
        toggleNextSong,
        togglePrevSong,
        toggleModeChange,
        toggleShowPlayList,
        handleCurrentTimeChange
    } = props;

    const handleProgressChange = (percent: number) => {
        const newTime = duration * percent / 100;
        handleCurrentTimeChange(newTime);
    }

    const handleModeChange = () => {
        switch (mode) {
            case 'loop':
                toggleModeChange('random');
                break;
            case 'random':
                toggleModeChange('sequence');
                break;
            case 'sequence':
                toggleModeChange('loop');
                break;
            default:
                break;
        }
    }

    return (
        <CSSTransition
            in={fullScreen}
            timeout={400}
            appear
            classNames='normal'
            unmountOnExit
        >
            <div className='normal-player-wrapper'>
                <div className='normal-player-bg'>
                    <img alt='bg' src={song.al.picUrl} />
                    <div className='layer' />
                </div>
                <div className='normal-player-header'>
                    <div className='back' onClick={() => { toggleFullScreen(false) }}>
                        <FontAwesomeIcon icon='chevron-down' />
                    </div>
                    <h1 className='song-name'>{song.name}</h1>
                    <h1 className='song-singer'>{song.ar[0].name}</h1>
                </div>
                <div className='normal-player-main'>
                    <div className='normal-player-cd-wrapper'>
                        <img alt='cd' src={song.al.picUrl} className='cd' />
                    </div>

                </div>
                <div className='normal-player-footer'>
                    <div className='player-progress-bar'>
                        <span>{formatSongTime(currentTime)}</span>
                        <ProgressBar percentage={percent} percentageChange={handleProgressChange} />
                        <span>{formatSongTime(duration)}</span>
                    </div>
                    <div className='btn-group'>
                        <FontAwesomeIcon icon={modeToIcon[mode]} onClick={() => { handleModeChange() }} />
                        <FontAwesomeIcon icon='step-backward' onClick={() => { togglePrevSong() }} />
                        {
                            playing ? <FontAwesomeIcon icon='pause-circle' onClick={(e) => { togglePlaying(e, false) }} />
                                : <FontAwesomeIcon icon='play-circle' onClick={(e) => { togglePlaying(e, true) }} />
                        }
                        <FontAwesomeIcon icon='step-forward' onClick={() => { toggleNextSong() }} />
                        <FontAwesomeIcon icon='list-ul' onClick={(e) => { toggleShowPlayList(e, true) }} />
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

export default NormalPlayer;