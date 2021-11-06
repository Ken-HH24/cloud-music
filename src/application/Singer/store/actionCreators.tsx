import * as actionTypes from './constants';
import { SingerTypes } from '../store';
import { Dispatch } from 'redux';
import { getSingerDetailRequest } from '../../../api/request';

export interface IChangeSingerAction {
    type: actionTypes.CHANGE_SINGER,
    data: SingerTypes.Singer
}

export type SingerAction = IChangeSingerAction

const changeSinger = (data: SingerTypes.Singer): IChangeSingerAction => ({
    type: actionTypes.CHANGE_SINGER,
    data
})

export const getSingerDetail = (id: string) => {
    return (dispatch: Dispatch<SingerAction>) => {
        getSingerDetailRequest(id).then(data => {
            console.log('singer detail', data);
            const artist = data.artist;
            const hotSongs = data.hotSongs;
            dispatch(changeSinger({
                artist,
                hotSongs
            }))
        }).catch(err => {
            console.log('error !!! ', err);
        })
    }
}