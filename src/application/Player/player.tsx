import React, { useEffect, useRef, useState } from 'react';
import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer';
import { connect } from 'react-redux';
import { playMode } from '../../api/config';
import { actionCreators, PlayerTypes } from './store';
import { IPlayerState as IStateProps } from './store/reducer';
import { getSongUrl, shuffleList } from '../../api/utils';
import PlayList from '../../components/PlayList';

export type PlayerProps = IStateProps & IDispatchProps;

const Player: React.FC<PlayerProps> = (props) => {
    const {
        mode,
        fullScreen,
        playing,
        playList,
        showPlaylist,
        currentIndex,
        currentSong,
        sequencePlayList
    } = props;

    const {
        setFullScreen,
        setCurrentIndex,
        setCurrentSong,
        setShowPlayList,
        setPlayingState,
        setPlayMode,
        setPlayList,
    } = props;

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const percent = isNaN(currentTime / duration * 100) ? 0 : currentTime / duration * 100;
    const audioRef = useRef<HTMLAudioElement>(null);

    const modeStrategies = {
        'loop': function () {
            setPlayMode('loop');
            setPlayList(currentSong ? [currentSong] : []);
        },

        'random': function () {
            setPlayMode('random')
            const newPlayList = shuffleList<PlayerTypes.Song>(sequencePlayList);
            setPlayList(newPlayList);
            for (let i = 0; i < newPlayList.length; i++) {
                if (newPlayList[i].id === currentSong?.id) {
                    setCurrentIndex(i);
                    break;
                }
            }
        },

        'sequence': function () {
            setPlayMode('sequence')
            setPlayList(sequencePlayList);
            for (let i = 0; i < sequencePlayList.length; i++) {
                if (sequencePlayList[i].id === currentSong?.id) {
                    setCurrentIndex(i);
                    break;
                }
            }
        }
    }

    const handleModeChange = (newMode: playMode) => {
        const strategy = modeStrategies[newMode];
        strategy();
        if (playing) {
            setTimeout(() => {
                audioRef.current!.play();
            });
        }
    }

    useEffect(() => {
        handleModeChange(mode);
    }, [sequencePlayList])

    useEffect(() => {
        if (currentSong) {
            audioRef.current!.src = getSongUrl(currentSong.id);
            setCurrentTime(0);
            setDuration(currentSong.dt / 1000 | 0);
            setPlayingState(true);
            setTimeout(() => {
                audioRef.current!.play();
            });
            for (let i = 0; i < playList.length; i++) {
                if (playList[i].id === currentSong.id) {
                    setCurrentIndex(i);
                    break;
                }
            }
        }
    }, [currentSong])

    const handleSongChange = (index: number) => {
        const song = playList[index];
        setCurrentSong(song);
        setCurrentIndex(index);
    }

    const handleTimeUpdate = (e: any) => {
        setCurrentTime(e.target.currentTime);
    }

    const togglePlaying = (e: MouseEvent, isPlay: boolean) => {
        e.stopPropagation();
        if (!isPlay) {
            setTimeout(() => {
                audioRef.current!.pause();
            });
            setPlayingState(false);
        } else {
            setTimeout(() => {
                audioRef.current!.play();
            });
            setPlayingState(true);
        }
    }

    const toggleShowPlayList = (e: React.MouseEvent, showPlayList: boolean) => {
        e.stopPropagation();
        setShowPlayList(showPlayList);
    }

    const handleCurrentTimeChange = (newTime: number) => {
        setCurrentTime(newTime);
        audioRef.current!.currentTime = newTime;
        if (playing) {
            setTimeout(() => {
                audioRef.current!.play();
            });
        }
    }

    const handleNextSong = () => {
        if (mode === 'loop') {
            audioRef.current!.currentTime = 0;
            setCurrentTime(0);
            setTimeout(() => {
                audioRef.current!.play();
            });
        } else {
            const newIndex = (currentIndex + 1) % playList.length;
            handleSongChange(newIndex);
        }
    }

    const handlePrevSong = () => {
        const newIndex = (currentIndex - 1) >= 0 ? (currentIndex - 1) : playList.length - 1;
        handleSongChange(newIndex);
    }

    return (
        <div>
            {
                currentSong &&
                <MiniPlayer
                    song={currentSong}
                    playing={playing}
                    percent={percent}
                    fullScreen={fullScreen}
                    toggleFullScreen={setFullScreen}
                    togglePlaying={togglePlaying}
                    toggleShowPlayList={toggleShowPlayList}
                />
            }
            {
                currentSong &&
                <NormalPlayer
                    song={currentSong}
                    mode={mode}
                    playing={playing}
                    percent={percent}
                    currentTime={currentTime}
                    duration={duration}
                    fullScreen={fullScreen}
                    toggleFullScreen={setFullScreen}
                    togglePlaying={togglePlaying}
                    toggleNextSong={handleNextSong}
                    togglePrevSong={handlePrevSong}
                    toggleModeChange={handleModeChange}
                    toggleShowPlayList={toggleShowPlayList}
                    handleCurrentTimeChange={handleCurrentTimeChange}
                />
            }
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => { handleNextSong() }}
            />
            <PlayList
                isShow={showPlaylist}
                handleModeChange={handleModeChange}
            />
        </div>
    )
}

interface IDispatchProps {
    setCurrentIndex: (data: number) => void
    setCurrentSong: (data: PlayerTypes.Song) => void
    setFullScreen: (data: boolean) => void
    setPlayList: (data: PlayerTypes.Song[]) => void
    getPlayList: (data: string) => void
    setPlayingState: (data: boolean) => void
    setPlayMode: (data: playMode) => void
    setSequencePlayList: (data: PlayerTypes.Song[]) => void
    setShowPlayList: (data: boolean) => void
}

const mapStateToProps = (state: { player: IStateProps }): IStateProps => {
    return {
        fullScreen: state.player.fullScreen,
        playing: state.player.playing,
        sequencePlayList: state.player.sequencePlayList,
        playList: state.player.playList,
        mode: state.player.mode,
        currentIndex: state.player.currentIndex,
        showPlaylist: state.player.showPlaylist,
        currentSong: state.player.currentSong
    }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
    return {
        setCurrentIndex(data: number) {
            const action = actionCreators.setCurrentIndex(data);
            dispatch(action);
        },

        setCurrentSong(data: PlayerTypes.Song) {
            const action = actionCreators.setCurrentSong(data);
            dispatch(action);
        },

        setFullScreen(data: boolean) {
            const action = actionCreators.setFullScreen(data);
            dispatch(action);
        },

        setPlayList(data: PlayerTypes.Song[]) {
            const action = actionCreators.setPlayList(data);
            dispatch(action);
        },

        getPlayList(data: string) {
            const action = actionCreators.getPlayList(data);
            dispatch(action);
        },

        setPlayingState(data: boolean) {
            const action = actionCreators.setPlayingState(data);
            dispatch(action);
        },

        setPlayMode(data: playMode) {
            const action = actionCreators.setPlayMode(data);
            dispatch(action);
        },

        setSequencePlayList(data: PlayerTypes.Song[]) {
            const action = actionCreators.setSequencePlayList(data);
            dispatch(action);
        },

        setShowPlayList(data: boolean) {
            const action = actionCreators.setShowPlayList(data);
            dispatch(action);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);