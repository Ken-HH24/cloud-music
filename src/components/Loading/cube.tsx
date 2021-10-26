import React from 'react';

const Cube: React.FC = () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className='cube-wrapper'>
            {
                arr.map(val => (
                    <div className={`cube-item cube-${val}`} />
                ))
            }
        </div>
    )
}

export default Cube;