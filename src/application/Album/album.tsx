import React, { useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import Header from '../../components/Header';
import Scroll from '../../components/Scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type AlbumProps = RouteComponentProps

const Album: React.FC<AlbumProps> = (props) => {
    const [showStatus, setShowStatus] = useState(true);
    const [isMarquee, setIsMarquee] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    const renderDesc = () => {
        return (
            <div className='desc-wrapper'>
                <div className='album-bg' style={{ backgroundImage: "url('http://p2.music.126.net/ecpXnH13-0QWpWQmqlR0gw==/109951164354856816.jpg')" }} />
                <div className='album-desc'>
                    <img className='album-cover' alt='cover' src='http://p2.music.126.net/ecpXnH13-0QWpWQmqlR0gw==/109951164354856816.jpg' />
                    <div>
                        <span className='album-title'>title</span>
                        <span className='album-author'>author</span>
                    </div>
                </div>
                <div className='menu-wrapper'>
                    <div className='menu-item'>
                        <FontAwesomeIcon icon='comment-dots' />
                        <span>评论</span>
                    </div>
                    <div className='menu-item'>
                        <FontAwesomeIcon icon='heart' />
                        <span>点赞</span>
                    </div>
                    <div className='menu-item'>
                        <FontAwesomeIcon icon='plus' />
                        <span>收藏</span>
                    </div>
                    <div className='menu-item'>
                        <FontAwesomeIcon icon='ellipsis-v' />
                        <span>更多</span>
                    </div>
                </div>
            </div>
        )
    }

    const renderSongList = () => {
        const songItem = {
            name: 'Hello world',
            author: 'your father'
        }

        const songList = [];
        for (let i = 0; i < 20; i++) {
            songList.push(songItem);
        }

        return (
            <div className='song-list-wrapper'>
                <div className='first-line'>
                    <div>
                        <FontAwesomeIcon icon='play-circle' />
                        <span>播放全部</span>
                    </div>
                    <div>
                        <FontAwesomeIcon icon='plus' />
                        <span>收藏</span>
                    </div>
                </div>
                <div className='song-list-container'>
                    {
                        songList.map((song, index) => (
                            <div className='song-item' key={index}>
                                <span>{index + 1}</span>
                                <div className='song-info'>
                                    <span className='song-name'>{song.name}</span>
                                    <span className='song-singer'>{song.author}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

    const handleScroll = (pos: any) => {
        const minScrollY = -40;
        const percent = Math.abs(pos.y / minScrollY);
        const headerDOM = headerRef.current!;
        console.log(pos, percent);
        if (pos.y < minScrollY) {
            headerDOM.style.backgroundColor = '#e74c3c';
            headerDOM.style.opacity = Math.min(1, (percent - 1) / 2).toString();
            setIsMarquee(true);

        } else {
            headerDOM.style.backgroundColor = '';
            headerDOM.style.opacity = '1';
            setIsMarquee(false);
        }
    }

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            appear={true}
            unmountOnExit
            classNames='fly'
            onExited={props.history.goBack}
        >
            <div className='album-wrapper'>
                <Header ref={headerRef} title='Album' isMarquee={isMarquee} handleBack={() => { setShowStatus(false) }} />
                <div className='album-content'>
                    <Scroll onScroll={handleScroll}>
                        {renderDesc()}
                        {renderSongList()}
                    </Scroll>
                </div>
            </div>
        </CSSTransition>
    )
}

export default withRouter(React.memo(Album));