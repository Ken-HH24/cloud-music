import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { PlayerTypes } from './store';

export interface MiniPlayerProps {
    song: PlayerTypes.Song
}

const MiniPlayer: React.FC<MiniPlayerProps> = (props) => {
    const { song } = props;

    return (
        <div className='mini-player-wrapper'>
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
    )
}

export default MiniPlayer;