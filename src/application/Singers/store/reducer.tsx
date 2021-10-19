import { SingersAction } from './actionCreators';
import { AlphaItem, ArtistItem, SingerTagItem } from './types';
import * as actionTypes from './constants';
import { getAlphaList, getTagList } from '../../../api/utils';

export interface ISingersState {
    singerTagList: SingerTagItem[];
    alphaList: AlphaItem[];
    singerList: ArtistItem[];
    page: number;
    pageSize: number;
}

const defaultState: ISingersState = {
    singerTagList: getTagList(),
    alphaList: getAlphaList(),
    singerList: [],
    page: 1,
    pageSize: 30
}

const singersReducer = (state: ISingersState = defaultState, action: SingersAction): ISingersState => {
    switch (action.type) {
        case actionTypes.CHANGE_SINGER_LIST:
            return {
                ...state,
                singerList: action.data
            }
        case actionTypes.CHANGE_PAGE:
            return {
                ...state,
                page: action.data
            }
        case actionTypes.ADD_SINGER_LIST:
            return {
                ...state,
                singerList: [...state.singerList, ...action.data]
            }
        default:
            return state;
    }
}

export default singersReducer;