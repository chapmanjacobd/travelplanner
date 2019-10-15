var axios = require('axios');
var _db = require('../db');

function getDB (){
  _db.initDB();
  return _db.getDB();
}

function getRoutePrice (route){
  let db = getDB();
  let to_city = route.to_city;
  let from_city = route.from_city;
  return axios
    .get(
      `http://free.rome2rio.com/api/1.4/json/Search?key=B1gQbsdM&oPos=${from_city}&dPos=${to_city}`,
    )
    .then(response => {
      let { car_routes, normal_routes } = parseRoutes(response.data.routes);
      let price = getAvgPrice(normal_routes);
      db
        .none(
          'INSERT INTO rome2rio_routes(to_city, from_city, price, route_one, route_two, car_routes) VALUES (${to_city}, ${from_city}, ${price}, ${route_one}, ${route_two}, ${car_routes})',
          {
            to_city: route.to_city,
            from_city: route.from_city,
            price: price,
            route_one: normal_routes[0],
            route_two: normal_routes[1],
            car_routes: { car_routes: car_routes },
          },
        )
        .then(() => {
          console.log('saved to db!');
        })
        .catch(err => console.log(err));
    });
}

function getRoutePriceAirport (route){
  let db = getDB();
  let to_city = route.to_city;
  let from_city = route.from_city;
  return axios
    .get(
      `http://free.rome2rio.com/api/1.4/json/Search?key=B1gQbsdM&oPos=${from_city}&dPos=${to_city}`,
    )
    .then(response => {
      let { car_routes, normal_routes } = parseRoutes(response.data.routes);
      let price = getAvgPrice(normal_routes);
      db
        .none(
          'INSERT INTO rome2rio_routes(to_city, from_city, price, route_one, route_two, car_routes) VALUES (${to_city}, ${from_city}, ${price}, ${route_one}, ${route_two}, ${car_routes})',
          {
            to_city: route.to_city,
            from_city: route.from_city,
            price: price,
            route_one: normal_routes[0],
            route_two: normal_routes[1],
            car_routes: { car_routes: car_routes },
          },
        )
        .then(() => {
          console.log('saved to db!');
        })
        .catch(err => console.log(err));
    });
}

function parseRoutes (routes){
  // < -- step 1 --> removes and places all route options that include the word drive or car in the name into a seperate array
  let carRoutes = [];
  // routes = JSON.parse(JSON.stringify(routes))
  routes.forEach(el => {
    if (el.name.search(/ *car */i) > -1 || el.name.search(/ *drive */i) > -1) {
      carRoutes.push(el);
    }
  });
  routes = routes.filter(el => !carRoutes.includes(el));
  // step 2. filters out the remaining routes that are over 7 hours, end in the chars ', travel', and then sorts by price,
  //          and splices the array leaving only indices 0 and 1 in the array.
  routes =
    routes.filter(route => route.totalDuration < 60 * 7).length > 1
      ? routes.filter(route => route.totalDuration < 60 * 7)
      : routes;
  let re = /, travel$/;
  routes = routes
    .filter(route => {
      if (re.exec(route.name)) {
        return false;
      }
 else {
        return true;
      }
    })
    .sort((firstEl, secondEl) => {
      if (firstEl.indicativePrices && secondEl.indicativePrices) {
        return firstEl.indicativePrices[0].price - secondEl.indicativePrices[0].price;
      }
 else {
        return 0;
      }
    });

  // step 3. returns an object that contains the two arrays.
  return { car_routes: carRoutes, normal_routes: routes.splice(null, 2) };
}

function getIndicativePrices (indicativePrices){
  let sums = [];
  indicativePrices.forEach(el => sums.push(el.price));
  return Math.min(...sums);
}

function getAvgPrice (routes){
  let sum = 0;
  routes.forEach((el, index) => {
    sum += getIndicativePrices(el.indicativePrices);
    // if (sum > 60) {}
  });
  return sum / routes.length;
}

module.exports = {
  getRoutePrice,
  // getRoutePriceAirport,
};
