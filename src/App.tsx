import React from 'react';
import { HashRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import routes from './routes';
import store from './store';

import 'antd/dist/antd.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <HashRouter>
          {renderRoutes(routes)}
        </HashRouter>
      </div>
    </Provider>
  );
}

export default App;
