import React, { forwardRef, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux';
import { IPlayerDispatchProps, mapPlayerDispatchToProps } from '../../application/Player/store';
import { Track } from '../../api/types';

interface BaseSongListProps {
    tracks: Track[]
    handleTrackClick?: (id: number) => void
}

export type SongListProps = BaseSongListProps & Partial<IPlayerDispatchProps>;

const SongList = forwardRef<HTMLDivElement, SongListProps>((props, ref) => {
    const isFirst = useRef(true);
    const { tracks } = props;
    const {
        changeCurrentSong,
        changeSequencePlayList
    } = props;

    const handleSongPlay = (song: Track) => {
        if (isFirst.current) {
            isFirst.current = false;
            changeSequencePlayList && changeSequencePlayList(tracks)
        }
        changeCurrentSong && changeCurrentSong(song);
    }

    return (
        <div className='song-list-wrapper' ref={ref}>
            <div className='first-line'>
                <div onClick={() => { handleSongPlay(tracks[0]) }}>
                    <FontAwesomeIcon icon='play-circle' />
                    <span>播放全部</span>
                </div>
                <div>
                    <FontAwesomeIcon icon='plus' />
                    <span>收藏</span>
                </div>
            </div>
            <div className='song-list-container'>
                {
                    tracks.map((track, index) => (
                        <div
                            className='song-item'
                            key={track.id}
                            onClick={() => { handleSongPlay(track) }}
                        >
                            <span>{index + 1}</span>
                            <div className='song-info'>
                                <span className='song-name'>{track.name}</span>
                                <span className='song-singer'>{track.ar[0].name}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
})

export default connect(null, mapPlayerDispatchToProps)(SongList);