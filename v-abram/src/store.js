import { applyMiddleware, createStore, compose } from 'redux';

import { logger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import axios from 'axios';

import reducer from './reducers';

const middleware = applyMiddleware(logger, thunk, promise);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(reducer, composeEnhancers(middleware));

let API_URL = 'http://localhost:3005';

if (process.env.NODE_ENV === 'production') {
  API_URL = 'https://travel.unli.xyz/api';
}
// console.log(process.env);

// async function getInitData () {
//   const values = await axios
//     .get(`${API_URL}/citiesairport/`)
//     .then((res) => {
//       return res.data.data;
//     })
//     .catch((err) => {
//       console.error("didn't get init data");
//     });
//   return values;
// }
