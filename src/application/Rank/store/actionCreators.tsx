import { Dispatch } from 'react';
import { RankTypes } from '.';
import { getRankListRequest } from '../../../api/request';
import * as actionTypes from './constants';

export interface IChangeRankListAction {
    type: actionTypes.CHANGE_RANK_LIST
    data: RankTypes.RankItem[]
}

export const changeRankList = (data: RankTypes.RankItem[]): IChangeRankListAction => ({
    type: actionTypes.CHANGE_RANK_LIST,
    data
})

export type RankAction = IChangeRankListAction;

export const getRankList = () => {
    return (dispatch: Dispatch<RankAction>) => {
        getRankListRequest().then(data => {
            console.log('rank list', data.list);
            dispatch(changeRankList(data.list));
        }).catch(err => {
            console.error('error !!!', err);
        })
    }
}