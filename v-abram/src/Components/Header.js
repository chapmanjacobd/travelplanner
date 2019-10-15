import React from 'react';
import {
  AppBar,
  Grid,
  Hidden,
  IconButton,
  Avatar,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  Button,
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import {
  Home,
  Help,
  Search,
  AddRounded as Add,
  ListAlt as ViewList,
  LinkRounded,
  CheckCircle,
} from '@material-ui/icons/';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import PrintButton from './Misc/PrintButton';
import Currencies from './Misc/Currencies';
// import GoogleSignIn from './Misc/GoogleLogin';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
  secondaryBar: {
    zIndex: 0,
  },
  tab: {
    background: '#fffdef99',
    padding: '0 8px',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0, 0.08)',
    },
  },
  menuButton: {
    marginLeft: -theme.spacing.unit,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
    backgroundColor: '#dfd3c3',
    margin: 4,
    '&:hover': {
      backgroundColor: 'rgba(0,0,0, 0.08)',
    },
  },
});

class Header extends React.Component {
  state = {
    value: 1,
    copied: false,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };

  shareUrl = () => {
    let url = window.location.href.split('?');

    let queryObject = queryString.parse(url[1]);
    queryObject.page = 'TRIP_OVERVIEW';
    url[1] = queryString.stringify(queryObject);
    return url.join('?');
  };

  render() {
    console.log(this.props);
    console.log(this.shareUrl());
    const { classes, show, setURL } = this.props;

    return (
      <React.Fragment>
        <AppBar color='primary' position='sticky' elevation={0}>
          <Toolbar>
            <Grid container spacing={8} alignItems='center'>
              <Toolbar style={{ paddingLeft: '0' }}>
                <Grid container alignItems='center' spacing={8}>
                  <Grid
                    item
                    xs
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    {!show ? (
                      <React.Fragment>
                        <Hidden xsDown>
                          <img
                            id='logo'
                            alt='UNLI'
                            className='travelplannerlogo'
                            title='TravelPlanner'
                            width='57px'
                            height='57px'
                            src={require('../images/logo_97_i.png')}
                          />
                        </Hidden>

                        <Typography variant='h5' style={{ padding: '0 10px' }}>
                          TravelPlan
                        </Typography>
                      </React.Fragment>
                    ) : null}

                    {show ? (
                      <React.Fragment>
                        <Hidden xsDown>
                          <img
                            id='logo'
                            alt='UNLI'
                            className='travelplannerlogo'
                            title='TravelPlanner'
                            width='57px'
                            height='57px'
                            src={require('../images/logo_97_i.png')}
                          />

                          <Typography variant='h5' style={{ padding: '0 10px' }}>
                            TravelPlan
                          </Typography>
                        </Hidden>
                      </React.Fragment>
                    ) : null}

                    {show ? (
                      <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        textColor='inherit'
                      >
                        <Tab
                          textColor='inherit'
                          icon={<Home />}
                          className={classes.tab}
                          label='New Trip'
                          href='/'
                          // onClick={() => this.props.setURL('INIT_VIEW')}
                        />

                        <Tab
                          textColor='inherit'
                          icon={<ViewList />}
                          className={classes.tab}
                          label='Trip Overview'
                          onClick={() => this.props.setURL('TRIP_OVERVIEW')}
                        />
                        <Tab
                          textColor='inherit'
                          icon={<Add />}
                          className={classes.tab}
                          label='Add Destination'
                          onClick={() => this.props.setURL('DEST_PICKER')}
                        />
                      </Tabs>
                    ) : null}
                  </Grid>
                </Grid>
              </Toolbar>
            </Grid>

            {show ? (
              <React.Fragment>
                <Grid item style={{ margin: '0 3px' }}>
                  <Hidden smDown>
                    <CopyToClipboard
                      text={this.shareUrl()}
                      onCopy={() => this.setState({ copied: true })}
                    >
                      <Tooltip title='Copy URL'>
                        <Button variant='contained' className={classes.button} style={{}}>
                          <div style={{ color: '#888', display: 'flex', padding: '0 4px' }}>
                            <LinkRounded />
                          </div>
                          <Typography
                            style={{
                              color: '#555',
                              width: 80,
                            }}
                          >
                            Save and Share URL
                          </Typography>
                          {this.state.copied ? (
                            <div style={{ color: 'green', display: 'flex', padding: '0 6px' }}>
                              <CheckCircle />
                            </div>
                          ) : null}
                        </Button>
                      </Tooltip>
                    </CopyToClipboard>
                  </Hidden>

                  <Hidden mdUp>
                    <CopyToClipboard
                      text={this.shareUrl()}
                      onCopy={() => this.setState({ copied: true })}
                    >
                      <Button variant='contained' className={classes.button}>
                        <div style={{ color: '#888', display: 'flex', padding: '0 4px' }}>
                          <LinkRounded />
                        </div>
                      </Button>
                    </CopyToClipboard>
                  </Hidden>
                </Grid>

                {/* <Grid item style={{ margin: '0 3px' }}>
                  <Tooltip title='Print'>
                    <PrintButton />
                  </Tooltip>
                </Grid> */}
              </React.Fragment>
            ) : null}

            <Grid item style={{ margin: '0 6px', display: 'flex' }}>
              {/* <Currencies /> */}

              {/* <GoogleSignIn /> */}

              {/* <Hidden smDown>
                <Tooltip title="Help">
                  <IconButton color="inherit">
                    <Help />
                  </IconButton>
                </Tooltip>
              </Hidden>

              <Hidden mdUp>
                <Tooltip title="Help">
                  <Button variant="contained" className={classes.button}>
                    <div style={{ color: '#888', display: 'flex', padding: '0 4px' }}>
                      <Help />
                    </div>
                  </Button>
                </Tooltip>
              </Hidden> */}
            </Grid>

            {/* hidden until we add functionality
        <Tooltip title="Undo">
            <IconButton color="inherit" >
              <Undo/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
            <IconButton color="inherit" >
              <Redo/>
            </IconButton>
        </Tooltip> */}
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Header);
