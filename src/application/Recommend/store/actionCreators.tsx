import { Dispatch } from 'redux';
import * as actionTypes from './constants';
import { BannerItem, RecommendItem } from './types'
import { getBannerRequest, getRecommendListRequest } from '../../../api/request';

interface IChangeBannerAction {
    type: actionTypes.CHANGE_BANNER;
    data: BannerItem[];
}

interface IChangeRecommendAction {
    type: actionTypes.CHANGE_RECOMMEND_LIST;
    data: RecommendItem[];
}

interface IChangeEnterLoading {
    type: actionTypes.CHANGE_ENTER_LOADING;
    data: boolean;
}

export const changeBannerList = (data: BannerItem[]): IChangeBannerAction => ({
    type: actionTypes.CHANGE_BANNER,
    data
});

export const changeRecommendList = (data: RecommendItem[]): IChangeRecommendAction => ({
    type: actionTypes.CHANGE_RECOMMEND_LIST,
    data
})

export const changeEnterLoading = (data: boolean): IChangeEnterLoading => ({
    type: actionTypes.CHANGE_ENTER_LOADING,
    data
})

export type RecommendAcions = IChangeBannerAction | IChangeRecommendAction | IChangeEnterLoading;

export const getBannerList = () => {
    return (dispatch: Dispatch<RecommendAcions>) => {
        getBannerRequest().then(data => {
            console.log('banner request', data);
            dispatch(changeBannerList(data.banners));
        }).catch(err => {
            console.error('error !!!', err);
        })   
    }
}

export const getRecommendList = () => {
    return (dispatch: Dispatch<RecommendAcions>) => {
        dispatch(changeEnterLoading(true));
        getRecommendListRequest().then(data => {
            console.log('recommendList', data);
            dispatch(changeRecommendList(data.result));
            dispatch(changeEnterLoading(false));
        }).catch(err => {
            console.error('error !!!', err);
        })
    }
}