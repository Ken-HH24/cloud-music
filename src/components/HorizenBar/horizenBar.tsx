import React, { createContext, CSSProperties, useState } from 'react';
import Scroll from '../Scroll';
import { HorizenBarItemProps } from './horizenBarItem';

export interface HorizenBarProps {
    title?: string
    style?: CSSProperties
    defaultActiveIndex?: string;
    onSelect?: (index: string) => void;
}

export interface IHorizenBarContext {
    activeIndex: string;
    handleItemClick: (index: string) => void;
}

export const HorizenBarContext = createContext<IHorizenBarContext>({
    activeIndex: '',
    handleItemClick: () => { }
})

const HorizenBar: React.FC<HorizenBarProps> = (props) => {
    const {
        title,
        style,
        defaultActiveIndex,
        onSelect,
        children
    } = props;

    const [activeIndex, setActiveIndex] = useState(defaultActiveIndex || '');

    const handleItemClick = (index: string) => {
        onSelect && onSelect(index);
        setActiveIndex(index);
    }

    const renderChildren = () => {
        return React.Children.map(children, (child, i) => {
            const childrenElement = child as React.FunctionComponentElement<HorizenBarItemProps>;
            const index = childrenElement.props.index || i.toString();
            return React.cloneElement(childrenElement, {
                index
            })
        })
    }

    return (
        <div className='horizenbar-wrapper' style={style}>
            {
                title &&
                (
                    <span className='horizenbar-title'>
                        {title}
                    </span>
                )
            }
            <Scroll direction='X'>
                <HorizenBarContext.Provider value={{ activeIndex, handleItemClick }}>
                    <div className='horizenbar-scroll'>
                        {renderChildren()}
                    </div>
                </HorizenBarContext.Provider>
            </Scroll>
        </div>
    )
}

export default HorizenBar;