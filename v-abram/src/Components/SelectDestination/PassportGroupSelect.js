import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  withMobileDialog,
  Button,
  IconButton,
  Typography,
  CardContent,
  CardActions,
} from '@material-ui/core/';
import { ArrowBack as Close, Edit, People } from '@material-ui/icons/';
import PassportList from './PassportList';
import { passportSync, increasePassport } from '../../actions/passportActions';
import girl from '../../images/icons/girl.jpg';

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
    requestMessage: 0,
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleAdd = () => {
    this.props.increasePassport();
  };

  handleClose = this.props.handler;
  // handleClose = () => {
  //   this.setState({ open: false });
  // this.setState({ requestMessage: 1 }) ??
  // };

  render () {
    const { classes, fullScreen } = this.props;

    return (
      <React.Fragment>
        <Dialog
          fullScreen={fullScreen}
          onClose={this.handleClose}
          aria-labelledby='destination-detail'
          open={this.props.open}
        >
          <DialogTitle id='destination-detail' onClose={this.handleClose} />
          <DialogContent>
            <CardContent className={classes.content}>
              <div className={classes.controls}>
                <Typography
                  variant='h5'
                  component='h2'
                  style={{
                    margin: 'auto',
                    fontWeight: 600,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  Set Passport Groups
                </Typography>
              </div>
            </CardContent>
            <CardContent style={{ maxWidth: '80%', margin: 'auto', padding: 0 }}>
              <img
                src={girl}
                alt='Hello there'
                style={{ float: 'left', height: 150, paddingRight: 16, marginBottom: 20 }}
              />
              <Typography variant='body2' paragraph>
                A Passport Group is a group of people who have the same type of passport(s). With
                the information entered in, we can show you all the places that your group can
                easily go and estimate how much it will cost!
              </Typography>
              <Typography variant='body2' paragraph>
                For example, a group of 6 adults might have 1 person with a US and Fiji passport, 3
                people with Cuba passports, and 2 people with Fiji passports. You would enter this
                information into three Passport Groups.
              </Typography>
            </CardContent>
            <CardContent
              className={classes.content}
              style={{
                minWidth: 490,
              }}
            >
              <div
                className={classes.root}
                style={{
                  minHeight: 400,
                  alignContent: 'baseline',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'baseline',
                }}
              >
                <PassportList
                  requestMessage={this.state.requestMessage}
                  handleSetZero={this.handleSetZero}
                />
                <Button
                  size='large'
                  variant='outlined'
                  onClick={this.handleAdd}
                  style={{ width: '50%', padding: 4, margin: '10px auto 0' }}
                >
                  Add Passport Group
                </Button>
              </div>
            </CardContent>
          </DialogContent>

          <CardActions className={classes.bottomactions}>
            <Button
              style={{ color: this.props.syncCheck ? 'green' : 'red' }}
              size='medium'
              variant='outlined'
              onClick={this.handleClose}
            >
              Apply
            </Button>
          </CardActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

DestinationDetail.defaultProps = {
  open: false,
};

const mapStateToProps = (store, props) => {
  return {
    syncCheck: store.passport.syncCheck,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    passportSync: status => dispatch(passportSync(status)),
    increasePassport: () => dispatch(increasePassport()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(withMobileDialog({ breakpoint: 'xs' })(DestinationDetail)),
);
