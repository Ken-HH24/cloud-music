import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Loading: React.FC = () => {
    return (
        <div
            style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <FontAwesomeIcon icon='spinner' spin size='4x' />
        </div>
    )
}

export default Loading;