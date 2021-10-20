import React from 'react';
import Scroll from '../../components/Scroll';

interface HorizenBarItem {
    name: string;
    key: string;
}

export interface IHorizenBarProps<T> {
    title: string;
    items: T[];
    activeItem?: T;
    handleItemClick: (item: T) => void;
}

const getHorizenBar = <T extends HorizenBarItem>(): React.FC<IHorizenBarProps<T>> => {
    return (props) => {
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
                        items.map(item => {
                            const classes = `horizenbar-item ${activeItem?.key === item.key ? 'active' : ''}`;

                            return (
                                <span className={classes} key={item.key} onClick={() => { handleItemClick(item) }}>
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
}

export default getHorizenBar;
