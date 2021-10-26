import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface HeaderProps {
    title: string
    handleBack: () => void
}

const Header: React.FC<HeaderProps> = (props) => {
    const { title, handleBack } = props;
    return (
        <div className='header-wrapper'>
            <FontAwesomeIcon icon='arrow-left' className='header-back' onClick={handleBack} />
            <span className='header-title'>{title}</span>
        </div>
    )
}

export default Header;