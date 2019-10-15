var axios = require('axios');
var queryString = require('query-string');
var _db = require('../db');
var pgp = require('pg-promise');
// var rome2rio = require('./rome2rio');
// var sample = require('./sample2.json');
const QueryFile = require('pg-promise').QueryFile;
const Queue = require('../queue');

const getCitiesOriginLocal = QueryFile('../sql/getCitiesOriginLocal.sql', { minify: true });
const getCitiesFromList = QueryFile('../sql/getCitiesFromList.sql', { minify: true });

function getQueue (){
  // console.log(Queue)
  Queue.initQueue();
  return Queue.getQueue();
}

function getDB (){
  _db.initDB();
  return _db.getDB();
}

function toYYYYMMDD (date){
  let dateArr = date.split('/');
  const tmp = dateArr[2];
  dateArr[2] = dateArr[0];
  dateArr[0] = tmp;
  return dateArr.join('-');
}

function getRouteLink (route){
  let apiURL = `https://kiwicom-prod.apigee.net/v2/search?flyFrom=${route.from_city}&to=${route.to_city}&dateFrom=${route.from_date}&dateTo=${route.to_date}&apikey=xMPjqvJVuY1kCxnAfsc9BFxqkKZERx7k&curr=USD`;
  return axios
    .get(apiURL)
    .then(response => {
      let apiRoute = response.data.data[0];
      // figure out where the date is, subtract today's date from the departure date and if check if it is > 2 weeks and < 9 months.
      // route[0].local_departure - today
      // console.log(apiRoute)
      const today = new Date();
      const departure_Date = new Date(apiRoute.route[0].local_departure);
      const day_difference = (departure_Date - today) / 86400000;
      if (apiRoute && day_difference > 14 && day_difference < 30 * 6) {
        saveData(apiRoute, route);
      }
      return apiRoute;
    })
    .catch(err => {
      return err;
    });
}

function saveData (apiRoute, route){
  let db = getDB();
  db
    .none(
      'INSERT INTO kiwi_links_historical(to_city, from_city, price, departure_date_time, route_link, from_date) VALUES (${to_city}, ${from_city}, ${price}, ${departure_date_time}, ${route_link}, ${from_date}, ${to_date}, ${distance}, ${duration} ${airline}, ${flight_no}, ${bags_price1}, ${bags_price2}, ${baglimit_hand_width}, ${baglimit_hand_length}, ${baglimit_hand_height}, ${baglimit_hand_weight}, ${baglimit_hold_weight})',
      {
        to_city: route.to_city,
        from_city: route.from_city,
        price: apiRoute.price,
        departure_date_time: apiRoute.local_departure,
        route_link: apiRoute.deep_link,
        distance: apiRoute.distance,
        duration: apiRoute.duration.total,
        airline: apiRoute.airline,
        flight_no: apiRoute.flight_no,
        bags_price1: apiRoute.bags_price[1],
        bags_price2: apiRoute.bags_price[2],
        baglimit_hand_width: apiRoute.baglimit.hand_width,
        baglimit_hand_length: apiRoute.baglimit.hand_length,
        baglimit_hand_height: apiRoute.baglimit.hand_height,
        baglimit_hand_weight: apiRoute.baglimit.hand_weight,
        baglimit_hold_weight: apiRoute.baglimit.hold_weight,
        from_date: route.from_date,
        to_date: route.to_date,
      },
    )
    .catch(err => {
      // console.log(err);
    });
}

// places the route into the object's specified index
function sortedPush (currentObject, route){
  const returnObject = { ...currentObject };
  const keys = Object.keys(returnObject);
  // outer loop is trying to map the route's name to a key in the return object.
  for (let i = 0; i < keys.length; i++) {
    if (route.name.toLowerCase().includes(keys[i].toLowerCase())) {
      // if length is 0, throw it in!
      if (returnObject[keys[i]].length === 0) {
        returnObject[keys[i]].push(route);
        break;
      }
      // inner loop is determining whether to place the route into the object.
      for (let j = 0; j < 2; j++) {
        // check if route.price is lower, if it is, then insert at j, move j to one position higher.
        if (returnObject[keys[i]][j]) {
          if (route.price < returnObject[keys[i]][j].price) {
            let tmp = returnObject[keys[i]][j];
            returnObject[keys[i]][j] = route;
            returnObject[keys[i]][j + 1] = tmp;
            break;
          }
        } else {
          returnObject[keys[i]].push(route);
        }
      }
      //limit the size of array to two.
      returnObject[keys[i]].slice(0, 2);
    }
  }
  // In the return object, map it to it's travel type, and then loop thru each route there.

  // insert at i where i.price is > nextRoute.price. but only where i < 2.

  // trim the end of the array on every insertion to length of 2.
  return returnObject;
}

function getLocalRoutePrice (route){
  return route.indicativePrices ? route.indicativePrices[0].price : null;
}

function getLocalRouteURL (route){
  if (route.segments) {
    let arr = [];
    for (let k = 0; k < route.segments.length; k++) {
      if (route.segments[k].agencies) {
        for (let i = 0; i < route.segments[k].agencies.length; i++) {
          if (route.segments[k].agencies[i].links) {
            for (let j = 0; j < route.segments[k].agencies[i].links.length; j++) {
              arr.push(route.segments[k].agencies[i].links[j].url);
            }
          }
        }
      }
    }
    return arr;
  } else return null;
}

function getLocalRouteName (route){
  return route.name;
}

function getLocalRouteTotalDuration (route){
  return route.totalDuration;
}

async function getLocalRoutesFrom ({ date_from, date_to, i, exact_date, k }){
  const db = getDB();
  const queue = getQueue();

  try {
    // get the list of cities that are connecting to the city.
    let destinations = await db.any(getCitiesOriginLocal, { k });
    let origin = await db.one('select * from cities where k = ${k}', { k });
    let originCityLocation = `${origin.latitude},${origin.longitude}`;
    destinations = destinations.map(async el => {
      try {
        // check if the route is in the rome2rio db
        let route = await db.any(
          'select * from rome2rio_routes where tocity = ${tocity} and fromcity = ${fromcity} limit 1',
          { tocity: el.k, fromcity: origin.k },
        );
        if (route.length > 0) {
          let { routesdata, price } = route[0];
          return { routesdata, price };
        } else {
          const localCityName = `${el.latitude},${el.longitude}`;
          console.log(localCityName, 'route.length <= 0');

          return queue.add(async () => {
            this.route = { from_city: k, to_city: el.k };
            let response;
            try {
              response = await axios.get(
                `http://free.rome2rio.com/api/1.4/json/Search?key=B1gQbsdM&oPos=${originCityLocation}&dPos=${localCityName}`,
              );
            } catch (e) {
              console.log("couldn't get city");
              return {};
            }

            const { data: { vehicles, routes } } = response;

            // build a pseudo dictionary to store all of the routes and their related data.
            const vehicleKeys = {};
            vehicles.forEach(el => {
              if (el.name.toLowerCase() === 'plane') {
                vehicleKeys['fly'] = [];
              } else if (el.name.toLowerCase() === 'car') {
                vehicleKeys['drive'] = [];
              } else {
                vehicleKeys[el.name.toLowerCase()] = [];
              }
            });

            // go thru the routes and fill the routes data with the data parsed and sorted.
            let routesData = { ...vehicleKeys };
            let lowPrice = 200000000;
            let priceAvg = 0;
            for (let i = 0; i < routes.length; i++) {
              const price = getLocalRoutePrice(routes[i]);
              priceAvg += price;
              lowPrice = price < lowPrice ? price : lowPrice;
              const url = getLocalRouteURL(routes[i]);
              const name = getLocalRouteName(routes[i]);
              const totalDuration = getLocalRouteTotalDuration(routes[i]);
              routesData = { ...sortedPush(routesData, { price, url, name, totalDuration }) };
            }
            priceAvg /= routes.length;
            try {
              await db.none(
                'insert into rome2rio_routes (fromcity, tocity, price, routesdata, pricelow) VALUES (${fromCity}, ${toCity}, ${price}, ${routesData}, ${pricelow})',
                {
                  fromCity: k,
                  toCity: el.k,
                  price: priceAvg,
                  pricelow: lowPrice,
                  routesData,
                },
              );
              // Promise.resolve(dbInsert)
            } catch (e) {
              console.log(e, 'db insert for rome2rio local routes broke');
            }

            return { ...el, routesData, price: priceAvg };
          });
          // return returnValue
        }
      } catch (e) {
        console.log('getLocalRoutes Broke inside of the map');
      }
    });
    // console.log(destinations)
    destinations = Promise.all(destinations);
    console.log(destinations, 'localCitiesConsole.log()');

    return destinations;
  } catch (e) {
    console.log(e, "getting local city's route data error");
  }
}
// const originCity = await db.one('select n,c from cities where k = ${k}', { k });
// let originCityLocation = `${originCity.n}, ${originCity.c}`;
// let localCities = await db.any(getCitiesOriginAirport, { i });
// localCities = localCities.map(async function(el){
//   try {
//     // check to see if route is in pgsql and if it has been updated in the last 8 months
//     // if there just return it.
//     // otherwise move forward.

//     const check = await db.any(
//       'select * from rome2rio_routes where fromcity = ${fromcity} and tocity = ${tocity}',
//       {
//         fromcity: k,
//         tocity: el.k,
//       },
//     );

//     if (check.length) {
//       // console.log(check)
//       return check[0].routesdata;
//     } else {
//       const { n, c } = el;
//       const localCityName = `${n}, ${c}`;
//       // call db here and do present check here.
//       const value = queue
//         .add(() => {
//           this.route = { from_city: k, to_city: el.k };
//           return axios
//             .get(
//               `http://free.rome2rio.com/api/1.4/json/Search?key=B1gQbsdM&oName=${originCityLocation}&dName=${localCityName}`,
//             )
//             .then((res) => {
//               const { data: { vehicles, routes } } = res;
//               // build a pseudo dictionary to store all of the routes and their related data.
//               const vehicleKeys = {};
//               vehicles.forEach((el) => {
//                 if (el.name.toLowerCase() === 'plane') {
//                   vehicleKeys['fly'] = [];
//                 } else if (el.name.toLowerCase() === 'car') {
//                   vehicleKeys['drive'] = [];
//                 } else {
//                   vehicleKeys[el.name.toLowerCase()] = [];
//                 }
//               });

//               // go thru the routes and fill the routes data with the data parsed and sorted.
//               let routesData = { ...vehicleKeys };
//               let lowPrice = 200000000;
//               let priceAvg = 0;
//               for (let i = 0; i < routes.length; i++) {
//                 const price = getLocalRoutePrice(routes[i]);
//                 priceAvg += price;
//                 lowPrice = price < lowPrice ? price : lowPrice;
//                 const url = getLocalRouteURL(routes[i]);
//                 const name = getLocalRouteName(routes[i]);
//                 const totalDuration = getLocalRouteTotalDuration(routes[i]);
//                 routesData = { ...sortedPush(routesData, { price, url, name, totalDuration }) };
//               }
//               priceAvg /= routes.length;
//               db
//                 .none(
//                   'insert into rome2rio_routes (fromcity, tocity, price, routesdata, pricelow) VALUES (${fromCity}, ${toCity}, ${price}, ${routesData}, ${pricelow})',
//                   {
//                     fromCity: k,
//                     toCity: el.k,
//                     price: priceAvg,
//                     pricelow: lowPrice,
//                     routesData,
//                   },
//                 )
//                 .catch((e) => {
//                   console.log(e);
//                   console.warn('your db checking algorithm is off.');
//                 });
//               return { ...el, routesData, price: priceAvg };
//             })
//             .catch((e) => {
//               console.log(e, 'axios error');
//             });
//         })
//         .catch((e) => {
//           console.error(e);
//           console.log('queue error');
//         });

//       return value;
//     }
//   } catch (e) {
//     console.log('something failed');
//   }
// });
// // some how make it be able to return non promises...
// const returnObj = Promise.all(localCities);
// return returnObj;

async function getRouteFrom ({ date_from, date_to, fly_from, exact_date, first, k }){
  // console.log(fly_from)
  try {
    const db = getDB();
    // console.log(exact_date);
    // SAVE THE EXACT DATE THAT the user is traveling on
    // find the difference between that date and the actual date that kiwi is providing.
    // console.log(route)

    const params = queryString.stringify({
      date_from,
      date_to,
      // fly_from=-23.24--47.86-100km
      fly_from,
      max_fly_duration: 15,
      flight_type: 'oneway',
      adults: 1,
      curr: 'USD',
      locale: 'en',
      price_to: 8888,
      max_stopovers: 1,
      one_for_city: 1,
      conn_on_diff_airport: 0,
      sort: 'price',
      apikey: 'xMPjqvJVuY1kCxnAfsc9BFxqkKZERx7k',
    });
    // console.log(fly_from);

    const apiURL = `https://kiwicom-prod.apigee.net/v2/search?${params}`;
    // console.log(apiURL);

    return axios
      .get(apiURL)
      .then(async ({ data }) => {
        if (data && data.data) {
          try {
            // console.log(data.data)
            // get the price, countryTo, cityTo: {cityTo, flyTo}, local_departure, day_difference, and i.
            let queries = [];
            const kiwiDataObj = {};
            for (let i = 0; i < data.data.length; i++) {
              const { price, countryTo, cityTo, flyTo, local_departure } = data.data[i];
              const day_difference = Math.round(
                new Date(local_departure) - new Date(toYYYYMMDD(exact_date)) / 86400000,
              );
              kiwiDataObj[data.data[i].flyTo] = {
                price,
                countryTo,
                cityTo: { name: cityTo, code: flyTo },
                local_departure,
                day_difference,
              };
              queries.push(data.data[i].flyTo);
            }
            // console.log(kiwiDataObj);
            // console.log(query)
            const fullQuery = pgp.as.format(getCitiesFromList, [
              queries,
            ]);
            // console.log(fullQuery);
            let cities = await db.any(fullQuery);
            // console.log(cities)
            cities = cities.map(el => {
              const { price, countryTo, cityTo, local_departure, day_difference } = kiwiDataObj[
                el.i
              ];
              return { ...el, price, countryTo, cityTo, local_departure, day_difference };
            });

            return cities;
          } catch (e) {
            console.log(e);
          }

          // const promises = res.data.data.map((el, i) => {
          //   const { price, countryTo, cityTo, flyTo, local_departure } = el;
          //   return (
          //     db
          //       .any('select * from cities where i = ${flyTo}', { flyTo } )
          //       // does the city from kiwi exist in our main table of cities?
          //       .then((citiesResult) => {
          //         if (citiesResult.length) {
          //           // console.log(citiesResult)
          //           return {
          //             price,
          //             countryTo,
          //             cityTo: {
          //               name: cityTo,
          //               code: flyTo,
          //             },
          //             local_departure,
          //             // this subtracts the exact desired date --
          //             // positive numbers mean that the date is before the planned date.
          //             // negative mean they are ahead of the date.
          //             day_difference: Math.round(
          //               new Date(local_departure) - new Date(toYYYYMMDD(exact_date)) / 86400000,
          //             ),
          //           };
          //           // if not - check to see if the city code they sent us is actually an airport code.
          //           // if it is, return the value associated with that city.
          //         } else {
          //           return db
          //             .any('select city_code from map_citycode where airport_code = $1', [ flyTo ])
          //             .then((map_result) => {
          //               if (map_result.length) {
          //                 return {
          //                   price,
          //                   countryTo,
          //                   cityTo: {
          //                     name: cityTo,
          //                     code: map_result[0].city_code,
          //                   },
          //                   local_departure,
          //                   day_difference: Math.round(
          //                     new Date(local_departure) - new Date(toYYYYMMDD(exact_date)) / 86400000,
          //                   ),
          //                 };
          //               } else {
          //                 // db.any('INSERT INTO cities (i,n,c,u) VALUES($1, $2, $3, $4)', [
          //                 //   flyTo,
          //                 //   cityTo,
          //                 //   countryTo.name,
          //                 //   countryTo.code,
          //                 // ]);
          //                 return {
          //                   price,
          //                   countryTo,
          //                   cityTo: {
          //                     name: cityTo,
          //                     code: flyTo,
          //                   },
          //                   local_departure,
          //                   day_difference: Math.round(
          //                     new Date(local_departure) - new Date(toYYYYMMDD(exact_date)) / 86400000,
          //                   ),
          //                 };
          //               }
          //             });
          //         }
          //       })
          //       .catch((err) => console.log('err', err))
          //   );
          // });

          // after we implement the postgis feature, append those promises to the promises. then call Promises.all on that longer set.
          // console.log(promises, localCities)
          // console.log(localCities)
          const returnValues = Promise.all(promises);
          // console.log(returnValues);

          return returnValues;
        } else {
          return 'err';
        }
      })
      .catch(err => {
        console.log('err on retrieving from kiwi');
      });
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getRouteLink,
  getRouteFrom,
  getLocalRoutesFrom,
};
