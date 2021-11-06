import * as actionTypes from './constants';
import { SingerTypes } from '../store';
import { Dispatch } from 'redux';
import { getSingerDetailRequest } from '../../../api/request';

export interface IChangeSingerAction {
    type: actionTypes.CHANGE_SINGER,
    data: SingerTypes.Singer
}

export interface IChangeLoadingAction {
    type: actionTypes.CHANGE_LOADING,
    data: boolean
}

export type SingerAction = IChangeSingerAction | IChangeLoadingAction

const changeSinger = (data: SingerTypes.Singer): IChangeSingerAction => ({
    type: actionTypes.CHANGE_SINGER,
    data
})

const changeLoading = (data: boolean): IChangeLoadingAction => ({
    type: actionTypes.CHANGE_LOADING,
    data
})

export const getSingerDetail = (id: string) => {
    return (dispatch: Dispatch<SingerAction>) => {
        dispatch(changeLoading(true));
        getSingerDetailRequest(id).then(data => {
            console.log('singer detail', data);
            const artist = data.artist;
            const hotSongs = data.hotSongs;
            dispatch(changeSinger({
                artist,
                hotSongs
            }))
            dispatch(changeLoading(false))
        }).catch(err => {
            console.log('error !!! ', err);
        })
    }
}