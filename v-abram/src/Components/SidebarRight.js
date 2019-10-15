import React from 'react';
import { Drawer, Card, CardContent } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import {} from '@material-ui/icons/';
import AdviceCard from './Misc/AdviceCard';
import TripSummary from './TripSummary/TripSummary';
import Legal from './Misc/Legal';

const styles = theme => ({
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.black,
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: 16,
    paddingBottom: 16,
  },
  card: {
    margin: '18px 16px',
  },
  itemActionable: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemActiveItem: {
    color: '#6b9b36',
  },
  itemPrimary: {
    color: 'inherit',
    fontSize: theme.typography.fontSize,
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
  },
  drawerRight: {
    [theme.breakpoints.up('xl')]: {
      width: '325px',
      flexShrink: 0,
    },
  },
});

class Sidebar extends React.Component {
  state = {};

  getCityData = connection => {
    const airport = this.props.city_data.find(el => {
      return el.i === connection.d;
    });
    if (airport) {
      airport.p = connection.p;
      return airport;
    }
  };

  connectionsBuilder = () => {
    if (this.props.connections) {
      return this.props.connections
        .map(el => {
          return this.getCityData(el);
        })
        .filter(airport => airport !== undefined);
    }
  };

  render () {
    // const { classes } = this.props;
    const { classes, show, ...other } = this.props;

    return (
      <React.Fragment>
        {show ? (
          <React.Fragment>
            <nav className={classes.drawerRight}>
              <Drawer variant='permanent' anchor='right' {...other}>
                <div style={{ flexGrow: '1' }}>
                  <Card className={classes.card}>
                    <CardContent className={classes.content}>ad</CardContent>
                  </Card>
                </div>
                <AdviceCard />
                <Legal bgcolor='#fff' />
                {/* Other Content */}
                {/* <SelectDestinationMini /> */}
                {/* <TripOverviewMini /> */}
                {/* <HowTo/> 
    or ? https://www.npmjs.com/package/react-cardstack 
    */}
              </Drawer>
            </nav>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Sidebar);
