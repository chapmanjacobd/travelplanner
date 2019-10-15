import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Tooltip,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  withMobileDialog,
  Button,
  IconButton,
  Typography,
  Card,
  CardMedia,
  CardActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Hidden,
} from '@material-ui/core/';
import {
  ArrowBack as Close,
  Edit,
  CompareArrowsRounded,
  CheckCircleOutlineRounded,
} from '@material-ui/icons/';
import DestinationCheckoffNotes from '../TripOverview/DestinationCheckoffNotes';
import ModifyPrice from '../Misc/ModifyPrice';
import DestinationCostBreakdown from './DestinationCostBreakdown';

const DialogTitle = withStyles(theme => ({
  root: {
    // borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: 0,
  },
  closeButton: {
    position: 'absolute',
    left: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.primary[500],
  },
}))(props => {
  const { classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      {/* <Typography variant="h6">{children}</Typography> */}
      {onClose ? (
        <IconButton aria-label='Close' className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    // borderRight: '1px solid #d4d4d4',
    // border: '1px solid #d4d4d4',
    // borderRight: 0,
  },
  card: {
    // display: 'flex',
    // margin: '18px auto',
    [theme.breakpoints.up('md')]: {
      minWidth: '600px',
      maxWidth: '1080px',
      // width: '70%',
    },
    [theme.breakpoints.down('sm')]: {
      // margin: '18px',
      maxWidth: '100%',
    },
  },
  media: {
    objectFit: 'cover',
    border: '1px solid #6d6d6d',
    // borderRight: 0,
    // height: 140,
  },
  rightactions: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: '0',
  },
  bottomactions: {
    backgroundColor: '#dfd3c3',
    padding: '8px 0 12px 10px',
    borderTop: '1px solid #d4d4d4',
    borderBottom: '1px solid #d4d4d4',
  },
  content: {
    // flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 17px 6px 17px',
    overflowX: 'hidden',
    backgroundColor: '#fff',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  column: {
    flex: '50%',
    padding: '8px',
  },
  modifydestination: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    background: '#ececec',
    border: '1px solid #c3c3c3',
  },
  cover: {
    width: 180,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    // paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  divider: {
    // background: 'repeating-linear-gradient(to right, #978471 0, #978471 16px,transparent 16px,transparent 20px) bottom',
    height: '1px',
    margin: '4px',
  },
});

class DestinationDetail extends React.Component {
  render () {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <CardMedia
          component='img'
          className={classes.media}
          height='180'
          image='https://travel.unli.xyz/cityphotos/view/73H48300+.jpg'
          title='Your Home?'
          alt='detailed photo of a place'
        />

        <div className={classes.content}>
          <Hidden smDown>
            <div className={classes.controls}>
              <Typography variant='h4' style={{ fontWeight: '500' }}>
                Honolulu, United States
              </Typography>

              <div className={classes.rightactions}>
                <Typography style={{ textAlign: 'right' }} variant='subtitle2'>
                  Arrival: 04 / 06 / 2018
                </Typography>
                <Typography style={{ textAlign: 'right' }} variant='subtitle2'>
                  Departure: 04 / 12 / 2018
                </Typography>
              </div>
            </div>
          </Hidden>

          <Hidden smUp>
            <div className={classes.controls}>
              <Typography variant='h4'>Honolulu</Typography>

              <div className={classes.rightactions}>
                <Typography style={{ textAlign: 'right' }} variant='subtitle2'>
                  04 / 06 / 2018
                </Typography>
                <Typography style={{ textAlign: 'right' }} variant='subtitle2'>
                  04 / 12 / 2018
                </Typography>
              </div>
            </div>
          </Hidden>

          <div className={classes.modifydestination}>
            <div
              style={{
                margin: 'auto',
                color: '#333',
                flexGrow: 1,
                paddingLeft: 8,
              }}
            >
              Your total trip costs $234 more than staying home
              {/* You can save $750 by going on this trip! */}
            </div>

            {/* this only effects staying home price */}
            <ModifyPrice />
          </div>

          <div className={classes.row}>
            <div className={classes.column}>
              <Typography variant='h5' gutterBottom>
                Estimated total trip cost
              </Typography>

              <DestinationCostBreakdown />
            </div>
            <div className={classes.column}>
              <Typography variant='h5' gutterBottom>
                Estimated cost of staying home
              </Typography>

              <DestinationCostBreakdown />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DestinationDetail);
