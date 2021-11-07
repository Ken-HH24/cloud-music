import { combineReducers } from 'redux';
import { recommendReducer } from '../application/Recommend/store';
import { singersReducer } from '../application/Singers/store';
import { rankReducer } from '../application/Rank/store';
import { albumReducer } from '../application/Album/store';
import { playerReducer } from '../application/Player/store';
import { singerReducer } from '../application/Singer/store';

export default combineReducers({
    recommend: recommendReducer,
    singers: singersReducer,
    rank: rankReducer,
    album: albumReducer,
    singer: singerReducer,
    player: playerReducer
})