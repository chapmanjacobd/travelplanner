var express = require('express');
var router = express.Router();

var queries = require('../queries');

router.get('/routefrom', queries.getRouteFrom);
router.get('/routeprices/:route', queries.getRoutePrice);
// router.get('/routepricesairport/:route', queries.getRoutePriceAirport);
router.get('/routelinks/:route', queries.getRouteLink);
router.get('/initCities', queries.initCities);
router.get('/getcity', queries.getCity);
router.get('/searchOrigin', queries.searchOrigin);
router.get('/browseDest', queries.browseDest);
router.get('/getpassportfilterinfo/', queries.getPassportFilterInfo);
router.get('/getpassportallfilterinfo/', queries.getPassportAllFilterInfo);

module.exports = router;
