import { combineReducers } from 'redux';
import { recommendReducer } from '../application/Recommend/store';
import { singersReducer } from '../application/Singers/store';
import { rankReducer } from '../application/Rank/store';

export default combineReducers({
    recommend: recommendReducer,
    singers: singersReducer,
    rank: rankReducer
})