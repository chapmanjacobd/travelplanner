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
  CardContent,
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
    // height: 140,
  },
  rightactions: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: '0',
  },
  bottomactions: {
    borderTop: '1px solid #888',
    padding: '8px 10px 12px 0',
    justifyContent: 'flex-end',
  },
  content: {
    // flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 17px 6px 17px',
    overflowX: 'hidden',
  },
  modifydestination: {
    display: 'flex',
    flexDirection: 'row',
    padding: '2px 0 8px 0',
    // justifyContent: 'right',
    justifyContent: 'space-between',
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
    margin: '8px',
  },
});

const DialogContent = withStyles(() => ({
  root: {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
}))(MuiDialogContent);

class DestinationDetail extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render () {
    const { classes, fullScreen } = this.props;

    return (
      <React.Fragment>
        {/* <Button variant="text" style={{ color: '#007bff', textDecoration: 'underline' }} onClick={this.handleClickOpen}>
          OPEN
        </Button> */}
        <Tooltip title='Edit'>
          <IconButton
            aria-label='Edit'
            className={classes.closeButton}
            onClick={this.handleClickOpen}
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Dialog
          fullScreen={fullScreen}
          onClose={this.handleClose}
          aria-labelledby='destination-detail'
          open={this.state.open}
        >
          <DialogTitle id='destination-detail' onClose={this.handleClose} />
          <DialogContent>
            <CardMedia
              component='img'
              className={classes.media}
              height='180'
              image='https://travel.unli.xyz/cityphotos/view/73H48300+.jpg'
              title='%cityname%'
              alt='detail photo of a place'
            />

            <CardContent className={classes.content}>
              <Hidden smDown>
                <div className={classes.controls}>
                  <Typography variant='h5' component='h2'>
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
                  <Typography variant='h5' component='h2'>
                    Honolulu
                  </Typography>

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
                <ModifyPrice />
              </div>

              <div>
                <CardContent>Flight to %destination.n%</CardContent>
                <CardContent
                  className='indent'
                  title='Bookmark this page and we&#39;ll keep the link ready for you'
                >
                  <p>Estimated Cost: $ %destination.p%</p>
                  <p>
                    Best time to book:
                    {/* {this.numOfDaysToArrival(index) <= 60 ? this.numOfDaysToArrival(index) - 15 < 2 ? (
                        'Now (price will likely only go up)'
                      ) : (
                        'Now (in ' + (this.numOfDaysToArrival(index) - 15) + ' days price will likely go up)'
                      ) : (
                        'In ' + (this.numOfDaysToArrival(index) - 50) + ' days'
                      )} */}
                  </p>

                  <p>
                    Booking Link:{' '}
                    {/* <Button href={this.getRouteLink(index)} target="_blank" rel="nofollow">
                        {this.getRouteLinkText(index)}
                      </Button> */}
                  </p>
                </CardContent>
                <CardContent title='Bookmark this page and we&#39;ll keep the link ready for you'>
                  <Typography>Your accomodation in %destination.n%</Typography>
                  <p>
                    Estimated Cost: ${/* {(this.props.lengths[index] * (destination.b * destination.pr)).toFixed(2)} */}
                  </p>
                  <p>
                    Best time to book:{' '}
                    {/* {this.numOfDaysToArrival(index) <= 60 ? (
                        'Book now'
                      ) : (
                        'In about ' +
                        (this.numOfDaysToArrival(index) - 50) +
                        ' days. Try booking on a Wednesday or a Saturday.'
                      )} */}
                  </p>
                </CardContent>
              </div>

              <DestinationCostBreakdown />

              <CardContent style={{ textAlign: 'center' }}>
                {/* Time Cost:  */}
                You will be at this destination for 30% of your trip.
                {/* {this.props.lengths[index]} days ({(100 *
                      (this.props.lengths[index] /
                        this.getLengths().reduce((accumulator, currentValue) => accumulator + currentValue))).toFixed(
                      2,
                    )}% of trip) */}
              </CardContent>

              <p>
                Exercise increased caution in Nepal due to the potential for isolated political
                violence.<br />
                <br />Political demonstrations intended to be peaceful can sometimes escalate into
                violence, and may be met with force by Nepali authorities.<br />
                <br />Read the Safety and Security section on the{' '}
                <a
                  href='https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Nepal.html'
                  target='_blank'
                >
                  country information page
                </a>.<br />
              </p>
              <ul>
                <li>Avoid demonstrations and crowds.</li>
                <li>Do not trek alone.</li>
                <li>
                  Review the{' '}
                  <a
                    href='https://www.osac.gov/Pages/ContentReportDetails.aspx?cid=23721'
                    target='_blank'
                  >
                    Crime and Safety Report
                  </a>{' '}
                  for Nepal.
                </li>
              </ul>

              <TextField
                id='user-dest-notes'
                label='Notes'
                placeholder=''
                multiline
                className={classes.textField}
                margin='normal'
                variant='outlined'
              />
            </CardContent>
          </DialogContent>
          <CardActions className={classes.bottomactions}>
            <Button
              size='medium'
              style={{ backgroundColor: '#ffd8d2', color: '#710c0c' }}
              variant='outlined'
            >
              DELETE
            </Button>
            <Button
              size='medium'
              style={{ color: '#6b9b36' }}
              variant='outlined'
              onClick={this.handleClose}
            >
              EDIT
            </Button>

            <Hidden smDown>
              <Button size='medium' style={{ color: '#888' }} variant='outlined'>
                ADD FROM HERE
              </Button>
            </Hidden>

            <Hidden smUp>
              <Button size='medium' style={{ color: '#888' }} variant='outlined'>
                ADD
              </Button>
            </Hidden>

            <CardActions className={classes.rightactions}>
              <DestinationCheckoffNotes />
            </CardActions>
          </CardActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withMobileDialog({ breakpoint: 'xs' })(DestinationDetail));
