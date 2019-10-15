import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import {
  Divider,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  CardActions,
  Tooltip,
  Button,
} from '@material-ui/core/';

import { NextWeekTwoTone } from '@material-ui/icons/';

const styles = (theme) => ({
  card: {
    margin: '18px auto',
  },
  actions: {
    flexDirection: 'column',
    padding: '8px 8px 0 0',
    justifyContent: 'space-evenly',
    marginLeft: '10px',
  },
  content: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  cover: {
    width: 180,
    float: 'left',
  },
  controls: {
    display: 'flex',
    // alignItems: 'center',
    // paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    background: '#dbdbdb',
  },
  divider: {
    // background: 'repeating-linear-gradient(to right, #978471 0, #978471 16px,transparent 16px,transparent 20px) bottom',
    height: '1px',
    margin: '4px',
  },
  button: {
    color: theme.palette.primary.dark,
  },
});

function AdviceCard (props) {
  const { classes } = props;

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Typography variant="h5" itemProp="name">
          Travel Advice
        </Typography>
        <div className={classes.divider} />
        <Typography variant="body2">
          We recommend that you get travel insurance to cover your entire trip. Some policies are as low as $12 per
          person.
        </Typography>
        <div className={classes.divider} />
        <Button variant="outlined" className={classes.button} target="_blank" href="http://www.squaremouth.com/22163">
          Search Travel Insurance
        </Button>
      </CardContent>
    </Card>
  );
}

export default withStyles(styles, { withTheme: true })(AdviceCard);
