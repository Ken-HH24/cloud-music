import { RankAction } from './actionCreators';
import { RankItem } from './types';
import * as actionTypes from './constants';

export interface IRankState {
    rankList: RankItem[]
}

const defaultRankState: IRankState = {
    rankList: []
}

const rankReducer = (state: IRankState = defaultRankState, action: RankAction): IRankState => {
    switch (action.type) {
        case actionTypes.CHANGE_RANK_LIST:
            return {
                ...state,
                rankList: action.data
            }
        default:
            return state
    }
}

export default rankReducer;