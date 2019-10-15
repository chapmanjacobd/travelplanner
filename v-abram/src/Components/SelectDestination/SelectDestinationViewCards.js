import React, { Component } from 'react';
import {
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { AddPhotoAlternateOutlined, PlaylistAddSharp } from '@material-ui/icons/';
import * as explore from '../../actions/exploreActions';
import '../../images/flags/flags.min.css';
import '../../images/flags/flags.png';
import Progress from '../Misc/Progress';
import FilterDestinations from './FilterDestinations';
import FilterByTransport from './FilterByTransport';
import FilterByZoom from './FilterByZoom';
import * as routerActions from '../../actions/routerActions';

const styles = theme => ({
  paper: {
    maxWidth: 968,
    margin: 'auto',
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
  contentWrapper: {
    margin: '20px 16px',
  },
  card: {
    maxWidth: 345,
  },
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
  },
});

const prevDestinationName = props => {
  return props.current_state.n;
};

class SelectDestination extends Component {
  state = {
    foodPref: '',
    hotelPref: '',
    localTransportPref: '',
    lengthOfStay: this.defaultLengthOfStay(),
  };

  // this only works with the first time. not the last time.

  defaultLengthOfStay () {
    if (this.props.currentIndex === 0) {
      // console.log(endDate);
      var date1 = new Date(this.props.endDate);
      var date2 = new Date(this.props.startDate);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      //console.log(diffDays);
      return diffDays;
    } else {
      return 8;
    }
  }

  togglePrefOpen = name => {
    //console.log('toggling open');
    this.setState({
      [name]: ![
        name,
      ],
    });
  };
  setPrefValues = state => {
    const { foodPref, hotelPref, localTransportPref, lengthOfStay } = state;
    this.setState({ foodPref, hotelPref, localTransportPref, lengthOfStay }, () =>
      this.props.updateDestinationPrefs({ value: this.state }),
    );
  };

  render () {
    const { classes, routes, currentState } = this.props;
    const options = {
      textLabels: {
        body: {
          noMatch:
            'No destinations found. Try back in a few hours and click the Feedback button if there still are none',
        },
      },
      // filterType: '',
      // pagination: false,
      fixedHeader: true,
      rowsPerPage: 75,
      selectableRows: false,
      responsive: 'scroll',
      print: false,
      download: false,
      setRowProps: null,
      // customToolbar: (value, tableMeta, updateValue) => {
      //   return <FilterDestinations />;
      // },
      onRowClick: (rowData, rowMeta) => {
        console.log(rowData[rowData.length - 1]);
        this.props.setDestination({ k: rowData[rowData.length - 1] });
      },
      // function(row: array, rowIndex: number) => object
      // onRowClick: null,
      // function(rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => void
    };
    // console.log(typeof(routes))
    let { data } = routes;

    return (
      <div
        style={{
          flexDirection: 'column',
          width: '100%',
          // height: '90vh',
          padding: '0 20px 20px 20px',
          flexGrow: 1,
        }}
      >
        <Toolbar
          style={{
            justifyContent: 'start',
            padding: 0,
            minHeight: 64,
          }}
        >
          <div
            style={{
              // filter: 'drop-shadow(rgba(255, 255, 255, 2) 0px 0px 1px)',
              // border: '2px solid #f9f9f9',
              // padding: 2,
              // backgroundColor: 'whitesmoke',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <FilterDestinations />
            {/* <Typography variant="h6" style={{ fontWeight: 400 }}>
              Cost ingredients:
            </Typography> */}
          </div>
        </Toolbar>
        {routes && routes.status !== 'loading' ? (
          <div>
            <Paper
              style={{
                padding: 8,
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'center',
              }}
            >
              <div style={{ alignContent: 'center', display: 'flex' }}>
                <Typography
                  variant='h6'
                  style={{ margin: 'auto', lineHeight: 1 }}
                >{`Destinations from ${prevDestinationName(this.props)}:`}</Typography>
              </div>

              <div>
                <FilterByTransport />
                <FilterByZoom />
                <Tooltip title='Change view mode'>
                  <IconButton
                    aria-label='List View'
                    onClick={() => this.props.setURL('DEST_PICKER')}
                  >
                    <PlaylistAddSharp className={classes.icon} />
                  </IconButton>
                </Tooltip>
              </div>
            </Paper>

            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  component='img'
                  alt='Contemplative Reptile'
                  className={classes.media}
                  height='140'
                  image='https://travel.unli.xyz/cityphotos/view/uk4k5m.jpg'
                  title='Contemplative Reptile'
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='h2'>
                    Honolulu
                  </Typography>
                  <Typography component='p'>
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species,
                    ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button color='black' style={{ fontWeight: 600 }}>
                  Choose destination
                </Button>
              </CardActions>
            </Card>
          </div>
        ) : (
          <Progress />
        )}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  endDate: store.explore.end_date,
  startDate: store.explore.start_date,
  routes: store.explore.routes[store.explore.routes.length - 1],
  currentIndex: store.explore.current_index,
  lengthOfStay: store.explore.displayedLengthOfStay,
});
const mapDispatchToProps = dispatch => ({
  setDestination: city => dispatch(explore.setDestination(city)),
  updateDestinationPrefs: payload => dispatch(explore.updateDestinationPrefs(payload)),
  setLengthOfStay: length => dispatch(explore.setDisplayedLengthOfStay(length)),
  setURL: r => dispatch(routerActions.setRoute(r)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SelectDestination));
