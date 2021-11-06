import * as actionTypes from './constants';
import { SingerAction } from './actionCreators';
import { Singer } from './types';

export interface ISingerState {
    singer: Singer
}

const defaultState: ISingerState = {
    singer: {
        artist: {
            name: '',
            picUrl: ''
        },
        hotSongs: []
    }
}

const singerReducer = (state: ISingerState = defaultState, action: SingerAction): ISingerState => {
    switch (action.type) {
        case actionTypes.CHANGE_SINGER:
            return {
                ...state,
                singer: action.data
            }
        default:
            return state
    }
}

export default singerReducer;