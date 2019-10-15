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
} from '@material-ui/core/';
import { ArrowBack as Close, Edit } from '@material-ui/icons/';

const DialogTitle = withStyles((theme) => ({
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
}))((props) => {
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

const styles = (theme) => ({
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
  links: {
    margin: '0 3px',
    fontSize: '0.9rem',
    color: '#007bff',
    textDecoration: 'underline',
    minWidth: 0,
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

  render() {
    const { classes, fullScreen } = this.props;

    return (
      <React.Fragment>
        <Button className={classes.links} onClick={this.handleClickOpen}>
          FAQ
        </Button>
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
              image='https://travel.unli.xyz/cityphotos/view/HNL.jpg'
              title='%cityname%'
              alt='detail photo of a place'
            />

            <CardContent className={classes.content}>
              <div className={classes.controls}>
                <Typography variant='h5' component='h2' style={{ margin: 'auto', fontWeight: 600 }}>
                  Frequently Asked Questions
                </Typography>
              </div>
              <Typography variant='h6'>What is "cost per day"?</Typography>
              <Typography variant='body2'>
                Cost per day is a conservative estimate of how much the trip will cost you per day
                based on your preferences and tendency to spend money.
              </Typography>
              <Typography variant='body2'>
                It includes the cost of intra-city transport (to get to your destination),
                inter-city transport (once you arrive at your destination), food, and housing costs.
                The cost will vary depending on how long you will stay because the initial
                intra-city cost might be an expensive plane ticket. You can adjust the preferences
                in the upper-left corner of the app.
              </Typography>
              {/* <Typography variant='h6'>How do you calculate visa costs?</Typography>
              <Typography variant='body2'>
                We use the cost of a 30 day visa. If the trip is longer than 30 days we calculate
                the visa using this formula: 30-day visa cost * (stay-length / 30). If 30 day visa
                isn't available then we use the cost of a 90 day visa and divide it by 3.
              </Typography> */}

              <Typography variant='h6'>Inspiration</Typography>
              <ul>
                <li>
                  <a href='http://www3.nns.ne.jp/pri/tk-mto/kikiyamaHP.html'>ゆめにっき (yume nikki)</a>
                </li>

                <li>
                  <a href='http://maphugger.com/post/86113292616/intro-to-psychogeography-the-art-of-getting-lost'>
                    Psychogeography
                  </a>
                </li>

                <li>
                  <a href='http://maphugger.com/post/86113292616/intro-to-psychogeography-the-art-of-getting-lost'>
                    Socio-architecture
                  </a>
                </li>
              </ul>

              <div>
                <Typography variant='h6'>Data Sources</Typography>

                <Typography variant='body2'>
                  NoiseCapture community.{' '}
                  <a href='https://data.noise-planet.org/index.html'>License</a>
                </Typography>

                <Typography variant='body2'>
                  Who's On First. <a href='http://whosonfirst.mapzen.com#License'>License</a>
                </Typography>

                <a href='https://www.freepik.com/free-photos-vectors/background'>
                  Some background vectors created by freepik - www.freepik.com
                </a>
              </div>
            </CardContent>
          </DialogContent>
          <CardActions className={classes.bottomactions}>
            <Button size='medium' variant='outlined' onClick={this.handleClose}>
              CLOSE
            </Button>
          </CardActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withMobileDialog({ breakpoint: 'xs' })(DestinationDetail));
