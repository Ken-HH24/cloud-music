import React from 'react';
import Scroll from '../../components/Scroll';

interface HorizenBarItem {
    name: string;
    key: string;
}

export interface HorizenBarProps {
    title: string;
    items: HorizenBarItem[];
    activeItem?: string;
    handleItemClick: (key: string) => void;
}

const HorizenBar: React.FC<HorizenBarProps> = (props) => {
    const {
        title,
        items,
        activeItem,
        handleItemClick,
    } = props;

    const renderItem = () => {
        return (
            <div className='horizenbar-scroll'>
                {
                    items.map((item, index) => {
                        const classes = `horizenbar-item ${activeItem === item.key ? 'active' : ''}`;

                        return (
                            <span className={classes} key={item.key} onClick={() => { handleItemClick(item.key) }}>
                                {item.name}
                            </span>
                        )
                    })
                }
            </div>
        )
    }

    return (
        <div className='horizenbar-wrapper'>
            <span className='horizenbar-title'>
                {title}
            </span>
            <Scroll direction='X'>
                {renderItem()}
            </Scroll>
        </div>
    )
}

export default HorizenBar;
