import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Paper, LinearProgress, Typography } from '@material-ui/core/';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 20,
    margin: 20,
    textAlign: 'center',
  },
  progress: {
    margin: theme.spacing.unit * 2,
    color: '#00695c',
  },
  linearColorPrimary: {
    backgroundColor: '#b2dfdb',
  },
  linearBarColorPrimary: {
    backgroundColor: '#00695c',
  },
  // Reproduce the Facebook spinners.
  facebook: {
    margin: theme.spacing.unit * 2,
    position: 'relative',
  },
  facebook1: {
    color: '#eef3fd',
  },
  facebook2: {
    color: '#6798e5',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
});

function Progress (props){
  const { classes, prevDestinationName } = props;
  return (
    <Paper className={classes.root}>
      {/* <CircularProgress className={classes.progress} size={30} thickness={5} /> */}
      <Typography variant='h4' style={{ display: 'inline' }}>
        Loading destinations from {prevDestinationName}:
      </Typography>
      <Typography variant='caption' style={{ display: 'block' }}>
        (may take a few minutes to fetch all the data)
      </Typography>
      <LinearProgress
        classes={{
          colorPrimary: classes.linearColorPrimary,
          barColorPrimary: classes.linearBarColorPrimary,
        }}
      />

      {/* <div className={classes.facebook}>
        <CircularProgress variant="determinate" value={100} className={classes.facebook1} size={24} thickness={4} />
        <CircularProgress variant="indeterminate" disableShrink className={classes.facebook2} size={24} thickness={4} />
      </div> */}
    </Paper>
  );
}

export default withStyles(styles)(Progress);
