import React, { useContext } from 'react';
import { HorizenBarContext } from './horizenBar';

export interface HorizenBarItemProps {
    index?: string;
}

const HorizenBarItem: React.FC<HorizenBarItemProps> = (props) => {
    const {
        index,
        children
    } = props;

    const horizenBarContext = useContext(HorizenBarContext);
    const classes = `horizenbar-item ${horizenBarContext.activeIndex === index ? 'active' : ''}`

    const handleItemClick = () => {
        horizenBarContext.handleItemClick(index || '');
    }

    return (
        <div className={classes} onClick={handleItemClick}>
            {children}
        </div>
    )
}

HorizenBarItem.displayName = 'HorizenBarItem';
export default HorizenBarItem;