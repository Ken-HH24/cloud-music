import { Dispatch } from 'redux';
import { getSingerListRequest } from '../../../api/request';
import { getTypeByKey, getAreaByKey } from '../../../api/utils';
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

interface IChangeActiveSingerTagAction {
    type: actionTypes.CHANGE_ACTIVE_SINGER_TAG;
    data: string;
}

interface IChangeInitialAction {
    type: actionTypes.CHANGE_INITIAL
    data: string
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

export const changeActiveSingerTag = (data: string): IChangeActiveSingerTagAction => ({
    type: actionTypes.CHANGE_ACTIVE_SINGER_TAG,
    data
})

export const changeInitial = (data: string): IChangeInitialAction => ({
    type: actionTypes.CHANGE_INITIAL,
    data
})

export type SingersAction = IChangeSingerListAction | IChangeSingersPageAction | IAddSingerListAction | IChangeActiveSingerTagAction | IChangeInitialAction;

export const getSingerList = (key: string, alpha: string) => {
    const type = getTypeByKey(key);
    const area = getAreaByKey(key);
    const initial = alpha;

    return (dispatch: Dispatch<SingersAction>) => {
        getSingerListRequest(type, area, initial).then(data => {
            console.log('singer list', data.artists);
            dispatch(changeSingerList(data.artists))
        }).catch(err => {
            console.error('error !!!', err);
        })
    }
}

export const getMoreSingerList = (key: string, alpha: string, offset: number) => {
    const type = getTypeByKey(key);
    const area = getAreaByKey(key);
    const initial = alpha;

    return (dispatch: Dispatch<SingersAction>) => {
        getSingerListRequest(type, area, initial, offset).then(data => {
            console.log('singer list', data.artists);
            dispatch(addSingerList(data.artists));
        }).catch(err => {
            console.error('error !!!', err);
        })
    }
}