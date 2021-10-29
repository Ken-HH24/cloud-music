import { AlbumActions } from './actionCreators';
import { PlayListItem } from './types';
import * as actionTypes from './constans'

export interface IAlbumState {
    playList: PlayListItem
}

const defaultAlbumState: IAlbumState = {
    playList: {
        id: 0,
        name: '',
        description: '',
        coverImgUrl: '',
        tracks: []
    }
}

const albumReducer = (state: IAlbumState = defaultAlbumState, action: AlbumActions): IAlbumState => {
    switch (action.type) {
        case actionTypes.CHANGE_PLAYLIST:
            return {
                ...state,
                playList: action.data
            }
        default:
            return state
    }
}

export default albumReducer;