import { playMode } from '../../../api/config';
import * as actionCreators from './actionCreators';
import * as PlayerTypes from './types';
import playerReducer, { IPlayerState } from './reducer';

export interface IPlayerStateProps {
    mode: playMode
    showPlayList: boolean
    currentSong: PlayerTypes.Song | null
    sequencePlayList: PlayerTypes.Song[]
}

export interface IPlayerDispatchProps {
    changeSequencePlayList: (data: PlayerTypes.Song[]) => void
    changeCurrentSong: (data: PlayerTypes.Song) => void
    changeShowPlayList: (data: boolean) => void
}

const mapPlayerStateToProps = (state: { player: IPlayerState }): IPlayerStateProps => {
    return {
        mode: state.player.mode,
        currentSong: state.player.currentSong,
        showPlayList: state.player.showPlaylist,
        sequencePlayList: state.player.sequencePlayList,
    }
}

const mapPlayerDispatchToProps = (dispatch: any): IPlayerDispatchProps => {
    return {
        changeSequencePlayList(data: PlayerTypes.Song[]) {
            const action = actionCreators.setSequencePlayList(data);
            dispatch(action);
        },

        changeCurrentSong(data: PlayerTypes.Song) {
            const action = actionCreators.setCurrentSong(data);
            dispatch(action);
        },

        changeShowPlayList(data: boolean) {
            const action = actionCreators.setShowPlayList(data);
            dispatch(action);
        }
    }
}

export { playerReducer, actionCreators, PlayerTypes, mapPlayerDispatchToProps, mapPlayerStateToProps };