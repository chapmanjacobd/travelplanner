import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import * as exploreActions from '../../actions/exploreActions';
import * as routerActions from '../../actions/routerActions';
import DestinationCard from './DestinationCard';
import * as helpers from '../helpers/helpers.js';

Date.prototype.addDays = function(days){
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.black,
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: 16,
    paddingBottom: 16,
  },
  firebase: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.common.black,
  },
  itemActionable: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemActiveItem: {
    color: '#6b9b36',
  },
  itemPrimary: {
    color: 'inherit',
    fontSize: theme.typography.fontSize,
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
  },
  card: {
    marginBottom: '16px',
    width: 320,
  },
  actions: {
    flexDirection: 'column',
    padding: '8px 8px 0 0',
    justifyContent: 'space-evenly',
    marginLeft: '10px',
  },
  content: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
});

const months = [
  'Jan.',
  'Feb.',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'Sept.',
  'Oct.',
  'Nov.',
  'Dec.',
];
// function getTextDateFromStartDate(lengths, start_date, index){
//   // take the string from redux and make it a date object
//   const startDate = new Date(start_date);
//   // calculate how mnay days since the start to this destination to get start date
//   const reducer = (acc, val, i) => (i < index ? acc + val : acc);
//   const length = lengths.reduce(reducer);
//   startDate.setDate(startDate.getDate() + length);
//   const month = months[startDate.getMonth()];
//   const day = startDate.getDate();
//   return `${month} ${day}`;
// }

class Sidebar extends React.Component {
  getCityData = (connection) => {
    const airport = this.props.city_data.find((el) => {
      return el.i === connection.d;
    });
    if (airport) {
      airport.p = connection.p;
      return airport;
    }
  };

  connectionsBuilder = () => {
    if (this.props.connections) {
      return this.props.connections
        .map((el) => {
          return this.getCityData(el);
        })
        .filter((airport) => airport !== undefined);
    }
  };

  render() {
    const {
      lengths,
      start_date,
      show,
      states,
      setRouteToDestinationDetail,
      // ...other
    } = this.props;

    if (show) {
      return (
        <React.Fragment>
          {states.map((el, i) => {
            {
              /* console.log("SidebarLeft",el) */
            }
            {
              /* console.log("Lengths", lengths) */
            }
            {
              /* console.log('calculatedDate', helpers.getTextDateFromStartDate(lengths, start_date, i)); */
            }

            return i === 0 ? null : (
              <DestinationCard
                key={i}
                index={i}
                start_date={helpers.getTextDateFromStartDate(lengths, start_date, i).start_date}
                n={el.n}
                k={el.k}
                onClick={() => setRouteToDestinationDetail({ index: i })}
              />
            );
          })}
        </React.Fragment>
      );
    } else {
      return null;
      // <Drawer variant="permanent" {...other}>
      //   <Hidden xsDown implementation="js">
      //     <div style={{ flexGrow: '1' }}>
      //       <Card className={classes.card}>
      //         <CardContent className={classes.content}>Welcome</CardContent>
      //       </Card>
      //     </div>
      //     <Legal />
      //   </Hidden>
      // </Drawer>
    }
  }
}

const mapStateToProps = (store) => ({
  origin: store.explore.origin,
  start_date: store.explore.start_date,
  city_data: store.explore.city_data,
  comfort_level: store.explore.comfort_level,
  leg_prices: store.explore.leg_prices,
  lengths: store.explore.lengths,
  day_prices: store.explore.day_prices,
  people: store.explore.people,
  route_to_origin: store.explore.route_to_origin,
  cities_airport: store.explore.cities_airport,
  currentPage: store.router.current,
  states: store.explore.states,
});

const mapDispatchToProps = (dispatch) => ({
  setOrigin: (o) => dispatch(exploreActions.setOrigin(o)),
  setStartDate: (d) => dispatch(exploreActions.setStartDate(d)),
  setComfortLevel: (c) => dispatch(exploreActions.setComfortLevel(c)),
  setNumPeople: (p) => dispatch(exploreActions.setNumPeople(p)),
  toggleOriginToRouteMode: () => dispatch(exploreActions.toggleOriginToRouteMode()),
  routeFrom: () => dispatch(exploreActions.fetchRouteFrom()),
  setRoute: (r) => dispatch(routerActions.setRoute(r)),
  setRouteToDestinationDetail: (payload) =>
    dispatch(routerActions.setRouteToDestinationDetail(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Sidebar));
