// import axios from 'axios'

const QueryFile = require('pg-promise').QueryFile;
var rome2rio = require('./helpers/rome2rio');
var kiwi = require('./helpers/kiwi');
var google = require('./user/google-util');
const Queue = require('./queue');
const searchOriginSQL = QueryFile('../sql/initAutocomplete.sql', { minify: true });
const browseDestSQL = QueryFile('../sql/browseDest.sql', { minify: true });
const getCityFromK = QueryFile('../sql/getCityFromK.sql', { minify: true });
const searchOriginNonASCIISQL = QueryFile('../sql/initAutocompleteNonASCII.sql', {
  minify: true,
  // debug: true,
});

var _db = require('./db');

function getQueue(){
  Queue.initQueue();
  return Queue.getQueue();
}

function getDB(){
  _db.initDB();
  return _db.getDB();
}

function toDate(dateStr){
  var parts = dateStr.split('/');
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

function toString(date){
  let dd = date.getDate();
  let mm = date.getMonth() + 1; //January is 0!
  let yyyy = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  //use periods because sending JSON objects over URL's doesn't work for some reason.
  let dateStr = dd + '/' + mm + '/' + yyyy;
  return dateStr;
}
function addDays(date, days){
  var result = toDate(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getRouteLink(req, res, next){
  //console.log("in routelink")
  let route = JSON.parse(req.params.route);

  // reformatting the dates
  route.from_date = route.from_date.replace(/\./g, '/');
  route.to_date = route.to_date.replace(/\./g, '/');

  // fetching the data, and sending it back.
  kiwi.getRouteLink(route).then((el) => {
    // if the route and dates match, then send back the price and the link for the thing.
    if (el) {
      res.status(200).json({
        status: 200,
        route_link: el.deep_link,
        price: el.price,
        route,
      });
    } else {
      // if the route and date requested don't match, send another request to Kiwi
      //  while expanding the date range by 4 on either side of the range.
      console.log('nothing on first call');
      // this can be made better. use the dates returned from the getRoutes
      //  api call to ask for the exact date. It will be better.
      route.from_date = toString(addDays(route.from_date, -4));
      route.to_date = toString(addDays(route.to_date, 4));
      kiwi.getRouteLink(route).then((el) => {
        if (el) {
          res.status(200).json({
            status: 200,
            route_link: el.deep_link,
            price: el.price,
            route,
          });
        } else {
          res.status(201).json({
            status: 201,
            route_link: 'none',
            price: 0,
            route: {
              ...route,
              from_date: toString(addDays(route.from_date, -4)),
              to_date: toString(addDays(route.to_date, 4)),
            },
          });
        }
      });
    }
  });
}

async function getRoutePrice(req, res, next){
  //expects route to be a json file like params.
  let db = getDB();

  let route = JSON.parse(req.params.route);
  db
    .any('select * from rome2rio_routes where to_city = $1 and from_city = $2', [
      route.to_city,
      route.from_city,
    ])
    .then((data) => {
      if (data.length) {
        res.status(200).json({
          status: 'success',
          route: route,
          data: data,
        });
      } else {
        // add this function to queue
        const promise = () => {
          this.route = route;
          rome2rio
            .getRoutePrice(route)
            .then((resolve, reject) => {
              console.log('rome2rio finished');
              db
                .any('select * from rome2rio_routes where to_city = $1 and from_city = $2', [
                  route.to_city,
                  route.from_city,
                ])
                .then((data) => {
                  console.log('getRoutePrice worked!');
                  res.status(200).json({
                    status: 'success',
                    route: route,
                    data: data,
                  });
                });
            })
            .catch((err) => {
              res.status(400).json({
                status: 'failure',
              });
            });
        };
        getQueue().add(promise);
      }
    });
}

async function searchOrigin(req, res, next){
  try {
    const db = getDB();
    // get value from query
    let input = req.query.input;
    // console.log(req.query)
    // console.log(input)
    // console.log(req.query)
    input = '\\y' + `${input}`;
    // console.log(input)
    // console.log(input);
    // console.log(searchOriginSQL)
    const cities = await db.any(searchOriginSQL, { input });
    // const cities = await db.any(searchOriginNonASCIISQL, { input }); <-- use this if searchOriginSQL is null
    res.status(200).json(cities);
    // console.log(cities);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
}

async function browseDest(req, res, next){
  try {
    const db = getDB();
    let input = req.query.input;
    input = '\\y' + `${input}`;
    const cities = await db.any(browseDestSQL, { input });
    // const cities = await db.any(searchOriginNonASCIISQL, { input }); <-- use this if searchOriginSQL is null
    res.status(200).json(cities);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
}

async function getCity(req, res, next){
  try {
    const db = getDB();

    // get k from req
    const k = req.query.k;
    // get the city from 'cities'
    const city = await db.one(getCityFromK, { k });
    // return city.
    res.status(200).json(city);
    // console.log(city);
  } catch (e) {
    res.status(405);
    console.log(e);
  }
}

async function getRouteFrom(req, res, next){
  // console.log('GET ROUTE FROM ');
  try {
    // use the exact_date from client to determine the difference between the actual departure date.
    // pass it to kiwi.getRouteFrom --> it will do some math and figure out the difference between the actual departure date and
    const route = ({ fly_from, date_from, date_to, exact_date, local, first } = req.query);
    // get I out of the database using K, then pass it down.
    const db = getDB();
    // console.log(fly_from)
    // let result = ''
    // if (local) {
    // } else {
    // }
    // if local === true --> do that one fromLocalCities query

    // if local === false --> just use that
    // const result = await db.one("select i from cities where k = ${fly_from};", {fly_from})

    if (local === 'true') {
      // use K to find all the cities that are near it.
      // for each city check the db to see if we have any data for it
      // if dbData:
      // return data
      // else:
      // check rome2rio and return that. Use queue to fetch data for us.
      const data = await kiwi.getLocalRoutesFrom({ k: fly_from });
      console.log(data, 'queries.js.console.log()');
      res.status(200).json({ data });
    } else {
      // get the i from the database and send it to kiwi
      // route.fly_from = i;
      const result = await db.one('select * from cities where k = ${fly_from};', { fly_from });
      route.fly_from = result.i;
      route.k = fly_from;
      kiwi
        .getRouteFrom(route)
        .then(async (data) => {
          // concatenate the kiwi.getLocalRoutesFrom results with the alternative results.
          let localData = [];
          try {
            const locali = `${result.latitude}-${result.longitude}-90km`;
            const localk = fly_from;
            localData = await kiwi.getLocalRoutesFrom({ k: localk, i: locali });
            // console.log(localData, 'local data1!!!');
          } catch (e) {
            console.log('local cities failed');
          }
          // console.log(localData, 'local data2!!');
          data = data.concat(localData);
          // data = [ ...localData, data ];
          // console.log(data)
          res.status(200).json({ data });
        })
        .catch((err) => {
          console.log(err);
          console.log(data);
          res.status(400).json({
            err,
          });
        });
    }
  } catch (e) {
    console.log(e);
  }
}

async function initCities(req, res, next){
  // try {
  const db = getDB();
  const cities = JSON.parse(req.query.cities);
  // console.log('initCities', cities);
  let promises = [];
  cities.forEach((city, i) => {
    promises.push(
      db
        .one('select * from cities where k = ${city}', { city })
        .then((result) => {
          // console.log(result)
          return result;
        })
        .catch((e) => {
          console.error(e);
        })
    );
  });

  Promise.all(promises)
    .then((data) => {
      // console.log(data)
      res.status(200).json(data);
    })
    .catch((e) => console.error(e));
}
function getPassportFilterInfo(req, res){
  let db = getDB();
  db
    .one("select * from passports where u = '" + req.query.u + "'")
    .then((data) => {
      res.status(200).send({ message: data });
    })
    .catch((e) => {
      console.error(e);
      res.status(400).json({ err });
    });
}

function getPassportAllFilterInfo(req, res){
  let db = getDB();
  db
    .any('select * from passports')
    .then((data) => {
      res.status(200).send({ message: data });
    })
    .catch((e) => {
      console.error(e);
      res.status(400).json({ err });
    });
}

module.exports = {
  initCities: initCities,
  getRouteLink: getRouteLink,
  getRoutePrice: getRoutePrice,
  getRouteFrom: getRouteFrom,
  getCity: getCity,
  searchOrigin: searchOrigin,
  browseDest,
  getPassportFilterInfo: getPassportFilterInfo,
  getPassportAllFilterInfo,
};
