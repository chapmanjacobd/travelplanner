import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, MenuItem, Select, FormControl, IconButton } from '@material-ui/core/';
import {
  PortraitRounded as Portrait,
  CheckCircleOutlineRounded,
  PauseCircleOutlineRounded,
  RemoveCircleOutlineRounded,
  CancelOutlined,
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
  noLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  listText: {
    padding: '0 8px 0 0 !important',
  },
});

class FilterDestinations extends React.Component {
  state = {
    name: [
      'free',
      'on_arrival',
    ],
    passportPrefOpen: false,
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
        <Tooltip title='Filter destinations by Passport' className={classes.iconButton}>
          <IconButton onClick={() => this.toggleOpen('passportPrefOpen')}>
            <Portrait />
          </IconButton>
        </Tooltip>
        <FormControl className={classes.formControl}>
          <Select
            multiple
            open={this.state.passportPrefOpen}
            onClose={() => this.toggleOpen('passportPrefOpen')}
            onOpen={() => this.toggleOpen('passportPrefOpen')}
            value={this.state.name}
            onChange={this.handleChange}
            inputProps={{
              name: 'passportPref',
              id: 'passportPref-select',
            }}
          >
            <MenuItem value='free'>
              <CheckCircleOutlineRounded className={classes.icon} />Visa-free
            </MenuItem>
            <MenuItem value='on_arrival'>
              <PauseCircleOutlineRounded className={classes.icon} />Visa on arrival
            </MenuItem>
            <MenuItem value='electronic_visa'>
              <RemoveCircleOutlineRounded className={classes.icon} />Electronic visa required
            </MenuItem>
            <MenuItem value='visa_required'>
              <CancelOutlined className={classes.icon} />Visa required
            </MenuItem>
          </Select>
        </FormControl>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(FilterDestinations);
