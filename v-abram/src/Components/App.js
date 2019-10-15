import React, { Component } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { connect } from 'react-redux';
import InitView from './MainLayout';
import '../styles/App.css';
// import * as exploreActions from '../actions/exploreActions';
import API_URL from './Misc/API_URL';
import { countryOptions } from './SelectDestination/data/countryOptions';
import { countryIndex } from './SelectDestination/data/countryIndex';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';

class App extends Component {
  componentDidMount() {
    fetch(API_URL + '/getpassportallfilterinfo/')
      .then(res => {
        res.json().then(data => {
          // console.log(data);
          const country = data.message;
          let j;
          for (let i = 0; i < 199; i++) {
            j = countryIndex[country[i].u];
            countryOptions[j].data = country[i];
          }
        });
      })
      .then(json => console.log(json));
  }
  render() {
    // this.props.fetchInitCitiesAirportData();

    return (
      <HelmetProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div style={{ backgroundColor: '#f5f5f5' }}>
            <Helmet
              // (optional) set to false to disable string encoding (server-only)
              encodeSpecialCharacters
              titleTemplate="%s | UNLI TravelPlan"
              defaultTitle="Plan short trips and global expeditions / UNLI TravelPlan"
              // {/* (optional) callback that tracks DOM changes */}
              // onChangeClientState={(newState, addedTags, removedTags) => console.log(newState, addedTags, removedTags)}
            >
              <title itemProp="name" lang="en">
                {/* if one destination added then return {%origin%} to {%destinations%} travel budget */}
              </title>
              <link
                rel="icon"
                type="image/png"
                href="favicon.ico"
                sizes="16x16"
              />
            </Helmet>
            <React.Fragment>
              <InitView />
            </React.Fragment>
          </div>
        </MuiPickersUtilsProvider>
      </HelmetProvider>
    );
  }
}

const mapStateToProps = store => ({
  today: store.explore.today,
  start_date: store.explore.start_date,
  states: store.explore.states,
  origin: store.explore.origin,
  lengths: store.explore.lengths,
  kiwi_links_historical: store.explore.kiwi_links_historical
});

const mapDispatchToProps = dispatch => ({
  // fetchInitCitiesAirportData: () => dispatch(exploreActions.fetchInitCitiesAirportData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
