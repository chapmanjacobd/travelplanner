import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, MenuItem, Select, FormControl, IconButton } from '@material-ui/core/';
import {
  DirectionsBus,
  DirectionsTransit,
  Reorder,
  LocalTaxi,
  Train,
  Flight,
  FastForwardOutlined,
  History,
} from '@material-ui/icons';

const styles = theme => ({
  root: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    // minWidth: 120,
    // maxWidth: 220,
    // margin: '6px 8px 6px 4px',
    alignItems: 'center',
  },
  icon: {
    paddingRight: '3px',
  },
  iconButton: {
    // display: 'block',
    // marginTop: theme.spacing.unit * 2,
    // margin: 2,
    // padding: 4,
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
  // MuiFormLabel: {
  //   color: 'rgba(0, 0, 0, 0.87)',
  //   padding: 0,
  //   fontSize: '0.875rem',
  //   transition:
  //     'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  //   fontFamily: 'Roboto", "Helvetica", "Arial", sans-serif',
  //   // backgroundColor: '#e0e0e0',
  //   justifyContent: 'center',
  // },
  noLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  listText: {
    padding: '0 8px 0 0 !important',
  },
});

const names = [
  { value: 'bus', icon: 'DirectionsBus', label: 'Destinations by bus' },
  { value: 'train', icon: 'Train', label: 'Destinations by train' },
  { value: 'taxi', icon: 'LocalTaxi', label: 'Destinations by car, taxi, and uber' },
  { value: 'flight', icon: 'Flight', label: 'Destinations by direct flight' },
  {
    value: 'twoflights',
    icon: 'FastForwardOutlined',
    label: 'Destinations by flights with one connection',
  },
];

class FilterDestinations extends React.Component {
  state = {
    name: [
      'bus',
      'train',
      'taxi',
      'flight',
      'twoflights',
    ],
    transportPrefOpen: false,
    lengthOfStay: this.props.defaultLengthOfStay ? this.props.defaultLengthOfStay : 8,
  };

  handleChangePassport = event => {
    console.log(event);
    this.setState({ [event.target.name]: event.target.value }, () =>
      this.props.setPrefValues(this.state),
    );
    console.log('handlingChange');
  };

  toggleOpen = name => {
    this.setState({ [name]: !this.state[name] });
  };

  handleChange = event => {
    this.setState({ name: event.target.value });
  };

  handleChangeMultiple = event => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({
      name: value,
    });
  };

  render () {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Tooltip title='Filter destinations by transport' className={classes.iconButton}>
          <IconButton onClick={() => this.toggleOpen('transportPrefOpen')}>
            <DirectionsTransit />
          </IconButton>
        </Tooltip>
        <FormControl className={classes.formControl}>
          <Select
            multiple
            open={this.state.transportPrefOpen}
            onClose={() => this.toggleOpen('transportPrefOpen')}
            onOpen={() => this.toggleOpen('transportPrefOpen')}
            value={this.state.name}
            onChange={this.handleChange}
            inputProps={{
              name: 'transportPref',
              id: 'transportPref-select',
            }}
          >
            <MenuItem value='avg'>
              <History className={classes.icon} />Use historical average flight price
            </MenuItem>
            <MenuItem value='bus'>
              <DirectionsBus className={classes.icon} />Destinations by bus
            </MenuItem>
            <MenuItem value='train'>
              <Train className={classes.icon} />Destinations by train
            </MenuItem>
            <MenuItem value='taxi'>
              <LocalTaxi className={classes.icon} />Destinations by car, taxi, and uber
            </MenuItem>
            <MenuItem value='flight'>
              <Flight className={classes.icon} />Destinations by direct flight
            </MenuItem>
            <MenuItem value='twoflights'>
              <FastForwardOutlined className={classes.icon} />Destinations by flights with one
              connection
            </MenuItem>
          </Select>
        </FormControl>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(FilterDestinations);
