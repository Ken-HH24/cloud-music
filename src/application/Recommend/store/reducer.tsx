import { RecommendAcions } from './actionCreators'
import { RecommendTypes } from '.';
import * as actionTypes from './constants';

export interface IRecommendState {
    bannerList: RecommendTypes.BannerItem[];
    recommendList: RecommendTypes.RecommendItem[];
    enterLoading: boolean;
}

const defaultState: IRecommendState = {
    bannerList: [],
    recommendList: [],
    enterLoading: true
}

const recommendReducer = (state: IRecommendState = defaultState, action: RecommendAcions): IRecommendState => {
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
        
        case actionTypes.CHANGE_ENTER_LOADING:
            return {
                ...state,
                enterLoading: action.data
            }
        
        default:
            return state;
    }
}

export default recommendReducer;