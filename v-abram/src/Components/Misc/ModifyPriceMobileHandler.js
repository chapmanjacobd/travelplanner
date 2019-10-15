import React, { Fragment } from 'react';
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
import ModifyPrice from './ModifyPrice';

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
  MuiButton: {
    backgroundColor: 'rgb(248, 248, 248)',
    height: 48,
    paddingBottom: '1px',
    margin: '0 8px',
    padding: '0px 16px',
    transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
    borderRadius: 0,
    borderBottom: '2px solid rgba(0, 0, 0, 0.42)',
    '&:hover': {
      backgroundColor: 'rgb(234, 228, 208)',
      borderBottom: '3px solid #221e0f',
      borderRadius: 0,
      paddingBottom: 0,
    },
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

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, fullScreen } = this.props;

    return (
      <React.Fragment>
        <Button
          onClick={this.handleClickOpen}
          variant='text'
          className={classes.MuiButton}
          style={{
            // display: 'flex',
            boxShadow: 'none',
            textTransform: 'capitalize',
          }}
        >
          Cost "Ingredients"
        </Button>
        <Dialog
          fullScreen={fullScreen}
          onClose={this.handleClose}
          aria-labelledby='cost-ingredients'
          open={this.state.open}
        >
          <DialogTitle id='cost-ingredients' onClose={this.handleClose} />
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
                  Cost per day Ingredients
                </Typography>
              </div>
            </CardContent>
            <CardContent>
              <div
                style={{
                  // filter: 'drop-shadow(rgba(255, 255, 255, 2) 0px 0px 1px)',
                  // border: '2px solid #f9f9f9',
                  // padding: 2,
                  // backgroundColor: 'whitesmoke',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  //   justifyContent: 'center',
                  // alignItems: 'space-evenly',
                  // margin: '0 24px',
                  // marginBottom: '24px',
                  // padding: 0,
                }}
              >
                <ModifyPrice
                  setPrefValues={this.setPrefValues}
                  lengthOfStay={this.props.lengthOfStay}
                  setLengthOfStay={this.props.setLengthOfStay}
                />
              </div>
            </CardContent>
          </DialogContent>

          <CardActions className={classes.bottomactions}>
            <Button size='medium' variant='outlined' onClick={this.handleRequest}>
              Apply
            </Button>
          </CardActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withMobileDialog({ breakpoint: 'xs' })(DestinationDetail));
