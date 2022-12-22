import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import configureStore from './store';

import * as portfolioActions from "./store/portfolio"

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  window.store = store; //expose store to window in development
  window.portfolioActions = portfolioActions;
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
