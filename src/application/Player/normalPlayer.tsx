import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { PlayerTypes } from './store';
import ProgressBar from '../../components/ProgressBar';

export interface NormalPlayerProps {
    song: PlayerTypes.Song
    fullScreen: boolean
    toggleFullScreen: Function
}

const NormalPlayer: React.FC<NormalPlayerProps> = (props) => {
    const {
        song,
        fullScreen,
        toggleFullScreen
    } = props;

    const normalPlaerRef = useRef<HTMLDivElement>(null);

    return (
        <CSSTransition
            in={fullScreen}
            timeout={400}
            appear
            classNames='normal'
            unmountOnExit
        >
            <div className='normal-player-wrapper' ref={normalPlaerRef}>
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
                        <ProgressBar />
                    </div>
                    <div className='btn-group'>
                        <FontAwesomeIcon icon='sync-alt' />
                        <FontAwesomeIcon icon='step-backward' />
                        <FontAwesomeIcon icon='pause-circle' />
                        <FontAwesomeIcon icon='step-forward' />
                        <FontAwesomeIcon icon='list-ul' />
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

export default NormalPlayer;