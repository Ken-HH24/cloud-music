import React, { forwardRef, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux';
import { actionCreators, PlayerTypes } from '../../application/Player/store';

interface TrackItem {
    id: number
    dt: number
    name: string
    al: { picUrl: string }
    ar: { name: string }[]
}

interface BaseSongListProps {
    tracks: TrackItem[]
    handleTrackClick?: (id: number) => void
}

export type SongListProps = BaseSongListProps & Partial<IDispatchProps>;

const SongList = forwardRef<HTMLDivElement, SongListProps>((props, ref) => {
    const isFirst = useRef(true);
    const { tracks } = props;
    const {
        changeCurrentSong,
        changeSequencePlayList
    } = props;

    const handleSongPlay = (song: TrackItem) => {
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

interface IDispatchProps {
    changeSequencePlayList: (data: PlayerTypes.Song[]) => void
    changePlayList: (data: PlayerTypes.Song[]) => void
    changeCurrentIndex: (data: number) => void
    changeCurrentSong: (data: PlayerTypes.Song) => void
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
    return {
        changeSequencePlayList(data: PlayerTypes.Song[]) {
            const action = actionCreators.setSequencePlayList(data);
            dispatch(action);
        },

        changePlayList(data: PlayerTypes.Song[]) {
            const action = actionCreators.setPlayList(data);
            dispatch(action);
        },

        changeCurrentIndex(data: number) {
            const action = actionCreators.setCurrentIndex(data);
            dispatch(action);
        },

        changeCurrentSong(data: PlayerTypes.Song) {
            const action = actionCreators.setCurrentSong(data);
            dispatch(action);
        }
    }
}

export default connect(null, mapDispatchToProps)(SongList);