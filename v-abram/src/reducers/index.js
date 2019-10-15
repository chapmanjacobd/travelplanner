import { combineReducers } from 'redux';

import explore from './exploreReducer';
import router from './routerReducer';
import passport from './passportReducer';

//import origin from "./originReducer"

export default combineReducers({
  explore,
  router,
  passport,
});
