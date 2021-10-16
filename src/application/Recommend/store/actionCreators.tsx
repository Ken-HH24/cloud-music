import { Dispatch } from 'redux';
import * as actionTypes from './constants';
import { BannerItem, RecommendItem } from './types'
import { getBannerRequest, getRecommendListRequest } from '../../../api/request';

export interface IChangeBannerAction {
    type: actionTypes.CHANGE_BANNER;
    data: BannerItem[];
}

export interface IChangeRecommendAction {
    type: actionTypes.CHANGE_RECOMMEND_LIST;
    data: RecommendItem[];
}

export const changeBannerList = (data: BannerItem[]): IChangeBannerAction => ({
    type: actionTypes.CHANGE_BANNER,
    data
});

export const changeRecommendList = (data: RecommendItem[]): IChangeRecommendAction => ({
    type: actionTypes.CHANGE_RECOMMEND_LIST,
    data
})

export type RecommendAcions = IChangeBannerAction | IChangeRecommendAction;

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
        getRecommendListRequest().then(data => {
            console.log('recommendList', data);
            dispatch(changeRecommendList(data.result));
        }).catch(err => {
            console.error('error !!!', err);
        })
    }
}