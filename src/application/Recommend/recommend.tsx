import React from 'react';
import { withRouter } from 'react-router';
import Slider from '../../components/slider';

const Recommend: React.FC = (props) => {
    return (
        <div>
            <Slider></Slider>
        </div>
    )
}

export default withRouter(Recommend);