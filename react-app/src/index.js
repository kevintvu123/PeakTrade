import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import configureStore from './store';

import { GroupModalProvider } from './context/GroupModal';
import { EditGroupModalProvider } from './context/EditGroupModal';
import { EditWatchlistModalProvider } from './context/EditWatchlistModal';
import { AddWatchlistStockModalProvider } from './context/AddWatchlistStockModal';

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

//ReactDOM.render is used to render a React element into the DOM (Document Object Model)
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <GroupModalProvider>
        <EditGroupModalProvider>
          <EditWatchlistModalProvider>
            <AddWatchlistStockModalProvider>
              <App />
            </AddWatchlistStockModalProvider>
          </EditWatchlistModalProvider>
        </EditGroupModalProvider>
      </GroupModalProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
