import React, { useEffect, useRef, useState, forwardRef } from 'react';
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';
import PullUp from '@better-scroll/pull-up';
import ObserveDOM from '@better-scroll/observe-dom'
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';

export interface ScrollInterface {
    onScroll?: Function;
    onPullUp?: Function;
    onPullDown?: Function;
    children?: React.ReactNode;
}

BScroll.use(ObserveDOM);
BScroll.use(PullDown);
BScroll.use(PullUp);

const Scroll = forwardRef<HTMLElement, ScrollInterface>((props, ref) => {
    const {
        onPullUp,
        onScroll,
        onPullDown,
        children
    } = props;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollObj, setScrollObj] = useState<BScrollConstructor>();
    
    const initScroll = () => {
        const scroll = new BScroll(scrollContainerRef.current as HTMLDivElement, {
            probeType: 3,
            click: true,
            observeDOM: true,
            bounce: {
                top: true,
                bottom: true
            },

            pullDownRefresh: {
                threshold: 70,
                stop: 0
            },

            pullUpLoad: {
                threshold: 90,
                stop: 10
            }
      
        });
        setScrollObj(scroll);
    }

    const pullDown = () => {
        onPullDown && onPullDown();
        setTimeout(() => {
            scrollObj?.finishPullDown();
            scrollObj?.refresh();
        }, 500);
    }

    const pullUp = async () => {
        onPullUp && onPullUp();
        setTimeout(() => {
            scrollObj?.finishPullUp();
            scrollObj?.refresh();
        }, 500);
    }

    useEffect(() => {
        initScroll();
        return () => {
            scrollObj?.destroy();
        }
    }, []);

    useEffect(() => {
        if (!scrollObj || !onScroll) {
            return;
        } else {
            scrollObj.on('scroll', (scroll: Event) => {
                onScroll(scroll);
            });

            return () => {
                scrollObj.off('scroll');
            }
        }
    }, [scrollObj, onScroll]);

    useEffect(() => {
        if (!scrollObj || !pullDown) {
            return;
        } else {
            scrollObj.on('pullingDown', pullDown);
            return () => {
                scrollObj.off('pullingDown');
            }
        }
    }, [scrollObj, onPullDown]);

    useEffect(() => {        
        if (!scrollObj || !pullUp) {
            return;
        } else {
            scrollObj.on('pullingUp', pullUp);
            return () => {
                scrollObj.off('pullingUp');
            }
        }
    }, [scrollObj, onPullUp]);
    

    return (
        <div
            ref={scrollContainerRef}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }}
        >
            {children}
        </div>
    )
})

export default Scroll;