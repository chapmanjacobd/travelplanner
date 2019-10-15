import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { InlineDatePicker } from 'material-ui-pickers';
import {
  AppBar,
  Paper,
  Toolbar,
  Typography,
  Grid,
  TextField,
  Fab,
  FormControlLabel,
  Switch,
  InputAdornment,
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import {
  NavigateNext,
  Home,
  MoneyRounded,
  WorkOutlineRounded as WorkOutline,
} from '@material-ui/icons/';
import {
  setStartTripDate,
  setEndTripDate,
  setBudget,
  setPrevDestination,
} from '../../actions/exploreActions';
import OriginDownshift from './OriginDownshift';
import GroupMode from '../SelectDestination/GroupMode';

const styles = (theme) => ({
  paper: {
    maxWidth: 900,
    // minWidth: 650,
    // overflow: 'hidden',
    zIndex: 1,
    [theme.breakpoints.up('md')]: {
      marginTop: '10vh',
      margin: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '10vh 8px auto 8px',
    },
  },
  searchbar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: '8px',
  },
  searchinput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  contentWrapper: {
    margin: '10px auto',
    overflow: 'auto',
  },
  button: {
    display: 'flex',
    margin: '4px 20px 8px auto',
    padding: '6px 22px',
    height: 56,
    borderRadius: 5,
    border: '2px solid #555',
  },
  inittitle: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  initupper: {
    // [theme.breakpoints.down('sm')]: {
    //   flexDirection: 'column',
    // },
  },
  initlower: {
    margin: '8px',
    // [theme.breakpoints.up('sm')]: {
    //   justifyContent: 'space-between',
    // },
    // [theme.breakpoints.down('sm')]: {
    //   justifyContent: 'center',
    // },
  },
});

let API_URL = 'http://localhost:3005';

if (process.env.NODE_ENV === 'production') {
  API_URL = 'https://travel.unli.xyz/api';
}

async function searchOrigin(input){
  if (input) {
    const { data } = await axios.get(`${API_URL}/searchOrigin?input=${input}`);
    // console.log(data);

    return data;
  } else {
    return [ '...' ];
  }
}

class Content extends Component {
  state = {
    input: '',
    results: [],
    today: new Date(),
    origin: {
      index: 0,
    },
    returnHome: '',
    originSet: false,
  };

  handleStartDateChange = (newDate) => {
    // this.setState(prevState => {
    //   return {
    //     startDate: newDate,
    //     endDate: addDays(newDate, prevState.duration),
    //   };
    // });
    this.props.setStartTripDate(newDate);
  };
  handleEndDateChange = (newDate) => {
    // this.setState(prevState => {
    //   return {
    //     duration: dateDiffInDays(newDate, prevState.startDate),
    //     endDate: newDate,
    //   };
    // });
    this.props.setEndTripDate(newDate);
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleChangeBudget = (event) => {
    this.props.setBudget(event.target.value * 1);
  };

  handleInput = (input) => {
    searchOrigin(input).then((results) => {
      // console.log(results);
      this.setState({ results });
    });
  };

  // have a function to receive the typing, sends it back to the api, then sets the value to the state.
  // the state will be constantly be fed back to the origin downshift to display the values.

  setOrigin = (origin) => {
    const originSet = true;
    // console.log(origin);

    this.setState({ ...this.state.origin, origin, originSet }, console.log(this.state));
    this.props.setPrevDestination({ n: origin.n, s: origin.s });
  };

  next = () => {
    // console.log(this.state.origin);
    // .then(console.log("FINISHED"));
    this.props.setURL('DEST_PICKER');
    const origin = { ...this.state.origin };
    origin.index = 0;
    console.log(origin, 'INIT VIEW CHECKER!');
    this.props.setDestination(origin);
  };
  // first time endDate is set then set returnHome to true
  // returnHomeLabel = () => {
  //   // if returnHome = true, change text to "Return Home"
  //   return 'Explore';
  // };

  render() {
    const { classes, returnHomeLabel } = this.props;
    const { results } = this.state;
    // console.log(this.props);
    // console.log(results);

    return (
      <React.Fragment>
        <Paper className={classes.paper} style={{ backgroundColor: '#888' }}>
          <AppBar
            className={classes.searchbar}
            position='static'
            color='default'
            elevation={0}
            style={{ backgroundColor: '#fff' }}
          >
            <Toolbar style={{ paddingBottom: '20px' }}>
              <Grid container spacing={16} alignItems='center'>
                <Grid item xs>
                  <div className={classes.margin}>
                    <Typography
                      variant='h6'
                      style={{ padding: '10px 0 0 0' }}
                      className={classes.inittitle}
                    >
                      Welcome! Planning a trip?
                    </Typography>

                    <Grid container spacing={8} alignItems='flex-end' className={classes.initupper}>
                      <Grid item style={{ flexDirection: 'row', display: 'flex', margin: 'auto' }}>
                        <OriginDownshift
                          handleInput={this.handleInput}
                          setOrigin={this.setOrigin}
                          className='origin'
                          target='origin'
                          // label='Where are you from?'
                          results={results}

                          // cities_airport={this.state.result}
                          // setCity={this.props.setOrigin}
                          // cities={this.props.city_data}
                        />
                      </Grid>
                      {/* <Grid
												item
												style={{ flexDirection: 'row', display: 'flex', margin: 'auto' }}
											>
												<GroupMode />
											</Grid> */}
                      {/* </Grid>
                    <Grid container spacing={8} alignItems='flex-end' className={classes.initlower}> */}
                      <Grid item style={{ flexDirection: 'row', display: 'flex', margin: 'auto' }}>
                        <InlineDatePicker
                          label='Trip Start'
                          value={this.props.startTripDate}
                          onChange={this.handleStartDateChange}
                          margin='dense'
                          minDate={this.state.today}
                          style={{ color: 'black' }}
                        />
                      </Grid>
                      <Grid item style={{ flexDirection: 'row', display: 'flex', margin: 'auto' }}>
                        <TextField
                          id='triptarget'
                          label='Target trip budget'
                          placeholder='$2300'
                          value={this.props.budget}
                          onChange={this.handleChangeBudget}
                          type='number'
                          min='1'
                          step='any'
                          margin='dense'
                          style={{
                            width: 105,
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start' style={{ paddingRight: '8px' }}>
                                $
                              </InputAdornment>
                            ),
                            // endAdornment: <InputAdornment position="end">MB</InputAdornment>,
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      {/* <Grid item>
                        <InlineDatePicker
                          label='Trip End (Optional)'
                          value={this.props.endTripDate}
                          onChange={this.handleEndDateChange}
                          margin='dense'
                        />
                      </Grid> */}

                      {/* <Grid item>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={this.state.checkedReturnHome}
                              onChange={this.handleChange('checkedReturnHome')}
                              value='returnHome'
                            />
                          }
                          label='Explore'
                          labelPlacement='end'
                        />
                      </Grid> */}
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <div className={classes.contentWrapper}>
            <Fab
              variant='extended'
              onClick={() => this.next()}
              color='secondary'
              className={classes.button}
              id='initNext'
              disabled={!this.state.originSet}
            >
              Next <NavigateNext />
            </Fab>
          </div>
        </Paper>
        <div
          style={{
            backgroundSize: 'cover',
            // var item = items[Math.floor(Math.random()*items.length)];
            backgroundImage: "url('https://travel.unli.xyz/cityphotos/detail/uk4k5m.jpg')",
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  startTripDate: state.explore.prefs.startTripDate,
  endTripDate: state.explore.prefs.endTripDate,
  budget: state.explore.prefs.budget,
});
const mapDispatchToProps = (dispatch) => ({
  setStartTripDate: (date) => dispatch(setStartTripDate(date)),
  setEndTripDate: (date) => dispatch(setEndTripDate(date)),
  setBudget: (budget) => dispatch(setBudget(budget)),
  setPrevDestination: (payload) => dispatch(setPrevDestination(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Content));
