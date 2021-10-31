import React, { useCallback, useState } from 'react';
import { withRouter } from 'react-router';
import { RouteConfigComponentProps } from 'react-router-config';
import { CSSTransition } from 'react-transition-group';
import Header from '../../components/Header';

type SingerProps = RouteConfigComponentProps

const Singer: React.FC<SingerProps> = (props) => {
    const [showStatus, setShowStatus] = useState(true);

    const handleBack = useCallback(() => {
        setShowStatus(false);
    }, [])

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            appear={true}
            classNames='fly'
            onExited={props.history.goBack}
        >
            <div className='singer-wrapper'>
                <Header title='header' handleBack={handleBack} style={{backgroundColor: '#e74c3c'}}></Header>
            </div>
        </CSSTransition>
    )
}

export default withRouter(Singer);