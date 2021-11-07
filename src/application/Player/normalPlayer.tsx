import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { PlayerTypes } from './store';

export interface NormalPlayerProps {
    song: PlayerTypes.Song
}

const NormalPlayer: React.FC<NormalPlayerProps> = (props) => {
    const { song } = props;

    return (
        <div className='normal-player-wrapper'>
            <div className='normal-player-bg'>
                <img alt='bg' src={song.al.picUrl} />
                <div className='layer' />
            </div>
            <div className='normal-player-header'>
                <div className='back'>
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
                <FontAwesomeIcon icon='sync-alt' />
                <FontAwesomeIcon icon='step-backward' />
                <FontAwesomeIcon icon='pause-circle' />
                <FontAwesomeIcon icon='step-forward' />
                <FontAwesomeIcon icon='list-ul' />
            </div>
        </div>
    )
}

export default NormalPlayer;