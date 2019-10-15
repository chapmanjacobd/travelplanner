import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Tooltip, Checkbox } from '@material-ui/core/';

import { Flight, Hotel, BusinessCenter } from '@material-ui/icons/';

const styles = (theme) => ({
  card: {
    display: 'flex',
    margin: '18px auto',
    [theme.breakpoints.up('md')]: {
      minWidth: '600px',
      maxWidth: '1080px',
      width: '70%',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '18px',
      maxWidth: '100%',
    },
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
  cover: {
    width: 180,
    float: 'left',
  },
  controls: {
    display: 'flex',
    // alignItems: 'center',
    // paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  divider: {
    // background: 'repeating-linear-gradient(to right, #978471 0, #978471 16px,transparent 16px,transparent 20px) bottom',
    height: '1px',
    margin: '8px',
  },
});

function CheckOffNotes (props) {
  const { classes } = props;

  return (
    <React.Fragment>
      <Tooltip title="Flight booked?">
        <Checkbox
          checked={false}
          icon={<Flight />}
          // onChange={}
          value="flight"
          color="primary"
          style={{ filter: 'drop-shadow(0px 0px 3px rgba(255,255,255,0.9))' }}
        />
      </Tooltip>

      <Tooltip title="Bed booked?">
        <Checkbox
          checked={false}
          icon={<Hotel />}
          // onChange={}
          value="hotel"
          color="primary"
          style={{ filter: 'drop-shadow(0px 0px 3px rgba(255,255,255,0.9))' }}
        />
      </Tooltip>

      <Tooltip title="Ready to go?">
        <Checkbox
          checked={false}
          icon={<BusinessCenter />}
          // onChange={}
          value="read"
          color="secondary"
          style={{ filter: 'drop-shadow(0px 0px 3px rgba(255,255,255,0.9))' }}
        />
      </Tooltip>
    </React.Fragment>
  );
}

export default withStyles(styles, { withTheme: true })(CheckOffNotes);
