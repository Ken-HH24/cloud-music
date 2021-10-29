import React, { useEffect, useRef, useState, forwardRef, useMemo } from 'react';
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';
import PullUp from '@better-scroll/pull-up';
import ObserveDOM from '@better-scroll/observe-dom'
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
import { debounce, throttle } from '../../api/utils';

export interface ScrollInterface {
    direction?: 'X' | 'Y';
    onScroll?: Function;
    onPullUp?: Function;
    onPullDown?: Function;
    children?: React.ReactNode;
    pullingDownLoading?: boolean;
    pullingUpLoading?: boolean;
}

BScroll.use(ObserveDOM);
BScroll.use(PullDown);
BScroll.use(PullUp);

const Scroll = forwardRef<HTMLElement, ScrollInterface>((props, ref) => {
    const {
        direction,
        onPullUp,
        onScroll,
        onPullDown,
        children,
        pullingDownLoading,
        pullingUpLoading
    } = props;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollObj, setScrollObj] = useState<BScrollConstructor>();

    const initScroll = () => {
        const scroll = new BScroll(scrollContainerRef.current as HTMLDivElement, {
            probeType: 3,
            click: true,
            observeDOM: true,
            scrollX: direction === 'X',
            scrollY: direction === 'Y',
            bounce: {
                top: true,
                bottom: true
            },

            pullDownRefresh: {
                threshold: 60,
                stop: 60
            },

            pullUpLoad: {
                threshold: 60,
                stop: 60
            }

        });
        setScrollObj(scroll);
    }

    const pullUpDebounce = useMemo(() => {
        return debounce(onPullUp, 300);
    }, [onPullUp])

    const scrollThrottle = useMemo(() => {
        return throttle(onScroll, 100);
    }, [onScroll]);

    const handlePullDown = () => {
        onPullDown && onPullDown();
        setTimeout(() => {
            scrollObj?.finishPullDown();
            scrollObj?.refresh();
        }, 500);
    }

    const handlePullUp = async () => {
        pullUpDebounce && pullUpDebounce();
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
        if (!scrollObj || !scrollThrottle) {
            return;
        } else {
            scrollObj.on('scroll', (scrollEvent: Event) => {
                scrollThrottle(scrollEvent)
            });

            return () => {
                scrollObj.off('scroll');
            }
        }
    }, [scrollObj, scrollThrottle]);

    useEffect(() => {
        if (!scrollObj || !handlePullDown) {
            return;
        } else {
            scrollObj.on('pullingDown', handlePullDown);
            return () => {
                scrollObj.off('pullingDown');
            }
        }
    }, [scrollObj, onPullDown]);

    useEffect(() => {
        if (!scrollObj || !handlePullUp) {
            return;
        } else {
            scrollObj.on('pullingUp', handlePullUp);
            return () => {
                scrollObj.off('pullingUp');
            }
        }
    }, [scrollObj, onPullUp]);


    return (
        <div
            className='scroll-wrapper'
            ref={scrollContainerRef}
        >
            {
                direction === 'X' ? children
                    : (
                        <div>
                            {pullingDownLoading && <div className='pullDown-wrapper'>Loading ... ...</div>}
                            {children}
                            {pullingUpLoading && <div className='pullUp-wrapper'>Loading ... ...</div>}
                        </div>
                    )
            }
        </div>
    )
})

Scroll.defaultProps = {
    direction: 'Y'
}

export default Scroll;