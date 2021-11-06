import React from 'react';
import { connect } from 'react-redux';
import { playMode } from '../../api/config';
import { actionCreators } from './store';
import { IPlayerState as IStateProps } from './store/reducer';

const Player: React.FC = (props) => {
    return (
        <div>
            Player
        </div>
    )
}

interface IDispatchProps {
    setCurrentIndex: Function
    setCurrentSong: Function
    setFullScreen: Function
    setPlayList: Function
    setPlayingState: Function
    setPlayMode: Function
    setSequencePlayList: Function
    setShowPlayList: Function
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

        setCurrentSong(data: {}) {
            const action = actionCreators.setCurrentSong(data);
            dispatch(action);
        },

        setFullScreen(data: boolean) {
            const action = actionCreators.setFullScreen(data);
            dispatch(action);
        },

        setPlayList(data: []) {
            const action = actionCreators.setPlayList(data);
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

        setSequencePlayList(data: []) {
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