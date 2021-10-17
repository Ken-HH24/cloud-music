import React, { useState } from 'react';
import { withRouter } from 'react-router';
import HorizenBar from '../../components/HorizenBar';

const items = [
    { name: 'Ken', key: '1' },
    { name: 'Tom', key: '2' },
    { name: 'jack', key: '3' },
    { name: 'Ken', key: '4' },
    { name: 'Tom', key: '5' },
    { name: 'jack', key: '6'  },
    { name: 'Ken', key: '7'  },
    { name: 'Tom', key: '8'  },
    { name: 'jack', key: '9'  },
    { name: 'Ken', key: '10'  },
    { name: 'Tom', key: '11'  },
    { name: 'jack', key: '12'  },
    { name: 'Ken', key: '13'  },
]

const words = [
    { name: 'A', key: 'A' },
    { name: 'B', key: 'B' },
    { name: 'C', key: 'C' },
    { name: 'D', key: 'D' },
    { name: 'E', key: 'E' },
    { name: 'F', key: 'F' },
    { name: 'G', key: 'G' },
    { name: 'H', key: 'H' },
    { name: 'I', key: 'I' },
    { name: 'J', key: 'J' },
    { name: 'K', key: 'K' },
    { name: 'L', key: 'L' },
    { name: 'M', key: 'M' },
    { name: 'N', key: 'N' },
    { name: 'O', key: 'O' },
    { name: 'P', key: 'P' },
    { name: 'Q', key: 'Q' }
]

const Singers: React.FC = (props) => {
    const [singer, setSinger] = useState('');
    const [word, setWord] = useState('');

    const handleItemClick = (key: string) => {
        setSinger(key);
    }

    const handleWordClick = (key: string) => {
        setWord(key);
    }

    return (
        <div className='singers-wrapper'>
            <HorizenBar title='singers:' items={items} activeItem={singer} handleItemClick={handleItemClick} />
            <HorizenBar title='首字母:' items={words} activeItem={word} handleItemClick={handleWordClick} /> 
        </div>
    )
}

export default withRouter(Singers);