import { playMode } from '../../../api/config';
import * as actionTypes from './constants';
import { PlayerTypes } from '.';
import { Dispatch } from 'redux';
import { getPlaylistDetailRequest } from '../../../api/request';

export interface ISetCurrentIndexAction {
    type: actionTypes.SET_CURRENT_INDEX
    data: number
}

export interface ISetCurrentSongAction {
    type: actionTypes.SET_CURRENT_SONG
    data: PlayerTypes.Song
}

export interface ISetFullScreenAction {
    type: actionTypes.SET_FULL_SCREEN
    data: boolean
}

export interface ISetPlayingStateAction {
    type: actionTypes.SET_PLAYING_STATE
    data: boolean
}

export interface ISetPlayListAction {
    type: actionTypes.SET_PLAY_LIST
    data: PlayerTypes.Song[]
}

export interface ISetPlayModeAction {
    type: actionTypes.SET_PLAY_MODE
    data: playMode
}

export interface ISetSequencePlayListAction {
    type: actionTypes.SET_SEQUENCE_PLAYLIST
    data: PlayerTypes.Song[]
}

export interface ISetShowPlayListAction {
    type: actionTypes.SET_SHOW_PLAYLIST
    data: boolean
}

export type PlayerAction = ISetCurrentIndexAction | ISetCurrentSongAction | ISetFullScreenAction | ISetPlayListAction
    | ISetPlayModeAction | ISetPlayingStateAction | ISetSequencePlayListAction | ISetShowPlayListAction

export const setCurrentIndex = (data: number): ISetCurrentIndexAction => ({
    type: actionTypes.SET_CURRENT_INDEX,
    data
})

export const setCurrentSong = (data: PlayerTypes.Song): ISetCurrentSongAction => ({
    type: actionTypes.SET_CURRENT_SONG,
    data
})

export const setFullScreen = (data: boolean): ISetFullScreenAction => ({
    type: actionTypes.SET_FULL_SCREEN,
    data
})

export const setPlayList = (data: PlayerTypes.Song[]): ISetPlayListAction => ({
    type: actionTypes.SET_PLAY_LIST,
    data
})

export const setPlayingState = (data: boolean): ISetPlayingStateAction => ({
    type: actionTypes.SET_PLAYING_STATE,
    data
})

export const setPlayMode = (data: playMode): ISetPlayModeAction => ({
    type: actionTypes.SET_PLAY_MODE,
    data
})

export const setSequencePlayList = (data: PlayerTypes.Song[]): ISetSequencePlayListAction => ({
    type: actionTypes.SET_SEQUENCE_PLAYLIST,
    data
})

export const setShowPlayList = (data: boolean): ISetShowPlayListAction => ({
    type: actionTypes.SET_SHOW_PLAYLIST,
    data
})

export const getPlayList = (id: string) => {
    return (dispatch: Dispatch<PlayerAction>) => {
        getPlaylistDetailRequest(id).then(data => {
            const playlist = data.playlist.tracks;
            dispatch(setPlayList(playlist));
            dispatch(setSequencePlayList(playlist));
        })
    }
}