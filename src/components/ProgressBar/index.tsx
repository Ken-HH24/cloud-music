import React, { useEffect, useRef } from 'react'

export interface ProgressBarProps {
    initialPercentage?: number
    percentageChange?: (percentage: number) => void
}

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
    const { initialPercentage, percentageChange } = props;
    const initialPosX = useRef(0);
    const progressBarWidth = useRef(0);
    const progressInnerRef = useRef<HTMLDivElement>(null);
    const progressOuterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initialPosX.current = progressInnerRef.current!.getBoundingClientRect().x;
        progressBarWidth.current = progressOuterRef.current!.getBoundingClientRect().width;
        if (initialPercentage) {
            progressInnerRef.current!.style.width = `${Math.max(100, initialPercentage)}%`;
        }
    }, [initialPercentage])

    const updateProgressBar = (posX: number) => {
        const initialX = initialPosX.current;
        const width = progressBarWidth.current;
        const newPercentage = Math.min((posX - initialX) / width * 100, 100);
        progressInnerRef.current!.style.width = `${newPercentage}%`;
        percentageChange && percentageChange(newPercentage);
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        const posX = e.touches[0].pageX;
        updateProgressBar(posX);
    }

    const handleProgressBarClick = (e: React.MouseEvent) => {
        const posX = e.pageX;
        updateProgressBar(posX);
    }

    return (
        <div className='progress-bar-wrapper' onClick={handleProgressBarClick}>
            <div className='progress-bar-outer' ref={progressOuterRef}></div>
            <div className='progress-bar-inner' ref={progressInnerRef}>
                <div className='progress-bar-btn' onTouchMove={handleTouchMove} />
            </div>
        </div>
    )
}

export default ProgressBar;