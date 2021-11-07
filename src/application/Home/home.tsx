import React from 'react';
import Player from '../Player';
import { withRouter } from 'react-router'
import { RouteConfigComponentProps, renderRoutes } from 'react-router-config'
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface HomeProps extends RouteConfigComponentProps { }

const Home: React.FC<HomeProps> = (props) => {
    const { route } = props;
    return (
        <div>
            <div className='navbar-wrapper'>
                <span className='navbar-menu icon'><FontAwesomeIcon icon='align-justify' /></span>
                <span className='navbar-title'>Web App</span>
                <span className='navbar-search icon'><FontAwesomeIcon icon='search' /></span>
            </div>
            <div className='tap-wrapper'>
                <NavLink to='/recommend' activeClassName='selected'>
                    <div className='tab-item'>
                        <span className='tab-item-name'>推荐</span>
                    </div>
                </NavLink>
                <NavLink to='/singers' activeClassName='selected'>
                    <div className='tab-item'>
                        <span className='tab-item-name'>歌手</span>
                    </div>
                </NavLink>
                <NavLink to='/rank' activeClassName='selected'>
                    <div className='tab-item'>
                        <span className='tab-item-name'>排行</span>
                    </div>
                </NavLink>
            </div>
            {renderRoutes(route?.routes)}
            <Player />
        </div>
    )
}

export default withRouter(Home);