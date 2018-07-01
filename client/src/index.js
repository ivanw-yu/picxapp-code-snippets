import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import reduxThunk from 'redux-thunk';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import reducers from './reducers';
import App from './components/App.js';

const store = createStore(reducers, {users: [], photos: [], user: null, search: {keywords: '', category: 'photos', page: 1, count: 0}}, applyMiddleware(reduxThunk));
ReactDOM.render(<Provider store = {store}>
                  <App />
                </Provider>,
                document.querySelector("#root"));
