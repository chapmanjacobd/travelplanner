import React from 'react';
import { AppBar, Grid, Hidden, IconButton, Toolbar, Tooltip } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { Help } from '@material-ui/icons/';

const styles = (theme) => ({
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing.unit,
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
});

function HowTo(props){
  const { classes, onDrawerToggle } = props;

  return (
    <React.Fragment>
      <AppBar color='primary' position='sticky' elevation={0}>
        <Toolbar>
          <Grid container spacing={8} alignItems='center'>
            <Hidden smUp>
              <Grid item />
            </Hidden>

            <Toolbar style={{ paddingLeft: '0' }}>
              <Grid container alignItems='center' spacing={8}>
                <Grid item xs style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
              </Grid>
            </Toolbar>
          </Grid>

          <Hidden smUp implementation='css'>
            <Grid item>
              <Tooltip title='Help'>
                <IconButton color='inherit'>
                  <Help />
                </IconButton>
              </Tooltip>
            </Grid>
          </Hidden>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default withStyles(styles)(HowTo);
