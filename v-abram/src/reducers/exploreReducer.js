function getFormatDate(date){
  let yyyy = date.getFullYear();
  let mm = 1 + date.getMonth();
  let dd = date.getDate();
  return yyyy + '-' + (mm >= 10 ? mm : '0' + mm) + '-' + (dd >= 10 ? dd : '0' + dd);
}

const default_date = new Date();

default_date.setDate(default_date.getDate() + 14);

export default function reducer(
  store = {
    // today: today,
    prefs: {
      budget: 2300,
      startTripDate: default_date,
      endTripDate: default_date,
      duration: 0,
      hotelPref: 'budget',
      foodPref: 'average',
      flightPriceTypePref: 'mixed',
      localTransportPref: 'mixed'
    },
    prevDestination: {
      n: 'Hello, ',
      s: 'World!'
    },
    displayedLengthOfStay: 8,
    current_index: 0,
    origin: {},
    start_date: getFormatDate(default_date),
    end_date: getFormatDate(default_date),
    cities_airport: [],
    cities_airport_status: 'init',
    comfort_level: 1,
    states: [ {} ],
    lengths: [ 0 ],
    day_prices: [ 0 ],
    leg_prices: [ 0 ],
    connection_valid: [],
    people: 1,
    route_to_origin: {
      data: {},
      status: '',
      enabled: false
    },
    kiwi_links_historical: [ {} ],
    routes: [ {} ],
    totalAdult: 1,
    totalChildren: 0,
    totalLength: 0,
    totalPrice: 0
  },
  action
){
  switch (action.type) {
    case 'SET_BUDGET':
      return {
        ...store,
        prefs: {
          ...store.prefs,
          budget: action.budget
        }
      };
    case 'START_TRIP_DATE':
      if (store.prefs.startTripDate == store.prefs.endTripDate) {
        return {
          ...store,
          prefs: {
            ...store.prefs,
            startTripDate: action.date,
            endTripDate: action.date
          },
          start_date: getFormatDate(action.date),
          end_date: getFormatDate(action.date)
        };
      }
      return {
        ...store,
        prefs: { ...store.prefs, startTripDate: action.date },
        start_date: getFormatDate(action.date)
      };
    case 'END_TRIP_DATE':
      return {
        ...store,
        prefs: {
          ...store.prefs,
          endTripDate: action.date,
          duration: dateDiffInDays(action.date, store.prefs.startTripDate)
        },
        end_date: getFormatDate(action.date)
      };
    case 'SET_DURATION':
      return {
        ...store,
        prefs: {
          ...store.prefs,
          duration: action.duration * 1,
          endTripDate: addDays(store.prefs.startTripDate, action.duration * 1)
        }
      };
    case 'SET_PREF':
      return { ...store, prefs: { ...store.prefs, [action.pref.type]: action.pref.value } };
    case 'SET_PREF_ALL':
      return {
        ...store,
        prefs: {
          ...action.payload,
          startTripDate: new Date(action.payload.startTripDate),
          endTripDate: new Date(action.payload.endTripDate)
        }
      };
    case 'SET_PREV_DESTINATION':
      return {
        ...store,
        prevDestination: { ...action.payload }
      };
    case 'SET_ETC':
      return {
        ...store,
        prevDestination: action.payload.prevdestination,
        current_index: action.payload.current_index,
        totalLength: action.payload.totallength,
        totalPrice: action.payload.totalprice,
        totalAdult: action.payload.totaladult,
        totalChildren: action.payload.totalchildren
      };
    case 'SET_DISPLAYED_LENGTH_OF_STAY': {
      let { displayedLengthOfStay } = store;
      displayedLengthOfStay = action.payload.value;
      const routes = [ ...store.routes ];
      console.log(routes[0] === undefined);
      //routes[store.current_index].lengthOfStay = action.payload.value;
      const people = store.totalAdult + store.totalChildren * 0.7;
      const days = displayedLengthOfStay * 1;
      const newData = routes[store.current_index].data.map((row) => {
        const currentLegPrice = calculateLegPrice(row, store.prefs, people, days);
        return { ...row, costPerDay: currentLegPrice / (days + (days == 0)) };
      });
      routes[store.current_index].data = newData;
      return { ...store, displayedLengthOfStay, routes };
    }
    case 'UPDATE_DESTINATION_PREFS': {
      let routes = store.routes;
      const prefs = action.payload.value;
      routes[action.payload.index] = { ...routes[action.payload.index], prefs };
      return { ...store, routes };
    }
    case 'INCREMENT_CURRENT_INDEX': {
      return { ...store, current_index: store.current_index++ };
    }
    case 'SET_CURRENT_INDEX': {
      return { ...store, current_index: action.payload.index };
    }
    case 'SET_ORIGIN': {
      //store in url set up
      if (action.payload) {
        return {
          ...store,
          origin: action.payload
        };
      }
      return { ...store };
    }
    case 'SET_START_DATE': {
      return { ...store, start_date: action.payload };
    }
    case 'SET_END_DATE': {
      return { ...store, end_date: action.payload };
    }
    case 'SET_COMFORT_LEVEL': {
      return { ...store, comfort_level: action.payload };
    }

    case 'AC_UPDATE':
      return { ...store, totalAdult: action.totalA, totalChildren: action.totalC };

    case 'SET_DESTINATIONS': {
      // console.log("SET_DESTINATIONS")
      return { ...store, states: action.payload.value };
    }

    case 'POP_DESTINATION': {
      //remove the top most destination in stacks
      return {
        ...store,
        states: store.states.slice(0, -1),
        lengths: store.lengths.slice(0, -1),
        day_prices: store.day_prices.slice(0, -1),
        leg_prices: store.leg_prices.slice(0, -1),
        connection_valid: store.connection_valid.slice(0, -1)
      };
    }
    case 'REMOVE_DESTINATION': {
      //remove destination at index
      return {
        ...store,
        states: store.states.filter((el, i) => i !== action.payload.index),
        lengths: store.lengths.filter((el, i) => i !== action.payload.index),
        day_prices: store.day_prices.filter((el, i) => i !== action.payload.index),
        leg_prices: store.leg_prices.filter((el, i) => i !== action.payload.index),
        connection_valid: store.connection_valid.filter((el, i) => i !== action.payload.index)
      };
    }

    case 'SET_LENGTH': {
      let lengths = [ ...store.lengths ];
      //store in url set up
      if (action.payload) {
        lengths[action.payload.index] = action.payload.value;
      }
      return { ...store, lengths: lengths };
    }

    case 'REFRESH_LEG_PRICE': {
      const updated_end_date = new Date(store.prefs.endTripDate);
      updated_end_date.setDate(
        updated_end_date.getDate() + store.displayedLengthOfStay * (store.states.length != 1)
      );
      if (store.states.length == 1) {
        return {
          ...store,
          prefs: { ...store.prefs, endTripDate: updated_end_date },
          totalPrice: store.totalPrice + (store.states.length === 1 ? 0 : currentLegPrice)
        };
      }
      //calculate set price of each leg of the trip. basically lengths[i] * day_price[i]
      const routes = store.routes[store.routes.length - 1].data;
      let data = store.states[store.states.length - 1];
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].k === action.payload.k) {
          data = routes[i];
          break;
        }
      }
      const people = store.totalAdult * 1 + store.totalChildren * 0.7;
      const days = store.displayedLengthOfStay * 1;
      const currentLegPrice = calculateLegPrice(data, store.prefs, people, days);
      return {
        ...store,
        prefs: {
          ...store.prefs,
          endTripDate: updated_end_date,
          duration: store.prefs.duration + days
        },
        leg_prices: [ ...store.leg_prices, currentLegPrice ],
        totalPrice: store.totalPrice + (store.states.length === 1 ? 0 : currentLegPrice),
        totalLength: store.lengths.reduce((acc, curr) => acc + curr) + days
      };
    }
    case 'REFRESH_DAY_PRICE': {
      //calculate and set the price per day for the trip.
      console.log();
      let day_prices = [ ...store.day_prices ];
      let dest = store.states[action.payload.index];
      let length = store.lengths[action.payload.index];
      day_prices[action.payload.index] =
        Math.round((dest.b * length + dest.p) / length * 1e2) / 1e2;
      if (isNaN(day_prices[action.payload.index])) day_prices[action.payload.index] = 0;

      return { ...store, day_prices: day_prices };
    }
    case 'REFRESH_LEG_PRICES': {
      //calculate set price of each leg of the trip. basically lengths[i] * day_price[i]
      let leg_prices = [ ...store.leg_prices ];
      let index = 0;
      for (index; index < leg_prices.length; index++) {
        leg_prices[index] = Math.round(store.lengths[index] * store.day_prices[index] * 1e2) / 1e2;
        if (isNaN(leg_prices[index])) leg_prices[index] = 0;
      }
      return { ...store, leg_prices: leg_prices };
    }
    case 'REFRESH_DAY_PRICES': {
      //calculate and set the price per day for the trip.
      let day_prices = [ ...store.day_prices ];
      let index = 0;
      for (index; index < day_prices; index++) {
        let dest = store.states[index];
        let length = store.lengths[index];
        day_prices[index] = Math.round((dest.b * length + dest.p) / length * 1e2) / 1e2;
        if (isNaN(day_prices[index])) day_prices[index] = 0;
      }
      return { ...store, day_prices: day_prices };
    }

    case 'SET_NUM_PEOPLE': {
      return { ...store, people: action.payload };
    }

    case 'REFRESH_CONNECTION_VALID': {
      //loop thru every destination and determine if they are valid or not. ignore payload.
      // let index = action.payload.index
      let connection_valid = [];
      let i;
      for (i = 0; i < store.states.length; i++) {
        connection_valid[i] = connectionValid(i, store);
      }
      return { ...store, connection_valid: connection_valid };
    }

    case 'SET_DEST_TO_ORIGIN_FETCH_STATUS': {
      return { ...store, route_to_origin_status: 'fetching' };
    }

    case 'FETCH_ROUTE_FAILURE': {
      let route_to_origin = { ...store.route_to_origin, status: 'failure' };
      return { ...store, route_to_origin };
    }

    case 'FETCH_ROUTE_SUCCESS': {
      let route_to_origin = { ...store.route_to_origin, status: 'success', data: action.payload };
      return { ...store, route_to_origin };
    }
    case 'FETCH_ROUTE_BEGIN': {
      let route_to_origin = { ...store.route_to_origin, status: 'loading' };
      return { ...store, route_to_origin: route_to_origin };
    }
    case 'TOGGLE_ORIGIN_TO_ROUTE_MODE': {
      let route_to_origin = { ...store.route_to_origin, mode: !store.route_to_origin.mode };
      return { ...store, route_to_origin: route_to_origin };
    }

    case 'FETCH_ROUTE_LINK_FAILURE': {
      let kiwi_links_historical = [ ...store.kiwi_links_historical ];
      kiwi_links_historical[action.payload.index] = {
        ...kiwi_links_historical[action.payload.index],
        status: 'failure'
      };
      // console.log(kiwi_links_historical)
      return { ...store, kiwi_links_historical };
    }

    case 'FETCH_ROUTE_LINK_SUCCESS': {
      let kiwi_links_historical = [ ...store.kiwi_links_historical ];
      kiwi_links_historical[action.payload.index] = {
        ...kiwi_links_historical[action.payload.index],
        status: 'success',
        link: action.payload.link
      };
      return { ...store, kiwi_links_historical };
    }
    case 'FETCH_ROUTE_LINK_BEGIN': {
      let kiwi_links_historical = [ ...store.kiwi_links_historical ];
      kiwi_links_historical[action.payload.index] = {
        ...kiwi_links_historical[action.payload.index],
        status: 'loading'
      };
      return { ...store, kiwi_links_historical };
    }
    case 'SET_CITIES_AIRPORT_BEGIN': {
      return { ...store, cities_airport_status: 'loading' };
    }
    case 'SET_CITIES_AIRPORT_FAILURE': {
      return { ...store, cities_airport_status: 'failed' };
    }

    case 'SET_CITIES_AIRPORT_SUCCESS': {
      // console.log('in');
      const cities_airport = action.payload;
      const cities_airport_status = 'success';
      return { ...store, cities_airport, cities_airport_status };
    }
    case 'FETCH_ROUTES_FROM_BEGIN': {
      let routes = [ ...store.routes ];
      routes[action.payload.index] = {
        ...routes[action.payload.index],
        status: 'loading',
        data: [],
        lengthOfStay: store.displayedLengthOfStay
      };
      return { ...store, routes };
    }
    case 'FETCH_ROUTES_FROM_FAILURE': {
      let routes = [ ...store.routes ];
      routes[action.payload.index] = { ...routes[action.payload.index], status: 'failure' };
      return { ...store, routes };
    }
    case 'FETCH_ROUTES_FROM_FIXED_SUCCESS': {
      let routes = [ ...store.routes ];
      routes[action.payload.index] = {
        ...routes[action.payload.index],
        status: 'success',
        data: action.payload.data
      };
      return { ...store, routes };
    }
    case 'SORT_ROUTES': {
      let routes = [ ...store.routes ];
      routes = routes.sort((el1, el2) => {
        // console.log("SORTING!", el1, el2)
        if (el1 && el2) {
          return el1.price - el2.price;
        } else {
          return 0;
        }
      });
      return { ...store, routes };
    }
    case 'RECALCULATE_COST_PER_DAY':
      const people = store.totalAdult + store.totalChildren * 0.7;
      const days = store.displayedLengthOfStay * 1;
      const routes = [ ...store.routes ];
      if (Object.keys(store.routes[0]).length != 0) {
        const newData = routes[store.current_index].data.map((row) => {
          const currentLegPrice = calculateLegPrice(row, store.prefs, people, days);

          return { ...row, costPerDay: currentLegPrice / (days + (days == 0)) };
        });
        routes[store.current_index].data = newData;
      }
      return {
        ...store,
        routes
      };

    case 'FETCH_ROUTES_FROM_SUCCESS': {
      const people = store.totalAdult + store.totalChildren * 0.7;
      const days = store.displayedLengthOfStay * 1;
      let routes = [ ...store.routes ];
      let newData = routes[action.payload.index].data
        .concat(action.payload.data)
        .filter((city, index, self) => {
          if (city === null) {
            console.log('I FOUND u');
            return false;
          } else {
            return index === self.findIndex((c) => c !== null && c.k === city.k);
          }
        })
        .map((row) => {
          const currentLegPrice = calculateLegPrice(row, store.prefs, people, days);
          return { ...row, costPerDay: currentLegPrice / (days + (days == 0)) };
        });

      // console.log(newData);
      // routes[action.payload.index].status = 'success'
      // routes[action.payload.index].data = [new Set(newData)]

      //the length of stay is being erased...? console.log(routes[action.payload.index]) to see if it was ever there.
      routes[action.payload.index] = {
        ...routes[action.payload.index],
        status: 'success',
        data: [ ...new Set(newData) ]
      };
      return {
        ...store,
        routes
      };
    }

    default:
      return store;
    // }
    // case 'SET_START_DATE': {
    //   return { ...store, start_date: action.payload };
    // }
    // case 'SET_COMFORT_LEVEL': {
    //   return { ...store, comfort_level: action.payload };
    // }
    case 'ADD_DESTINATION': {
      return {
        ...store,
        states: store.states.concat({}),
        lengths: store.lengths.concat(8),
        day_prices: store.day_prices.concat(0),
        leg_prices: store.leg_prices.concat(0),
        connection_valid: store.connection_valid.concat(true)
      };
    }
    case 'SET_DESTINATION': {
      // console.log(action)
      //store in url set up
      console.log('Kings');

      let states = [ ...store.states ];
      if (action.payload) {
        states[action.payload.index] = action.payload.value;
      }
      console.log(states);
      // return { ...store, states };
      return {
        ...store,
        states: states,
        prevDestination: {
          n: states[states.length - 1].n,
          s: states[states.length - 1].s
        }
      };
    }

    // case 'SET_DESTINATIONS': {
    //   // console.log("SET_DESTINATIONS")
    //   console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
    //   return { ...store, states: action.payload.value };
    // }

    // case 'POP_DESTINATION': {
    //   //remove the top most destination in stacks
    //   return {
    //     ...store,
    //     states: store.states.slice(0, -1),
    //     lengths: store.lengths.slice(0, -1),
    //     day_prices: store.day_prices.slice(0, -1),
    //     leg_prices: store.leg_prices.slice(0, -1),
    //     connection_valid: store.connection_valid.slice(0, -1),
    //   };
    // }
    // case 'REMOVE_DESTINATION': {
    //   //remove destination at index
    //   return {
    //     ...store,
    //     states: store.states.filter((el, i) => i !== action.payload.index),
    //     lengths: store.lengths.filter((el, i) => i !== action.payload.index),
    //     day_prices: store.day_prices.filter((el, i) => i !== action.payload.index),
    //     leg_prices: store.leg_prices.filter((el, i) => i !== action.payload.index),
    //     connection_valid: store.connection_valid.filter((el, i) => i !== action.payload.index),
    //   };
    // }

    case 'SET_LENGTH': {
      let lengths = [ ...store.lengths ];
      //store in url set up
      if (action.payload) {
        lengths[action.payload.index] = action.payload.value;
      }
      return { ...store, lengths: lengths };
    }

    // case 'REFRESH_LEG_PRICE': {
    //   //calculate set price of each leg of the trip. basically lengths[i] * day_price[i]
    //   let leg_prices = [...store.leg_prices];
    //   leg_prices[action.payload.index] =
    //     Math.round(
    //       store.lengths[action.payload.index] * store.day_prices[action.payload.index] * 1e2,
    //     ) / 1e2;
    //   if (isNaN(leg_prices[action.payload.index])) leg_prices[action.payload.index] = 0;
    //   return { ...store, leg_prices: leg_prices };
    // }

    // default:
    //   return store;
  }
}

//index is the index of the destination that is being checked. it will be checked against index -1.
// when index === 0 will be skipped by the parent function.
function connectionValid(index, store){
  let parent = index > 0 ? store.states[index - 1] : store.origin;
  if (
    parent.x &&
    parent.x.find((el) => {
      return el.d === store.states[index].i;
    })
  ) {
    return true;
  }
  return false;
}

const addDays = (date, duration) => {
  let newDate = new Date(date);
  newDate.setDate(newDate.getDate() + duration * 1);
  return newDate;
};
const dateDiffInDays = (a, b) => {
  // Discard the time and time-zone information.
  console.log(a);
  console.log(b);
  console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuu');
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(a.getUTCFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getUTCFullYear(), b.getMonth(), b.getDate());
  return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
};

const calculateLegPrice = (data, pref, people, days) => {
  let foodRate = 0;
  let hotelRate = 0;
  let transportRate = 0;
  console.log(days);
  if (days == 0) {
    return data.price * people;
  }
  switch (pref.foodPref) {
    case 'none':
      foodRate = 0;
      break;
    case 'budget':
      foodRate = data.food_low;
      break;
    case 'average':
      foodRate = data.food_avg;
      break;
    case 'luxury':
      foodRate = data.food_high;
  }
  switch (pref.hotelPref) {
    case 'none':
      hotelRate = 0;
      break;
    case 'budget':
      hotelRate = data.rent_low;
      break;
    case 'average':
      hotelRate = data.rent_avg;
      break;
    case 'luxury':
      hotelRate = data.rent_high;
  }
  switch (pref.localTransportPref) {
    case 'none':
      transportRate = 0;
      break;
    case 'bus':
      transportRate = data.transport_bus;
      break;
    case 'train':
      transportRate = data.transport_train;
      break;
    case 'mixed':
      transportRate = data.transport_avg;
      break;
    case 'taxi':
      transportRate = data.transport_taxi;
      break;
    case 'rentacar':
      transportRate = data.transport_rentalcar;
      break;
    case 'buyacar':
      transportRate = data.transport_buycar;
  }
  return (foodRate * 2.2 + hotelRate * 1 + transportRate * 1) * people * days + data.price * people;
};
