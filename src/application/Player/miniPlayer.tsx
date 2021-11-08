import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { PlayerTypes } from './store';

export interface MiniPlayerProps {
    song: PlayerTypes.Song
    fullScreen: boolean
    toggleFullScreen: Function
}

const MiniPlayer: React.FC<MiniPlayerProps> = (props) => {
    const {
        song,
        fullScreen,
        toggleFullScreen
    } = props;

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
                    <img alt='player' src={song.al.picUrl} />
                </div>
                <div className='mini-player-text'>
                    <span className='mini-player-song-name'>{song.name}</span>
                    <span className='mini-player-song-singer'>{song.ar[0].name}</span>
                </div>
                <div className='mini-player-control'>
                    <FontAwesomeIcon icon='pause' />
                    <FontAwesomeIcon icon='sliders-h' />
                </div>
            </div>
        </CSSTransition>
    )
}

export default MiniPlayer;