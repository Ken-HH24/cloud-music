import { RecommendAcions } from './actionCreators'
import { RecommendTypes } from '.';
import * as actionTypes from './constants';

const defaultState: RecommendTypes.IRecommendState = {
    bannerList: [],
    recommendList: []
}

const recommendReducer = (state: RecommendTypes.IRecommendState = defaultState, action: RecommendAcions): RecommendTypes.IRecommendState => {
    switch (action.type) {
        case actionTypes.CHANGE_BANNER:
            return {
                ...state,
                bannerList: action.data
            }
        
        case actionTypes.CHANGE_RECOMMEND_LIST:
            return {
                ...state,
                recommendList: action.data
            }
        
        default:
            return state;
    }
}

export default recommendReducer;