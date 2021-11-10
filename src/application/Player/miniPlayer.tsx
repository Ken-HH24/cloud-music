import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { PlayerTypes } from './store';
import ProgressCircle from '../../components/ProgressCircle';

export interface MiniPlayerProps {
    song: PlayerTypes.Song
    playing: boolean
    percent: number
    fullScreen: boolean
    toggleFullScreen: Function
    togglePlaying: Function
}

const MiniPlayer: React.FC<MiniPlayerProps> = (props) => {
    const {
        song,
        playing,
        percent,
        fullScreen,
        toggleFullScreen,
        togglePlaying
    } = props;

    const renderControl = () => {
        return (
            <div className='mini-player-control'>
                <ProgressCircle percent={percent / 100} radius={32}>
                    {
                        playing ? <FontAwesomeIcon
                            className='mini-player-icon pause'
                            icon='pause'
                            onClick={(e) => { togglePlaying(e, false) }}
                        />
                            :
                            <FontAwesomeIcon
                                className='mini-player-icon play'
                                icon='play'
                                onClick={(e) => { togglePlaying(e, true) }}
                            />
                    }
                </ProgressCircle>
                <FontAwesomeIcon className='mini-player-icon slider' icon='sliders-h' />
            </div>
        )
    }

    return (
        <CSSTransition
            in={!fullScreen}
            timeout={400}
            classNames='mini'
            unmountOnExit
            appear
        >
            <div className='mini-player-wrapper' onClick={() => { toggleFullScreen(true) }}>
                <div className='mini-player-img'>
                    <img alt='player' className={`${playing ? 'spin' : ''}`} src={song.al.picUrl} />
                </div>
                <div className='mini-player-text'>
                    <span className='mini-player-song-name'>{song.name}</span>
                    <span className='mini-player-song-singer'>{song.ar[0].name}</span>
                </div>
                {renderControl()}
            </div>
        </CSSTransition>
    )
}

export default MiniPlayer;
