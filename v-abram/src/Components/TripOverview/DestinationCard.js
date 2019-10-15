import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActionArea,
  CardActions,
  Typography,
  Hidden,
} from '@material-ui/core/';
import {} from '@material-ui/icons/';
import DestinationCheckoffNotes from './DestinationCheckoffNotes';

const styles = (theme) => ({
  card: {
    display: 'flex',
    margin: '16px 0',
    [theme.breakpoints.up('md')]: {
      width: '320px',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '18px',
      maxWidth: '100%',
    },
  },
  actions: {
    flexDirection: 'column',
    padding: '8px 8px 0 0',
  },
  actionarea: {
    alignItems: 'flex-end',
    display: 'flex',
  },
  destinationcontent: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '125px',
  },
  destinationtext: {
    [theme.breakpoints.up('md')]: {
      width: '240px',
    },
    zIndex: 1,
    color: 'white',
    fontWeight: '700',
    // overflowWrap: 'anywhere',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
    lineHeight: '1.07em',
    maxHeight: '2.14em',
  },
  destinationbackground: {
    top: '-3px',
    left: '-3px',
    [theme.breakpoints.up('md')]: {
      width: '120%',
      height: '105%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '105%',
      height: '105%',
    },
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 0,
    filter: 'contrast(1.1) opacity(0.9) blur(3px) brightness(1.05)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  cover: {
    // height: 45
    // float: 'left'
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

function DestinationCard(props){
  const { classes, n, start_date, end_date, k, onClick } = props;

  console.log(k);
  return (
    <Card className={classes.card} onClick={onClick}>
      <CardActionArea className={classes.actionarea}>
        <CardContent className={classes.destinationcontent}>
          <Typography
            variant='h3'
            className={classes.destinationtext}
            style={{
              fontSize: '2.5rem',
              marginBottom: 8,
            }}
          >
            {props.n}
          </Typography>

          <Typography variant='h6' className={classes.destinationtext}>
            {/*  */}
            {start_date}
          </Typography>
          <div
            className={classes.destinationbackground}
            style={{ backgroundImage: `url("https://travel.unli.xyz/cityphotos/view/${k}.jpg")` }}
          />
        </CardContent>
      </CardActionArea>
      <Hidden smDown>
        <div className={classes.controls}>
          <CardActions className={classes.actions}>
            <DestinationCheckoffNotes />
          </CardActions>
        </div>
      </Hidden>
    </Card>
  );
}

export default withStyles(styles, { withTheme: true })(DestinationCard);
