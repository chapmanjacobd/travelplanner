import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core/';
import {
  TransferWithinAStationRounded,
  // bed costs
  AccessibilityNew, // couchsurfing
  Hotel, // bed
  MeetingRoom, // private room
  Home, // apartment, house rental
  // food costs
  LocalGroceryStore, // grocery
  // ShoppingBasket as LocalGroceryStore,
  Fastfood, // budget
  LocalDining, // dining out
  // {missing} fine dining
  // intra-city transport costs
  DirectionsCarTwoTone, // car rental
  DirectionsCar,
  Train,
  LocalTaxi,
  DirectionsBus,
  NaturePeopleTwoTone,
  Android,
  AddPhotoAlternateOutlined,
  PlaylistAddSharp,
  SwapVert as CellWifi,
} from '@material-ui/icons/';
import {
  setStartTripDate,
  setEndTripDate,
  setPref,
  setDuration,
} from '../../actions/exploreActions';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  iconButton: {
    display: 'block',
    // marginTop: theme.spacing.unit * 2,
    margin: 2,
    // padding: 4,
  },
  icon: {
    paddingRight: '3px',
  },
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
  formControl: {
    margin: 0,
    width: 0,
    height: 0,
    visibility: 'hidden',
    position: 'relative',
    right: '7%',
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});
const HotelIcon = props => {
  switch (props.type) {
    case 'none':
      return <AccessibilityNew />;
    case 'budget':
      return <Hotel />;
    case 'average':
      return <MeetingRoom />;
    case 'luxury':
      return <Home />;
  }
};
const FoodIcon = props => {
  switch (props.type) {
    case 'none':
      return <Android />;
    case 'budget':
      return <LocalGroceryStore />;
    case 'average':
      return <Fastfood />;
    case 'luxury':
      return <LocalDining />;
  }
};
const TransportIcon = props => {
  switch (props.type) {
    case 'none':
      return <NaturePeopleTwoTone />;
    case 'bus':
      return <DirectionsBus />;
    case 'train':
      return <Train />;
    case 'mixed':
      return <TransferWithinAStationRounded />;
    case 'taxi':
      return <LocalTaxi />;
    case 'rentacar':
      return <DirectionsCar />;
    case 'buyacar':
      return <DirectionsCarTwoTone />;
  }
};

class ModifyPrice extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      hotelPref: 'budget',
      foodPref: 'average',
      flightPriceTypePref: 'mixed',
      localTransportPref: 'mixed',
      hotelPrefOpen: false,
      foodPrefOpen: false,
      flightPriceTypePrefOpen: false,
      localTransportPrefOpen: false,
    };
  }

  handleChange = event => {
    //this.setState({ [event.target.name]: event.target.value });
    this.props.setPref({ type: event.target.name, value: event.target.value });
  };

  toggleOpen = name => {
    this.setState({ [name]: !this.state[name] });
  };

  render () {
    const { classes } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {/* <form autoComplete="off" className={classes.root}> */}

        <Tooltip title='Hotel type' disableFocusListener className={classes.iconButton}>
          <IconButton color='inherit' onClick={() => this.toggleOpen('hotelPrefOpen')}>
            <HotelIcon type={this.props.hotelPref} />
          </IconButton>
        </Tooltip>
        <FormControl className={classes.formControl}>
          <Select
            open={this.state.hotelPrefOpen}
            onClose={() => this.toggleOpen('hotelPrefOpen')}
            onOpen={() => this.toggleOpen('hotelPrefOpen')}
            value={this.props.hotelPref}
            onChange={this.handleChange}
            displayEmpty
            inputProps={{
              name: 'hotelPref',
              id: 'hotelPref-select',
            }}
          >
            <MenuItem value='none'>
              <AccessibilityNew className={classes.icon} />
              None
            </MenuItem>
            <MenuItem value='budget'>
              <Hotel className={classes.icon} />
              Budget / Hostel
            </MenuItem>
            <MenuItem value='average'>
              <MeetingRoom className={classes.icon} />
              Private Room
            </MenuItem>
            <MenuItem value='luxury'>
              <Home className={classes.icon} />
              Luxury / Private House
            </MenuItem>
          </Select>
        </FormControl>

        <Tooltip title='Dining personality' disableFocusListener className={classes.iconButton}>
          <IconButton color='inherit' onClick={() => this.toggleOpen('foodPrefOpen')}>
            <FoodIcon type={this.props.foodPref} />
          </IconButton>
        </Tooltip>
        <FormControl className={classes.formControl}>
          <Select
            open={this.state.foodPrefOpen}
            onClose={() => this.toggleOpen('foodPrefOpen')}
            onOpen={() => this.toggleOpen('foodPrefOpen')}
            value={this.props.foodPref}
            onChange={this.handleChange}
            displayEmpty
            inputProps={{
              name: 'foodPref',
              id: 'foodPref-select',
            }}
          >
            <MenuItem value='none'>
              <Android className={classes.icon} />
              None
            </MenuItem>
            <MenuItem value='budget'>
              <LocalGroceryStore className={classes.icon} /> Budget
            </MenuItem>
            <MenuItem value='average'>
              <Fastfood className={classes.icon} />
              Average
            </MenuItem>
            <MenuItem value='luxury'>
              <LocalDining className={classes.icon} />
              Luxury
            </MenuItem>
          </Select>
        </FormControl>

        <Tooltip
          title='Local transport preference'
          disableFocusListener
          className={classes.iconButton}
        >
          <IconButton color='inherit' onClick={() => this.toggleOpen('localTransportPrefOpen')}>
            <TransportIcon type={this.props.localTransportPref} />
          </IconButton>
        </Tooltip>
        <FormControl className={classes.formControl}>
          <Select
            open={this.state.localTransportPrefOpen}
            onClose={() => this.toggleOpen('localTransportPrefOpen')}
            onOpen={() => this.toggleOpen('localTransportPrefOpen')}
            value={this.props.localTransportPref}
            onChange={this.handleChange}
            inputProps={{
              name: 'localTransportPref',
              id: 'localTransportPref-select',
            }}
          >
            <MenuItem value='none'>
              <NaturePeopleTwoTone className={classes.icon} />
              None
            </MenuItem>
            <MenuItem value='bus'>
              <DirectionsBus className={classes.icon} />
              Bus
            </MenuItem>
            <MenuItem value='train'>
              <Train className={classes.icon} />
              Subway and Train
            </MenuItem>
            <MenuItem value='mixed'>
              <TransferWithinAStationRounded className={classes.icon} /> Mixed / Average
            </MenuItem>
            <MenuItem value='taxi'>
              <LocalTaxi className={classes.icon} /> Taxi and Uber
            </MenuItem>
            <MenuItem value='rentacar'>
              <DirectionsCar className={classes.icon} />
              Car Rental
            </MenuItem>
            <MenuItem value='buyacar'>
              <DirectionsCarTwoTone className={classes.icon} />
              Temporary Car Purchase
            </MenuItem>
          </Select>
        </FormControl>

        {/* <Tooltip title="Data usage per month">
          <TextField
            // value={datausepermonth}
            style={{ width: '5.5rem', padding: '0 4px' }}
            margin="dense"
            min="0"
            max="8888"
            type="number"
            id="dest-datause-set"
            name="dataUsePerMonth"
            className={(classes.margin, classes.textField)}
            // onChange={(e) => this.props.setdataUsePerMonth(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CellWifi style={{ fontSize: '1rem' }} />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">MB</InputAdornment>,
            }}
          />
        </Tooltip> */}

        {/* </form> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hotelPref: state.explore.prefs.hotelPref,
  foodPref: state.explore.prefs.foodPref,
  localTransportPref: state.explore.prefs.localTransportPref,
  duration: state.explore.prefs.duration,
  startTrioDate: state.explore.prefs.startDate,
  endTripDate: state.explore.prefs.endDate,
});
const mapDispatchToProps = dispatch => ({
  setPref: pref => dispatch(setPref(pref)),
  setDuration: duration => dispatch(setDuration(duration)),
  setStartTripDate: date => dispatch(setStartTripDate(date)),
  setEndTripDate: date => dispatch(setEndTripDate(date)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ModifyPrice));
