import { Dispatch } from 'redux';
import { getPlaylistDetailRequest } from '../../../api/request';
import * as actionTypes from './constans';
import { PlayListItem } from './types';

export interface IChangePlaylistAction {
    type: actionTypes.CHANGE_PLAYLIST
    data: PlayListItem
}

export const changePlaylist = (data: PlayListItem): IChangePlaylistAction => ({
    type: actionTypes.CHANGE_PLAYLIST,
    data
})

export type AlbumActions = IChangePlaylistAction;

export const getPlaylist = (id: string) => {
    return (dispatch: Dispatch<AlbumActions>) => {
        getPlaylistDetailRequest(id).then(res => {
            const playlist = res.playlist;
            console.log('playlist detail', playlist);
            dispatch(changePlaylist(playlist));
        }).catch(err => {
            console.log('error!!!', err);
        })
    }
}