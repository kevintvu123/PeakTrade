import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import configureStore from './store';

import { GroupModalProvider } from './context/GroupModal';
import { EditGroupModalProvider } from './context/EditGroupModal';
import { EditWatchlistModalProvider } from './context/EditWatchlistModa';

import * as portfolioActions from "./store/portfolio"
import * as groupActions from "./store/group"
import * as watchlistActions from "./store/watchlist"

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  window.store = store; //expose store to window in development
  window.portfolioActions = portfolioActions;
  window.groupActions = groupActions;
  window.watchlistActions = watchlistActions;
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <GroupModalProvider>
        <EditGroupModalProvider>
          <EditWatchlistModalProvider>
            <App />
          </EditWatchlistModalProvider>
        </EditGroupModalProvider>
      </GroupModalProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
