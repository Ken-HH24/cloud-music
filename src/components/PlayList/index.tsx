import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { modeToIcon } from '../../api/config';
import { IPlayerStateProps, mapPlayerStateToProps, IPlayerDispatchProps, mapPlayerDispatchToProps } from '../../application/Player/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import Scroll from '../Scroll';

interface BasePlayListProps {
    isShow: boolean
}

export type PlayListProps = BasePlayListProps & Partial<IPlayerStateProps> & Partial<IPlayerDispatchProps>

const PlayList: React.FC<PlayListProps> = (props) => {
    const {
        mode,
        isShow,
        sequencePlayList,
        changeShowPlayList
    } = props;

    const tracks = sequencePlayList!;

    const handlePlayListClose = () => {
        changeShowPlayList && changeShowPlayList(false);
    }

    return (
        <CSSTransition
            in={isShow}
            timeout={300}
            appear
            mountOnEnter
            unmountOnExit
            classNames='bottomToTop'
        >
            <div className='playList'>
                <header>
                    <FontAwesomeIcon icon={modeToIcon[mode!]} />
                    <span>{mode}</span>
                </header>
                <Scroll>
                    <main>

                        {
                            tracks.map(track => {
                                return (
                                    <div key={track.id} className='playList-track-item'>
                                        <span>{track.name}</span>
                                        <span>{track.ar[0].name}</span>
                                        <FontAwesomeIcon icon='times' className='delete' />
                                    </div>
                                )
                            })
                        }

                    </main>
                </Scroll>
                <footer>
                    <span onClick={() => { handlePlayListClose() }}>close</span>
                </footer>
            </div>
        </CSSTransition>
    )
}

export default connect(mapPlayerStateToProps, mapPlayerDispatchToProps)(PlayList);