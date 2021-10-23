import React from 'react';
import HorizenBar, { HorizenBarProps } from './horizenBar';
import HorizenBarItem, { HorizenBarItemProps } from './horizenBarItem';

export type IHorizenComponent = React.FC<HorizenBarProps> & {
    Item: React.FC<HorizenBarItemProps>
}

const HorizenBarComponent = HorizenBar as IHorizenComponent;
HorizenBarComponent.Item = HorizenBarItem

export default HorizenBarComponent;