import React, { CSSProperties, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface HeaderProps {
    title: string
    handleBack: () => void
    isMarquee?: boolean
    style?: CSSProperties
}

const Header = forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
    const { title, handleBack, isMarquee, style } = props;

    return (
        <div className='header-wrapper' ref={ref} style={style}>
            <FontAwesomeIcon icon='arrow-left' className='header-back' onClick={handleBack} />
            {
                isMarquee ? <div className='header-marquee'><span>{title}</span></div>
                    : <span className='header-title'>{title}</span>
            }
        </div>
    )
})

Header.defaultProps = {
    isMarquee: false
}

export default React.memo(Header);