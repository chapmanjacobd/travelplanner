import React from 'react';
import {
  Hidden,
  Card,
  CardContent,
  Grid,
  Fab,
  Typography,
  Tooltip,
  IconButton,
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { Add, AddPhotoAlternateOutlined, PlaylistAddSharp } from '@material-ui/icons/';
import { connect } from 'react-redux';
import * as exploreActions from '../actions/exploreActions';
import * as routerActions from '../actions/routerActions';
import TripSummary from './TripSummary/TripSummary';
import ModifyPrice from './Misc/ModifyPrice';
import DestinationCardHandler from './TripOverview/DestinationCardHandler';

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

class Sidebar extends React.Component {
  state = {};

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
      currentPage,
      setOrigin,
      setComfortLevel,
      setNumPeople,
      setRoute,
      leg_prices,
      day_prices,
      lengths,
      start_date,
      setStartDate,
      route_to_origin,
      toggleOriginToRouteMode,
      show,
      classes,
      routeFrom,
      states,
      // ...other
    } = this.props;

    if (show) {
      return (
        <Hidden xsDown implementation='js'>
          <div
            style={{
              padding: '0 20px',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Hidden smDown implementation='js'>
              <Grid style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Grid item style={{ margin: '8px' }}>
                  <ModifyPrice
                    setPrefValues={this.setPrefValues}
                    lengthOfStay={this.props.lengthOfStay}
                    setLengthOfStay={this.props.setLengthOfStay}
                    currentPage={this.props.currentPage}
                  />
                </Grid>
              </Grid>
              <Card className={classes.card}>
                <CardContent className={classes.content}>
                  <TripSummary
                    leg_prices={leg_prices}
                    day_prices={day_prices}
                    lengths={lengths}
                    origin={origin}
                    start_date={start_date}
                    setStartDate={setStartDate}
                    onClick={this.book}
                    route_to_origin={route_to_origin}
                    toggleOriginToRouteMode={toggleOriginToRouteMode}
                    current_state={this.props.current_state}
                  />
                </CardContent>
              </Card>

              <DestinationCardHandler
                lengths={lengths}
                start_date={start_date}
                show={show}
                states={states}
              />

              <Grid style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Grid item style={{ margin: '8px' }}>
                  <Fab
                    variant='extended'
                    color='secondary'
                    className={classes.button}
                    onClick={() => this.props.setURL('DEST_PICKER')}
                  >
                    <Add /> <Typography>Add Destination</Typography>
                  </Fab>
                </Grid>
              </Grid>
            </Hidden>
          </div>

          {/* miniDisplay ? */}
          {/* <HowTo/> 
          or ? https://www.npmjs.com/package/react-cardstack 
          */}
        </Hidden>
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
  setDestination: (city) => dispatch(exploreActions.setDestination(city)),
  toggleOriginToRouteMode: () => dispatch(exploreActions.toggleOriginToRouteMode()),
  routeFrom: () => dispatch(exploreActions.fetchRouteFrom()),
  setRoute: (r) => dispatch(routerActions.setRoute(r)),
  setURL: (r) => dispatch(routerActions.setRoute(r)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Sidebar));
