import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import Header from '../../components/Header';

export type AlbumProps = RouteComponentProps

const Album: React.FC<AlbumProps> = (props) => {
    const [showStatus, setShowStatus] = useState(true);

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            appear={true}
            unmountOnExit
            classNames='fly'
            onExit={() => {
                setTimeout(() => {
                    props.history.goBack();
                }, 300);
            }}
        >
            <div className='album-wrapper'>
                <Header title='Album' handleBack={() => { setShowStatus(false) }}></Header>
            </div>
        </CSSTransition>

    )
}

export default withRouter(React.memo(Album));