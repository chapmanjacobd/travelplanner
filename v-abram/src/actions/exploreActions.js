import axios from 'axios';
import queryString from 'query-string';
import store from '../store.js';
import debug from '../Components/Misc/Debug';

let API_URL = 'http://localhost:3005';
if (process.env.NODE_ENV === 'production') {
  API_URL = 'https://travel.unli.xyz/api';
}

function incrementCurrentIndex(){
  return { type: 'INCREMENT_CURRENT_INDEX' };
}

function setCurrentIndex(payload){
  return { type: 'SET_CURRENT_INDEX', payload: { index: payload.index } };
}

export function setBudget(budget){
  return { type: 'SET_BUDGET', budget: budget };
}
export function setStartTripDate(date){
  return { type: 'START_TRIP_DATE', date: date };
}
export function setEndTripDate(date){
  return { type: 'END_TRIP_DATE', date: date };
}
export function setPref(pref){
  return { type: 'SET_PREF', pref: { type: pref.type, value: pref.value } };
}
export function setPrefAll(payload){
  return { type: 'SET_PREF_ALL', payload };
}
export function setEtc(payload){
  return { type: 'SET_ETC', payload };
}
export function setDuration(duration){
  return { type: 'SET_DURATION', duration: duration };
}

export function setACnumberOnExplore(totalA, totalC){
  return { type: 'AC_UPDATE', totalA, totalC };
}

export function setLengthOfStay(length){
  return { type: 'SET_LENGTH_STAY', length };
}

export function recalculateCostPerDay(){
  return { type: 'RECALCULATE_COST_PER_DAY' };
}

export function cityExistsName(city){
  if (city === '') {
    return {};
  }
  const cities_airport = store.getState().explore.cities_airport;
  //console.log(city);
  return cities_airport.find((el) => {
    return el.n === city.name && el.c === city.country;
  });
}

export function cityExistsCode(city){
  if (city === '') {
    return {};
  }
  const cities_airport = store.getState().explore.cities_airport;
  return cities_airport.find((el) => {
    return el.i === city;
  });
}

export function setNumPeople(people){
  return (dispatch) => {
    dispatch({
      type: 'SET_NUM_PEOPLE',
      payload: people
    });
  };
}

function refreshDayPrices(){
  return {
    type: 'REFRESH_DAY_PRICES'
  };
}

function refreshLegPrices(){
  return {
    type: 'REFRESH_LEG_PRICES'
  };
}

function initSetLength(payload){
  return { type: 'SET_LENGTH', payload: payload };
}
export function setLengths(lengths){
  if (lengths) {
    return (dispatch) => {
      let i = 0;
      for (i; i < lengths.length; i++) {
        dispatch(initSetLength({ index: i, value: lengths[i] }));
      }
      dispatch(refreshDayPrices());
      dispatch(refreshLegPrices());
    };
  } else {
    return {
      type: 'NO_ACTION'
    };
  }
}
export function setInitDestinations(destinations){
  return (dispatch) => {
    try {
      let stringifiedDestinations = JSON.stringify(destinations);
      // %2B is the unicode method of escaping out +. so the server just interprets it as '+'.
      stringifiedDestinations = stringifiedDestinations.replace(/\+/g, '%2B');
      axios.get(`${API_URL}/initCities/?cities=${stringifiedDestinations}`).then((res) => {
        // console.log("API RESPONSE",res)
        if (res.data.length) {
          res.data.forEach((city, i) => {
            console.log(city);
            dispatch({
              type: 'SET_DESTINATION',
              payload: {
                value: city,
                index: i
              }
            });
            if (i === res.data.length - 1)
              dispatch(fetchRouteFrom({ city: city.i, index: i, value: city }));
            dispatch(incrementCurrentIndex());
          });
        } else {
          dispatch({ type: 'NO_ACTION' });
        }
      });
      // console.log(res)
    } catch (e) {
      console.error(e);
    }
  };
}
export function setPrevDestination(payload){
  return {
    type: 'SET_PREV_DESTINATION',
    payload
  };
}
export function initSetDestination({ city, index }){
  return {
    type: 'SET_DESTINATION',
    payload: {
      value: city,
      index: index
    }
  };
}

export function setOrigin(origin){
  return (dispatch) => {
    // new Promise(function(resolve,reject){
    //console.log(origin);
    if (cityExistsCode(origin.code)) {
      dispatch({
        type: 'SET_ORIGIN',
        payload: cityExistsCode(origin.code)
      });
      dispatch(fetchRouteFrom({ code: origin.code }));
    }
    dispatch({
      type: 'SET_ORIGIN',
      payload: {}
    });
    // })
  };
}
function dateReformatter(date){
  //console.log(date);
}
export function setStartDate(date){
  const dateReformatted = dateReformatter(date);
  return {
    type: 'SET_START_DATE',
    payload: date
  };
}
export function setEndDate(date){
  const dateReformatted = dateReformatter(date);
  return {
    type: 'SET_END_DATE',
    payload: date
  };
}

export function setComfortLevel(comfort){
  return {
    type: 'SET_COMFORT_LEVEL',
    payload: comfort
  };
}

export function addDestination(){
  return (dispatch, getStore) => {
    dispatch({ type: 'ADD_DESTINATION' });
    dispatch(incrementCurrentIndex());
    // add current display length to lengths
  };
}

export function setDestination(payload){
  return async (dispatch, getStore) => {
    try {
      console.log(payload);
      console.log(payload.index, 'PAYLOAD CHECKER!');
      payload.index =
        payload.index !== undefined ? payload.index : getStore().explore.current_index + 1;
      console.log(payload.index, 'PAYLOAD CHECKER!');
      // console.log(`${API_URL}/getcity?k=${payload.k.replace(/\+/g, '%2B')}`);
      const { data } = await axios.get(`${API_URL}/getcity?k=${payload.k.replace(/\+/g, '%2B')}`);
      payload.value = data;
      if (payload.value) {
        dispatch({
          type: 'SET_DESTINATION',
          payload
        });
        dispatch(refreshDayPrice(payload));
        dispatch(refreshLegPrice(payload));
        dispatch(fetchRouteFrom(payload));
        dispatch(setLength(payload, 'setDestination'));
        // dispatch(refreshConnectionValid(payload))
        if (payload.index !== -1) {
          dispatch(fetchRouteLink(payload, 'SET_DESTINATION'));
          dispatch(setCurrentIndex(payload));
        }
      }
      dispatch({ type: 'No City from Api to be selected. ERROR.' });
    } catch (e) {
      console.log(e);
    }
  };
}

// export function setDestination (payload) {
//   return (dispatch, getStore) => {
//     if (cityExistsCode(payload.city)) {

//       // this will use an ajax call to the api and grab it using the K value of the city.
//       console.log('setDestination', payload);
//       payload.index = payload.index !== undefined ? payload.index : getStore().explore.current_index + 1;
//       dispatch({
//         type: 'SET_DESTINATION',
//         payload: {
//           value: cityExistsCode(payload.city),
//           index: payload.index,
//         },
//       });
//       dispatch(refreshDayPrice({ value: cityExistsCode(payload.city), index: payload.index }));
//       dispatch(refreshLegPrice({ index: payload.index }));
//       dispatch(refreshConnectionValid(payload));
//       if (payload.index !== 0) {
//         dispatch(fetchRouteLink(payload, 'SET_DESTINATION'));
//         dispatch(setCurrentIndex(payload));
//       }
//       // dispatch(incrementCurrentIndex())
//       dispatch(fetchRouteFrom({ ...payload, value: cityExistsCode(payload.city) }));
//       dispatch(setLength(payload, 'setDestination'));
//       // set lenght of destionation from currently displayed thing.
//     } else {
//       dispatch({
//         type: 'Undefined',
//       });
//     }
//   };
// }

export function popDestination(){
  return {
    type: 'POP_DESTINATION'
  };
}

export function removeDestination(payload){
  return (dispatch) => {
    dispatch({ type: 'REMOVE_DESTINATION', payload: { index: payload } });
    // dispatch(refreshConnectionValid(payload));
  };
}

export function setLength(payload, parentFunction){
  // //console.log(payload)

  return (dispatch, getStore) => {
    payload.value = payload.index !== 0 ? getStore().explore.displayedLengthOfStay : 0;
    dispatch({ type: 'SET_LENGTH', payload: payload });
    if (!parentFunction) {
      dispatch(refreshDayPrice(payload));
      dispatch(refreshLegPrice(payload));
      dispatch(fetchRouteLink(payload, 'SET_LENGTH'));
    }
  };
}

function refreshDayPrice(payload){
  return {
    type: 'REFRESH_DAY_PRICE',
    payload: payload
  };
}

function refreshLegPrice(payload){
  return {
    type: 'REFRESH_LEG_PRICE',
    payload: payload
  };
}

// function refreshConnectionValid (payload) {
//   return {
//     type: 'REFRESH_CONNECTION_VALID',
//     payload: payload,
//   };
// }

//use thunks to set price per day. after setting length or setting setting destination, return a function to set the price per day

export function toggleOriginToRouteMode(){
  return (dispatch, getState) => {
    dispatch({ type: 'TOGGLE_ORIGIN_TO_ROUTE_MODE' });
    if (getState().explore.route_to_origin.mode) {
      dispatch(fetchToOriginRoute());
    }
  };
}

function fetchRouteBegin(payload){
  return {
    type: 'FETCH_ROUTE_BEGIN'
  };
}

function fetchRouteSuccess(payload){
  return (dispatch, getStore) => {
    dispatch({
      type: 'FETCH_ROUTE_SUCCESS',
      payload: payload
    });
    dispatch({ type: 'SORT_ROUTES' });
  };
}

function fetchRouteFailure(payload){
  return {
    type: 'FETCH_ROUTE_FAILURE'
  };
}

function fetchToOriginRoute(subreddit){
  // This will send status is loading, then fetch, then update store with
  // the fetched data and the resulting status.
  return (dispatch, getState) => {
    dispatch(fetchRouteBegin());
    let to_city = String(getState().explore.origin.n) + ',' + String(getState().explore.origin.c);
    let from_city =
      String(getState().explore.states[getState().explore.states.length - 1].n) +
      ',' +
      String(getState().explore.states[getState().explore.states.length - 1].c);
    return axios
      .get(`${API_URL}/routeprices/{"to_city":"${to_city}","from_city":"${from_city}"}`)
      .then((response) => {
        // //console.log(response)
        if (response.status === 200) {
          if (response.data.data[0]) {
            let route = response.data.data[0];
            let price = response.data.data[0].price;
            dispatch(fetchRouteSuccess({ route: route, price: price }));
          }
        } else {
          dispatch(fetchRouteFailure());
        }
      })
      .catch((err) => {
        dispatch(fetchRouteFailure());
      });
  };
}

function getCityName(getStore, index){
  // //console.log(index)
  return getStore().explore.states[index].i;
}

function daysUntilStartOfLeg(getStore, index){
  let days_from_start_date = 0;
  let lengths = getStore().explore.lengths;
  let i = 0;
  while (i < index) {
    days_from_start_date += lengths[i];
    i++;
  }
  return days_from_start_date;
}

function addDays(date, days, string){
  // //console.log(date)
  var result = new Date(date);
  // //console.log(result)
  result.setDate(result.getDate() + days);
  if (string) {
    var dd = result.getDate();
    let mm = result.getMonth() + 1;
    var yyyy = result.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    result = dd + '/' + mm + '/' + yyyy;
    //console.log(result);
    return result;
  }
  return result;
}

function getDate(getStore, index){
  let from_date = addDays(getStore().explore.start_date, daysUntilStartOfLeg(getStore, index));
  let dd = from_date.getDate();
  let mm = from_date.getMonth() + 1; //January is 0!
  let yyyy = from_date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  //use periods because sending JSON objects over URL's doesn't work for some reason.
  return dd + '.' + mm + '.' + yyyy;
}

function fetchRouteLink(payload, action_parent){
  return (dispatch, getStore) => {
    if (
      (payload.index === getStore().explore.kiwi_links_historical.length - 1 ||
        payload.index === 0) &&
      action_parent === 'SET_LENGTH'
    ) {
      dispatch({
        type: 'NO_FETCH'
      });
    } else {
      dispatch(fetchRouteLinkBegin(payload));
      let to_city = '';
      let from_city = '';
      if (payload.index === 0 && action_parent === 'SET_DESTINATION') {
        to_city = getCityName(getStore, payload.index);
        from_city = getStore().explore.origin.i;
      } else {
        to_city = getCityName(getStore, payload.index);
        from_city = getCityName(getStore, payload.index - 1);
      }

      let from_date = getDate(getStore, payload.index);
      let to_date = from_date;

      //do api call, response --> put it into the link.
      // //console.log(`${API_URL}/routelinks/${JSON.stringify({to_city,from_city,from_date,to_date})}`)
      axios
        .get(`${API_URL}/routelinks/${JSON.stringify({ to_city, from_city, from_date, to_date })}`)
        .then((response) => {
          // //console.log(response)
          if (response.status === 200) {
            dispatch(
              fetchRouteLinkSuccess({
                link: response.data.route_link,
                price: response.data.price,
                index: payload.index
              })
            );
          } else {
            dispatch(
              fetchRouteLinkFailure({
                payload: {
                  index: payload.index
                }
              })
            );
          }
        })
        .catch((err) => dispatch({ type: 'FETCH_ROUTE_LINK_FAILTURE', err }));
    }
  };
}

function fetchRouteLinkSuccess(payload){
  return {
    type: 'FETCH_ROUTE_LINK_SUCCESS',
    payload
  };
}
function fetchRouteLinkFailure(payload){
  return {
    type: 'FETCH_ROUTE_LINK_FAILURE',
    payload
  };
}
function fetchRouteLinkBegin(payload){
  return {
    type: 'FETCH_ROUTE_LINK_BEGIN',
    payload
  };
}

function dayUntilLegStarts(index, routes, lengths, start_date){
  // console.log(index)
  // console.log(routes)
  //add all the routes.lengths until the index and return that numbe
  let sum = 0;
  for (let i = 0; i < index; i++) {
    // refactor this to grab the length of stay from the legnths array
    sum += lengths[i];
  }
  return sum;
}

export function setDisplayedLengthOfStay(value){
  return (dispatch, getStore) => {
    dispatch({ type: 'SET_DISPLAYED_LENGTH_OF_STAY', payload: { value: parseInt(value) } });
  };
}

//
// this will be run on setOrigin, setDestination, setLength. If it is on init --> only on last index.
export function fetchRouteFrom(payload){
  console.log('zozozozozozozozozozozozozoz');
  debug('fetchRouteFrom-payload', payload);
  // payload = {...payload, city: "LON", index: 0}
  // //console.log(payload);
  return (dispatch, getStore) => {
    // //console.log(getStore());
    dispatch(fetchRoutesFromBegin(payload));
    if (payload.value) {
      // let start_date =
      // start_date = start_date
      const start_date = addDays(
        getStore().explore.start_date.split('-').join('/'),
        dayUntilLegStarts(payload.index, getStore().explore.routes, getStore().explore.lengths),
        true
      );
      console.log(start_date);
      const date_to = start_date;
      const date_from = start_date;
      const exact_date = start_date;
      //console.log('start_date: ' + start_date);
      let paramsJSON = {
        fly_from: payload.value.k.replace(/\+/g, '%2B'),
        date_to,
        date_from,
        exact_date,
        local: false, //Math.random() < 0.5 ? payload.value.l : true,
        i: payload.city,
        first: true
      };

      let params = queryString.stringify(paramsJSON, { encode: false });
      console.log(`${API_URL}/routefrom/?${params}`);
      axios
        .get(`${API_URL}/routefrom/?${params}`)
        .then((res) => {
          if (res.status === 200) {
            const cities_airport = getStore().explore.cities_airport;
            const data = res.data.data
              .map((row) => {
                // console.log(row);
                if (row !== null && row.cityTo) {
                  return row;
                } else if (row && row.l) {
                  row.price_type = 'avg';
                  return row;
                } else {
                  return null;
                }
              })
              .filter((el) => el !== undefined);
            dispatch(fetchRoutesFromSuccess({ data, index: payload.index }));
          }
        })
        .then(() => {
          if (paramsJSON.local) {
            return [];
          } else {
            let date_to = swapIndices(paramsJSON.date_to.split('/'), 0, 1);
            let date_from = swapIndices(paramsJSON.date_from.split('/'), 0, 1);

            paramsJSON = {
              ...paramsJSON,
              first: '',
              date_to: addDays(date_to, 5, true),
              date_from: addDays(date_from, -4, true)
            };
            params = queryString.stringify(paramsJSON, { encode: false });
            return axios.get(`${API_URL}/routeFrom/?${params}`);
          }
        })
        .then((res) => {
          if (paramsJSON) return 0;
          else {
            if (res.status === 200) {
              const cities_airport = getStore().explore.cities_airport;
              const data = res.data.data
                .map((row) => {
                  if (cities_airport.find((city) => city.i === row.cityTo.code)) {
                    return cities_airport.find((city) => city.i === row.cityTo.code);
                  }
                })
                .filter((el) => el !== undefined);
              //console.log(data)
              dispatch(fetchRoutesFromSuccess({ data, index: payload.index }));
            }
          }
        })
        .catch((err) => {
          console.warn(err);
          dispatch(fetchRoutesFromFailure({ index: payload.index }));
        });
    }
  };
}

function swapIndices(arr, x, y){
  var b = arr[y];
  arr[y] = arr[x];
  arr[x] = b;
  return arr;
}

function fetchRoutesFromSuccess(payload){
  return {
    type: 'FETCH_ROUTES_FROM_SUCCESS',
    payload
  };
}
function fetchRoutesFromFlexibleSuccess(payload){
  return {
    type: 'FETCH_ROUTES_FROM_FLEXIBLE_SUCCESS',
    payload
  };
}
function fetchRoutesFromFailure(payload){
  return {
    type: 'FETCH_ROUTES_FROM_FAILURE',
    payload
  };
}
function fetchRoutesFromBegin(payload){
  return {
    type: 'FETCH_ROUTES_FROM_BEGIN',
    payload
  };
}

export function updateDestinationPrefs(payload){
  return (dispatch, getStore) => {
    payload.index = getStore().explore.current_index;
    payload.lengthOfStay = getStore().explore.displayedLengthOfStay;
    //console.log(payload)
    dispatch({ type: 'UPDATE_DESTINATION_PREFS', payload });
  };
}
