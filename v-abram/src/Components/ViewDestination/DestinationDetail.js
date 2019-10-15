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

/*



details that can be taken from the existing data
 - name of city, country
 - length % of trip in that town
 - arrival date
 - departure date

details that will be added to the existing data
 - flights:
    - best time to book
    - estimated cost
    - link
 - housing: 
    - best time to book
    - estimated cost
    - link
    - hotelscombined.com
 - all other expense data
    
 - phone:
    - google fi work here?
    - prepaid sim card
- city info:

- safety information: 
- 


*/

class DestinationDetail extends React.Component {
  render () {
    const { classes, city } = this.props;

    return (
      <div className={classes.container}>
        <CardMedia
          component='img'
          className={classes.media}
          height='180'
          image={`https://travel.unli.xyz/cityphotos/view/${city.k}.jpg`}
          alt='detailed photo of a place'
        />

        <div className={classes.content}>
          <Hidden smDown>
            <div className={classes.controls}>
              <Typography variant='h4' style={{ fontWeight: '500' }}>
                {city ? `${city.n}, ${city.c}` : 'Honolulu, United States'}
              </Typography>

              <div className={classes.rightactions}>
                <Typography style={{ textAlign: 'right' }} variant='subtitle2'>
                  Arrival: {city.dates.start_date}
                  {/* 04 / 06 / 2018 */}
                </Typography>
                <Typography style={{ textAlign: 'right' }} variant='subtitle2'>
                  Departure: {city.dates.end_date}
                </Typography>
              </div>
            </div>
          </Hidden>

          <Hidden smUp>
            <div className={classes.controls}>
              <Typography variant='h4'>Honolulu</Typography>

              <div className={classes.rightactions}>
                <Typography style={{ textAlign: 'right' }} variant='subtitle2'>
                  {/* 04 / 06 / 2018 */}
                  {city.start_date}
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
              {city.percentage}% of your trip is planned to be here
              {/* {this.props.lengths[index]} days ({(100 *
                    (this.props.lengths[index] /
                      this.getLengths().reduce((accumulator, currentValue) => accumulator + currentValue))).toFixed(
                    2,
                  )}% of trip) */}
            </div>

            <ModifyPrice />
          </div>

          <div className={classes.row}>
            <div className={classes.column}>
              <Typography variant='h5' gutterBottom>
                Reserve your spot
              </Typography>
              <div className={classes.row}>
                <div className={classes.column}>
                  <Typography variant='h6'>Flight</Typography>

                  <Typography variant='body2'>
                    Best time to book:
                    {/* {this.numOfDaysToArrival(index) <= 60 ? this.numOfDaysToArrival(index) - 15 < 2 ? (
                        'Now (price will likely only go up)'
                      ) : (
                        'Now (in ' + (this.numOfDaysToArrival(index) - 15) + ' days price will likely go up)'
                      ) : (
                        'In ' + (this.numOfDaysToArrival(index) - 50) + ' days'
                      )} */}
                  </Typography>

                  <Typography variant='body2'>Estimated Cost: $</Typography>

                  <Typography variant='body2'>
                    Booking Link:{' '}
                    {/* <Button href={this.getRouteLink(index)} target="_blank" rel="nofollow">
                        {this.getRouteLinkText(index)}
                      </Button> */}
                  </Typography>

                  {/* <Typography variant="caption">Bookmark this page and we'll keep the links ready for you</Typography> */}
                </div>
                <div className={classes.column}>
                  <Typography variant='h6'>Accomodation</Typography>

                  <Typography variant='body2'>
                    Best time to book:{' '}
                    {/* {this.numOfDaysToArrival(index) <= 60 ? (
                        'Book now'
                      ) : (
                        'In about ' +
                        (this.numOfDaysToArrival(index) - 50) +
                        ' days. Try booking on a Wednesday or a Saturday.'
                      )} */}
                  </Typography>

                  <Typography variant='body2'>
                    Estimated Cost: ${/* {(this.props.lengths[index] * (destination.b * destination.pr)).toFixed(2)} */}
                  </Typography>

                  <Typography variant='body2'>
                    Booking Link:{' '}
                    {/* <Button href={this.getRouteLink(index)} target="_blank" rel="nofollow">
                        {this.getRouteLinkText(index)}
                      </Button> */}
                  </Typography>
                </div>
              </div>
            </div>

            <div className={classes.column}>
              <Typography variant='h5' gutterBottom>
                Estimated cost breakdown
              </Typography>

              <DestinationCostBreakdown />
            </div>
          </div>

          <div className={classes.row}>
            <div className={classes.column}>
              {/* if local city */}
              <Typography variant='h5'>How to get there</Typography>
              <Typography variant='caption'>powered by Rome2rio</Typography>
              <Typography variant='h5'>City Information</Typography>
            </div>
            <div className={classes.column}>
              <Typography variant='h5'>Country Information</Typography>
              <Typography variant='h6'>Pre-paid data SIM</Typography>
              <Typography variant='body2'>
                We recommend getting a %name of product% data SIM.{' '}
              </Typography>

              <Typography variant='h6'>Safety Information</Typography>

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
            </div>
          </div>

          <TextField
            id='user-dest-notes'
            label='Notes'
            placeholder=''
            multiline
            className={classes.textField}
            margin='normal'
            variant='outlined'
          />
        </div>

        <CardActions className={classes.bottomactions}>
          <Button
            size='medium'
            style={{ backgroundColor: '#ffd8d2', color: '#710c0c' }}
            variant='outlined'
          >
            DELETE
          </Button>

          <Hidden smDown>
            <Button
              size='medium'
              style={{ color: '#6b9b36', margin: '0 4px', backgroundColor: '#f1f1f1' }}
              variant='outlined'
            >
              CHANGE DESTINATION
            </Button>
            <Button
              size='medium'
              style={{ color: '#888', margin: '0 4px', backgroundColor: '#f1f1f1' }}
              variant='outlined'
            >
              ADD FROM HERE
            </Button>
          </Hidden>

          <Hidden smUp>
            <Button
              size='medium'
              style={{ color: '#6b9b36', margin: '0 4px', backgroundColor: '#f1f1f1' }}
              variant='outlined'
            >
              CHANGE
            </Button>
            <Button
              size='medium'
              style={{ color: '#888', margin: '0 4px', backgroundColor: '#f1f1f1' }}
              variant='outlined'
            >
              ADD
            </Button>
          </Hidden>
        </CardActions>
      </div>
    );
  }
}

export default withStyles(styles)(DestinationDetail);
