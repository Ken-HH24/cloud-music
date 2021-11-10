import { playMode } from '../../../api/config';
import * as actionTypes from './constants';
import { PlayerAction } from './actionCreators';
import { PlayerTypes } from '.';

export interface IPlayerState {
    fullScreen: boolean
    playing: boolean
    sequencePlayList: PlayerTypes.Song[]
    playList: PlayerTypes.Song[]
    mode: playMode
    currentIndex: number
    showPlaylist: boolean
    currentSong: PlayerTypes.Song | null
}

const defaultState: IPlayerState = {
    fullScreen: false,
    playing: false,
    sequencePlayList: [],
    playList: [],
    mode: 'sequence',
    currentIndex: 0,
    showPlaylist: false,
    currentSong: null
}

const playerReducer = (state: IPlayerState = defaultState, action: PlayerAction): IPlayerState => {
    switch (action.type) {
        case actionTypes.SET_FULL_SCREEN:
            return {
                ...state,
                fullScreen: action.data
            }
        case actionTypes.SET_PLAYING_STATE:
            return {
                ...state,
                playing: action.data
            }
        case actionTypes.SET_SEQUENCE_PLAYLIST:
            return {
                ...state,
                sequencePlayList: action.data
            }
        case actionTypes.SET_CURRENT_INDEX:
            return {
                ...state,
                currentIndex: action.data
            }
        case actionTypes.SET_CURRENT_SONG:
            return {
                ...state,
                currentSong: action.data
            }
        case actionTypes.SET_PLAY_MODE:
            return {
                ...state,
                mode: action.data
            }
        case actionTypes.SET_SHOW_PLAYLIST:
            return {
                ...state,
                showPlaylist: action.data
            }
        case actionTypes.SET_PLAY_LIST:
            return {
                ...state,
                playList: action.data
            }
        default:
            return state
    }
}

export default playerReducer;

