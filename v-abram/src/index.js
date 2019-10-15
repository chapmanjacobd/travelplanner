//fix for Material UI JSS in react-snap; JSS doesn't support hydration

// import React from 'react';
// import render from 'react-dom'
// import { loadComponents, getState } from 'react-snap-loadable-components';
// import * as Index from './components/index';

// const app = <Index />;
// const rootElement = document.getElementById('root');

// loadComponents().then(() => {
//   render(app, rootElement, () => {
//     Array.from(document.querySelectorAll('[data-jss-snap]')).forEach(elem =>
//       elem.parentNode.removeChild(elem),
//     );
//   });
// });

// window.snapSaveState = () => {
//   Array.from(document.querySelectorAll('[data-jss]')).forEach(elem =>
//     elem.setAttribute('data-jss-snap', ''),
//   );
//   return getState();
// };

import React from 'react';
import { Provider } from 'react-redux';
// import { counterApp, createStore, initialState } from 'redux';
import { render } from 'react-dom';
import { loadComponents, getState } from 'react-snap-loadable-components';
import ReduxQuerySync from 'redux-query-sync';
import JSURL from '@yaska-eu/jsurl2';
import App from './Components/App';
import {
  setOrigin,
  setLengths,
  setInitDestinations,
  setPrefAll,
  setEtc
} from './actions/exploreActions';
import { setRoute } from './actions/routerActions';
import store from './store';

const rootElement = document.getElementById('root');

const AppWithRouter = (
  <Provider store={store}>
    <App />
  </Provider>
);

loadComponents().then(() => {
  render(AppWithRouter, rootElement, () => {
    Array.from(document.querySelectorAll('[data-jss-snap]')).forEach((elem) =>
      elem.parentNode.removeChild(elem)
    );
  });
});

window.snapSaveState = () => {
  Array.from(document.querySelectorAll('[data-jss]')).forEach((elem) =>
    elem.setAttribute('data-jss-snap', '')
  );
  return getState();
};

// // Grab the state from a global variable injected into the server-generated HTML
// const preloadedState = window.__PRELOADED_STATE__;

// // Allow the passed state to be garbage-collected
// delete window.__PRELOADED_STATE__;

// // Create Redux store with initial state
// let store = createStore(AppWithRouter, preloadedState || initialState);

// // Tell react-snap how to save Redux state
// window.snapSaveState = () => ({
//   __PRELOADED_STATE__: store.getState()
// });
ReduxQuerySync({
  store, // your Redux store
  params: {
    origin: {
      selector: (store) => store.explore.origin.i,
      action: (value) => {
        if (value) {
          return setOrigin({ code: value });
        } else {
          return { type: 'NO_ACTION' };
        }
      }
    },
    states: {
      // The selector you use to get the destination string from the state object.
      selector: (store) => {
        return JSURL.stringify(store.explore.states.map((el) => el.k));
      },
      // The action creator you use for setting a new destination.
      action: (value) => {
        if (value) {
          return setInitDestinations(JSURL.parse(value));
        } else {
          return { type: 'NO_ACTION' };
        }
      }
    },
    prefs: {
      selector: (store) => {
        return JSURL.stringify(store.explore.prefs);
      },
      action: (value) => {
        if (value) {
          return setPrefAll(JSURL.parse(value));
        } else {
          return { type: 'NO_ACTION' };
        }
      }
    },
    totals: {
      selector: (store) => {
        return JSURL.stringify({
          prevdestination: store.explore.prevDestination,
          current_index: store.explore.current_index,
          totallength: store.explore.totalLength,
          totalprice: store.explore.totalPrice,
          totaladult: store.explore.totalAdult,
          totalchildren: store.explore.totalChildren
        });
      },
      action: (value) => {
        if (value) {
          return setEtc(JSURL.parse(value));
        } else {
          return { type: 'NO_ACTION' };
        }
      }
    },
    lengths: {
      selector: (store) => JSURL.stringify(store.explore.lengths),
      action: (value) => {
        if (value) {
          return setLengths(JSURL.parse(value));
        } else {
          return { type: 'NO_ACTION' };
        }
      }
    },
    page: {
      selector: (store) => store.router.current,
      action: (value) => {
        if (value) {
          return setRoute(value);
        } else {
          return setRoute('INIT_VIEW');
        }
      }
    }
  },
  // Initially set the store's state to the current url location.
  initialTruth: 'location'
});
