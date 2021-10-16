import { combineReducers } from 'redux';
import { recommendReducer } from '../application/Recommend/store';

export default combineReducers({
    recommend: recommendReducer
})