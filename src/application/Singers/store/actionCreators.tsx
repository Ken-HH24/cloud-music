import { Dispatch } from 'redux';
import { getSingerListRequest } from '../../../api/request';
import { getAreaByTag, getTypeByTag } from '../../../api/utils';
import * as actionTypes from './constants';
import { AlphaItem, ArtistItem, SingerTagItem } from './types';

interface IChangeSingerListAction {
    type: actionTypes.CHANGE_SINGER_LIST;
    data: ArtistItem[];
}

interface IChangeSingersPageAction {
    type: actionTypes.CHANGE_PAGE;
    data: number;
}

interface IAddSingerListAction {
    type: actionTypes.ADD_SINGER_LIST;
    data: ArtistItem[];
}

export const changeSingerList = (data: ArtistItem[]): IChangeSingerListAction => ({
    type: actionTypes.CHANGE_SINGER_LIST,
    data
})

export const changeSingerPage = (data: number): IChangeSingersPageAction => ({
    type: actionTypes.CHANGE_PAGE,
    data
})

export const addSingerList = (data: ArtistItem[]): IAddSingerListAction => ({
    type: actionTypes.ADD_SINGER_LIST,
    data
})

export type SingersAction = IChangeSingerListAction | IChangeSingersPageAction | IAddSingerListAction;

export const getSingerList = (singerTag: SingerTagItem, alpha: AlphaItem) => {
    const type = getTypeByTag(singerTag);
    const area = getAreaByTag(singerTag);
    const initial = alpha.name;

    return (dispatch: Dispatch<SingersAction>) => {
        getSingerListRequest(type, area, initial).then(data => {
            console.log('singer list', data.artists);
            dispatch(changeSingerList(data.artists))
        }).catch(err => {
            console.error('error !!!', err);
        })
    }
}

export const getMoreSingerList = (singerTag: SingerTagItem, alpha: AlphaItem, offset: number) => {
    const type = getTypeByTag(singerTag);
    const area = getAreaByTag(singerTag);
    const initial = alpha.name;

    return (dispatch: Dispatch<SingersAction>) => {
        getSingerListRequest(type, area, initial, offset).then(data => {
            console.log('singer list', data.artists);
            dispatch(addSingerList(data.artists));
        }).catch(err => {
            console.error('error !!!', err);
        })
    }
}