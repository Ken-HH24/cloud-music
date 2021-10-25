import React, { CSSProperties } from 'react';

type LoadingTheme = 'blue' | 'red' | 'green' | 'yellow' | 'gray';

export interface LoadingProps {
    style?: CSSProperties
    className?: string
    theme?: LoadingTheme
}

const Loading: React.FC<LoadingProps> = (props) => {
    const { style, className, theme } = props;

    return (
        <div className={`loading-wrapper ${className}`} style={style}>
            <div className="sk-cube-grid">
                <div className="sk-cube sk-cube-1"></div>
                <div className="sk-cube sk-cube-2"></div>
                <div className="sk-cube sk-cube-3"></div>
                <div className="sk-cube sk-cube-4"></div>
                <div className="sk-cube sk-cube-5"></div>
                <div className="sk-cube sk-cube-6"></div>
                <div className="sk-cube sk-cube-7"></div>
                <div className="sk-cube sk-cube-8"></div>
                <div className="sk-cube sk-cube-9"></div>
            </div>
        </div>
    )
}

export default Loading;

