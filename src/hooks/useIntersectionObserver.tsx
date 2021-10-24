import React, { useEffect } from 'react';

interface IIntersectionOption {
    onIntersect: IntersectionObserverCallback;
    thresold?: number;
    rootMargin?: string;
}

export const useIntersectionObserver = (ref: React.RefObject<HTMLElement | HTMLImageElement>, option: IIntersectionOption) => {
    useEffect(() => {
        const observer = new IntersectionObserver(option.onIntersect, {
            ...option
        });
        const current = ref.current;
        if (current) {
            observer.observe(current);
        }
        return () => {
            if (current)
                observer.unobserve(current);
        }
    })
}

export default useIntersectionObserver;