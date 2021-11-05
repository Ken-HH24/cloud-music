import React, { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface TrackItem {
    id: number
    name: string
    ar: { id: number, name: string }[]
}

export interface SongListProps {
    tracks: TrackItem[]
    handleTrackClick?: (id: number) => void
}

const SongList = forwardRef<HTMLDivElement, SongListProps>((props, ref) => {
    const { tracks, handleTrackClick } = props;

    return (
        <div className='song-list-wrapper' ref={ref}>
            <div className='first-line'>
                <div>
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
                            onClick={() => { handleTrackClick && handleTrackClick(track.id) }}
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

export default SongList;