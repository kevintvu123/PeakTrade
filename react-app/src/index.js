import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import configureStore from './store';
import { GroupModalProvider } from './context/GroupModal';

import * as portfolioActions from "./store/portfolio"
import * as groupActions from "./store/group"

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  window.store = store; //expose store to window in development
  window.portfolioActions = portfolioActions;
  window.groupActions = groupActions;
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <GroupModalProvider>
        <App />
      </GroupModalProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
