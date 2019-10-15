import React from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { CssBaseline, Card, CardContent, Hidden } from '@material-ui/core/';
import * as exploreActions from '../actions/exploreActions';
import * as routerActions from '../actions/routerActions';
import Header from './Header';
import SidebarLeft from './SidebarLeft';
import InitView from './Init/InitView';
import TripOverview from './TripOverview/TripOverview';
import DestinationCardHandler from './TripOverview/DestinationCardHandler';
import TripSummary from './TripSummary/TripSummary';
import SelectDestination from './SelectDestination/SelectDestination';
import AdviceCard from './Misc/AdviceCard';
import Legal from './Misc/Legal';
import SelectDestinationViewCards from './SelectDestination/SelectDestinationViewCards';
import DestinationDetail from './ViewDestination/DestinationDetail';
import * as helpers from './helpers/helpers.js';

let theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 984,
      lg: 1400,
      xl: 1880,
    },
  },
  typography: {
    useNextVariants: true,
    allVariants: {
      letterSpacing: 0,
    },
    h5: {
      // fontWeight: 500,
      // fontSize: 26,
      // letterSpacing: 0.5,
    },
  },
  palette: {
    // type: 'dark',
    primary: {
      light: '#F5F5F5',
      main: '#EAE4D0',
      dark: '#221e0f',
      contrastText: '#000',
    },
    secondary: {
      light: '#cfff94',
      main: '#95cf71',
      dark: '#6b9b36',
      contrastText: '#000',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

theme = {
  ...theme,
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#222',
      },
    },
    MuiPickersDay: {
      isSelected: {
        backgroundColor: '#888',
      },
    },
    MuiDrawer: {
      paper: {
        backgroundColor: '#eee',
      },
    },
    MuiButton: {
      label: {
        textTransform: 'initial',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
    MuiSvgIcon: {
      root: {
        fontSize: '2rem',
      },
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing.unit,
      },
      // indicator: {
      //   height: 4,
      //   // borderTopLeftRadius: 2,
      //   // borderTopRightRadius: 2,
      //   // backgroundColor: theme.palette.common.black,
      // },
    },
    MuiFab: {
      label: {
        // left: 5,
        // position: 'relative',
      },
      extended: {
        backgroundColor: '#f5f4ee',
        '&:hover': {
          backgroundColor: '#d8d8d8',
        },
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderColor: 'transparent !important',
      },
    },
    // MuiGrid: {
    //   'spacing-xs-8': {
    //     '& $item': {
    //       padding: '4px 0',
    //     },
    //   },
    // },
    MuiToolbar: {
      gutters: {
        [theme.breakpoints.down('xs')]: {
          padding: 0,
        },
      },
    },
    MuiTableBody: {
      root: {
        // cursor: 'pointer',
      },
    },
    MuiTableRow: {
      root: {
        height: '32px',
        transition: 'all 0.4s cubic-bezier(.25,.8,.25,1)',
      },
      head: {
        height: '42px',
        transition: 'all 0.4s cubic-bezier(.25,.8,.25,1)',
      },
      footer: {
        height: 36,
      },
    },
    MuiTablePagination: {
      toolbar: {
        height: '32px',
        minHeight: '32px',
      },
    },
    MuiTableCell: {
      root: {
        padding: '4px',
        transition: 'all 0.4s cubic-bezier(.25,.8,.25,1)',
        '&:first-child': {
          paddingLeft: 14,
        },
        '&:last-child': {
          paddingRight: 14,
          minWidth: 115,
        },
      },
      body: {
        fontSize: '1rem',
      },
    },
    MuiTab: {
      root: {
        textTransform: 'initial',
        margin: '0',
        minWidth: 0,
        [theme.breakpoints.up('md')]: {
          minWidth: 0,
        },
      },
      labelContainer: {
        padding: 0,
        [theme.breakpoints.up('md')]: {
          padding: 0,
        },
      },
      wrapper: {
        fontSize: '1rem',
      },
    },
    MUIDataTable: {
      root: {
        paper: {
          boxShadow: 'none',
        },
      },
      responsiveScroll: {
        [theme.breakpoints.up('sm')]: {
          maxHeight: 'none !important',
          maxWidth: 'calc(100vw - 400px)',
        },
        [theme.breakpoints.down('sm')]: {
          maxHeight: 'none !important',
          maxWidth: 'calc(100vw - 14px)',
        },
      },
    },
    MuiTableSortLabel: {
      icon: {
        color: '#888',
      },
    },
    MUIDataTableToolbar: {
      root: {
        // flexDirection: 'column',
        // alignItems: 'flex-start',
      },
      left: {
        // flex: '0',
        flex: '1 1 44%',
        [theme.breakpoints.down('sm')]: {
          textAlign: 'center',
        },
      },
      actions: {
        flex: '0 0 56%',
        // display: 'flex',
      },
    },
    MUIDataTableHeadCell: {
      fixedHeader: {
        wordBreak: 'keep-all',
        '&:first-child': {
          paddingLeft: '22px !important',
        },
      },
      sortAction: {
        // display: 'none',
        padding: 0,
        width: 0,
        position: 'absolute',
      },
      toolButton: {
        fontSize: '1rem',
        display: 'initial',
      },
    },
    MUIDataTableBodyRow: {
      root: {
        backgroundColor: '#fff',
        '&:nth-child(odd)': {
          backgroundColor: '#eee',
        },
        '&:hover': {
          textDecoration: 'underline',
          backgroundColor: theme.palette.secondary.main + ' !important',
        },
      },
    },
    MUIDataTableBodyCell: {
      root: {
        transition: 'all 0.3s cubic-bezier(.25, .8, .25, 1)',
      },
    },
    MuiNativeSelect: {
      icon: {
        top: 'calc(50% - 18px)',
      },
    },
    MuiIconButton: {
      root: {
        padding: '6px',
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
        fontSize: 16,
        backgroundColor: '#fff',
        opacity: 1,
        color: '#000',
        border: '1px solid #888',
      },
      popper: {
        opacity: 1,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854',
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
    MuiInputLabel: {
      shrink: {
        whiteSpace: 'nowrap',
      },
    },
    MuiInputAdornment: {
      positionStart: {
        marginRight: '4px',
        width: 0,
      },
      positionEnd: {
        marginLeft: '4px',
        // width: 0,
      },
    },
    MuiFormControlLabel: {
      root: {
        marginLeft: '0 !important',
        marginRight: '0',
      },
    },
    MuiCard: {
      root: {
        marginBottom: 2,
      },
    },
  },
  props: {
    MuiTab: {
      // disableRipple: true,
    },
  },
  mixins: {
    ...theme.mixins,
    toolbar: {
      minHeight: 48,
    },
  },
};

const drawerLeftWidth = '325px';
const drawerRightWidth = '325px';

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  drawerLeft: {
    [theme.breakpoints.up('md')]: {
      width: drawerLeftWidth,
      flexShrink: 0,
    },
  },
  drawerRight: {
    [theme.breakpoints.up('lg')]: {
      width: drawerRightWidth,
      flexShrink: 0,
    },
  },
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
    padding: '48px 36px 0',
    background: '#eaeff1',
  },
  main: {
    display: 'flex',
    height: '100%',
    backgroundColor: '#eee',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  selectdestination: {
    flexDirection: 'column',
    width: '100%',
    flexGrow: 1,
    [theme.breakpoints.up('md')]: {
      padding: '0 20px 20px 20px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 6px 8px 8px',
    },
  },
};

class MainLayout extends React.Component {
  handleDrawerToggle = () => {
    this.setState((state) => ({ mobileOpen: !state.mobileOpen }));
  };

  showCurrentPage = (classes) => {
    switch (this.props.currentPage) {
      case 'INIT_VIEW':
        return (
          <InitView
            setDestination={this.props.setDestination}
            setURL={this.props.setURL}
            className={classes.mainContent}
            cities_airport={this.props.cities_airport}
            setStartDate={this.props.setStartDate}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            setEndDate={this.props.setEndDate}
          />
        );
      case 'DEST_PICKER':
        return (
          <div className={classes.selectdestination}>
            <SelectDestination
              setURL={this.props.setURL}
              current_state={this.props.current_state}
            />
          </div>
        );
      case 'DEST_PICKER_CARDVIEW':
        return (
          <SelectDestinationViewCards
            setURL={this.props.setURL}
            current_state={this.props.current_state}
          />
        );
      case 'TRIP_OVERVIEW':
        return (
          <div className={classes.selectdestination}>
            <TripOverview setURL={this.props.setURL} current_state={this.props.current_state} />
          </div>
        );

      case 'DESTINATION_DETAIL': {
        console.log(this.props.states[this.props.destinationDetailIndex]);
        return (
          <DestinationDetail
            city={{
              ...this.props.states[this.props.destinationDetailIndex],
              percentage: helpers.calculatePercentage(
                this.props.destinationDetailIndex,
                this.props.lengths
              ),
              dates: helpers.getTextDateFromStartDate(
                this.props.lengths,
                this.props.start_date,
                this.props.destinationDetailIndex
              ),
            }}
          />
        );
      }
      // <DestinationDetail city={{...states[1], }/>

      // have a selectedDestinationDetailIndex -- then grab the index and use that to get the city from states,
    }
  };
  show = () => {
    return this.props.currentPage !== 'INIT_VIEW';
  };

  render() {
    // console.table(this.props);

    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />

          <div className={classes.appContent} itemType='https://schema.org/Trip' itemScope=''>
            {this.show() ? (
              <Hidden smDown implementation='js'>
                <Header show={this.show()} setURL={this.props.setURL} />
              </Hidden>
            ) : (
              <Header show={this.show()} setURL={this.props.setURL} />
            )}
            <main className={classes.main}>
              <SidebarLeft
                show={this.show()}
                current_state={this.props.current_state}
                setURL={this.props.setURL}
              />

              <div style={{ display: 'flex', flexGrow: '1', flexDirection: 'column' }}>
                {this.show() ? (
                  <Hidden mdUp implementation='js'>
                    <div className={classes.paper}>
                      <Card className={classes.card}>
                        <CardContent className={classes.content}>
                          <TripSummary
                            leg_prices={this.props.leg_prices}
                            day_prices={this.props.day_prices}
                            lengths={this.props.lengths}
                            origin={this.props.origin}
                            start_date={this.props.start_date}
                            setStartDate={this.props.setStartDate}
                            onClick={this.book}
                            route_to_origin={this.props.route_to_origin}
                            toggleOriginToRouteMode={this.props.toggleOriginToRouteMode}
                            current_state={this.props.current_state}
                          />
                        </CardContent>
                      </Card>

                      <DestinationCardHandler
                        lengths={this.props.lengths}
                        start_date={this.props.start_date}
                        show={this.show()}
                        states={this.props.states}
                      />

                      <Header show={this.show()} setURL={this.props.setURL} />
                    </div>
                  </Hidden>
                ) : null}

                {this.showCurrentPage(classes)}

                {this.show() ? (
                  <React.Fragment>
                    <Hidden xlUp implementation='js'>
                      <AdviceCard />
                    </Hidden>
                  </React.Fragment>
                ) : null}
                <Hidden xlUp implementation='js'>
                  <Legal bgcolor='#fff' />
                </Hidden>
                {!this.show() ? (
                  <Hidden lgDown implementation='js'>
                    <Legal bgcolor='#f5f5f5' />
                  </Hidden>
                ) : null}
              </div>
            </main>
          </div>

          {/* <Hidden lgDown implementation='js'>
            <SidebarRight show={this.show()} PaperProps={{ style: { width: drawerRightWidth } }} />
          </Hidden> */}
        </div>
      </MuiThemeProvider>
    );
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
  routes: store.explore.routes,
  states: store.explore.states,
  current_state: store.explore.states[store.explore.current_index],
  destinationDetailIndex: store.router.destinationDetailIndex,
});

const mapDispatchToProps = (dispatch) => ({
  setOrigin: (o) => dispatch(exploreActions.setOrigin(o)),
  setStartDate: (d) => dispatch(exploreActions.setStartDate(d)),
  setComfortLevel: (c) => dispatch(exploreActions.setComfortLevel(c)),
  setNumPeople: (p) => dispatch(exploreActions.setNumPeople(p)),
  toggleOriginToRouteMode: () => dispatch(exploreActions.toggleOriginToRouteMode()),
  routeFrom: () => dispatch(exploreActions.fetchRouteFrom()),
  setURL: (r) => dispatch(routerActions.setRoute(r)),
  setEndDate: (d) => dispatch(exploreActions.setEndDate(d)),
  setDestination: (d) => dispatch(exploreActions.setDestination(d)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MainLayout));
