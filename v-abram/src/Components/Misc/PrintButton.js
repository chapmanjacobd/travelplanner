import React, { Component } from 'react';
import Print from 'rc-print';
import { Typography, Button, Hidden } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
  NavigateNext,
  Home,
  WorkOutlineRounded as WorkOutline,
  LinkRounded,
  CheckCircle,
  PrintRounded,
} from '@material-ui/icons/';
import * as exploreActions from '../../actions/exploreActions';
import * as routerActions from '../../actions/routerActions';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = theme => ({
  paper: {
    maxWidth: 850,
    margin: 'auto',
    // overflow: 'hidden',
    marginTop: 20,
  },
  searchbar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchinput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  halfwidth: {
    maxWidth: '49%',
    overflow: 'hidden',
  },
  contentWrapper: {
    margin: '10px auto',
    overflow: 'auto',
  },
  button: {
    borderColor: lightColor,
    backgroundColor: '#dfd3c3',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0, 0.08)',
    },
  },
});

class PrintTrip extends Component {
  render () {
    let printDom = null;
    const { classes, states } = this.props;

    return (
      <div>
        <Hidden smDown>
          <Button
            variant='contained'
            className={classes.button}
            onClick={() => {
              printDom.onPrint();
            }}
          >
            <div style={{ color: '#888', display: 'flex', padding: '0 4px' }}>
              <PrintRounded />
            </div>
            <Typography style={{ color: '#555' }}>Print Trip</Typography>
          </Button>
        </Hidden>

        <Hidden mdUp>
          <Button
            variant='contained'
            className={classes.button}
            onClick={() => {
              printDom.onPrint();
            }}
          >
            <div style={{ color: '#888', display: 'flex', padding: '0 4px' }}>
              <PrintRounded />
            </div>
          </Button>
        </Hidden>

        <Print
          title='My Trip'
          ref={myPrint => (printDom = myPrint)}
          lazyRender
          isIframe={false}
          insertHead={false}
          otherStyle='@page { size: auto; margin: 0mm; }'
        >
          <div id='printwrap'>
            {states.map((el, i) => {
              return i === 0 ? null : (
                <h3>
                  {el.n} (Destination {i})
                </h3>
                // {getTextDateFromStartDate(lengths, start_date, i)}
              );
            })}
          </div>
          <Typography variant='caption'>powered by Rome2rio</Typography>
        </Print>
      </div>
    );
  }
}

const mapStateToProps = store => ({
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

export default connect(mapStateToProps)(withStyles(styles)(PrintTrip));
