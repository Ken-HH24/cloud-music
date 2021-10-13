import { RouteConfig } from "react-router-config";
import { Redirect } from 'react-router';
import Home from '../application/Home';
import Recommend from '../application/Recommend';

const routeConfig: RouteConfig[] = [
    {
        path: '/',
        component: Home,
        routes: [
            {
                path: '/',
                exact: true,
                render: () => (
                    <Redirect to={'/recommend'} />   
                )
            },
            {
                path: '/recommend',
                component: Recommend
            }
        ]
    }
]

export default routeConfig;