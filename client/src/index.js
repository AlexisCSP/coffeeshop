import React from 'react';
import {render} from 'react-dom';
import './index.css';
import App from './App';
import Room from './components/Room';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import { roomReducer } from './components/Room';

const reducers = combineReducers({
  room: roomReducer
})

const store = createStore(reducers);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();

export { store }
