import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

const Icon: React.FC<FontAwesomeIconProps> = (props) => {
    const { ...restProps } = props;

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
            <FontAwesomeIcon {...restProps} />
        </div>
    )
}

export default Icon;