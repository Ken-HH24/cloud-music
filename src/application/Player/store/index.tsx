import * as actionCreators from './actionCreators';
import * as PlayerTypes from './types';
import playerReducer from './reducer';

export interface IPlayerDispatchProps {
    changeSequencePlayList: (data: PlayerTypes.Song[]) => void
    changeCurrentSong: (data: PlayerTypes.Song) => void
}

const mapPlayerDispatchToProps = (dispatch: any): IPlayerDispatchProps => {
    return {
        changeSequencePlayList(data: PlayerTypes.Song[]) {
            const action = actionCreators.setSequencePlayList(data);
            dispatch(action);
        },

        changeCurrentSong(data: PlayerTypes.Song) {
            const action = actionCreators.setCurrentSong(data);
            dispatch(action);
        }
    }
}

export { playerReducer, actionCreators, PlayerTypes, mapPlayerDispatchToProps };