import React, { RefObject, useEffect } from 'react'

export const useClickOutside = (ref: RefObject<HTMLElement>, fn: Function) => {
    useEffect(() => {
        const listener = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (ref.current?.contains(e.target as HTMLElement)) {
                return;
            }
            fn();
        }
        window.addEventListener('click', listener)
        return () => {
            window.removeEventListener('click', listener);
        }
    }, [ref, fn]);
}