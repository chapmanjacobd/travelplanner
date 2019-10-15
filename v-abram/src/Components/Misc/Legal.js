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
import FAQ from './FAQ';

const styles = theme => ({
  card: {
    display: 'flex',
    margin: '18px auto',
    justifyContent: 'center',
    zIndex: 0,
  },
  actions: {
    flexDirection: 'column',
    padding: '8px 8px 0 0',
    justifyContent: 'space-evenly',
    marginLeft: '10px',
  },
  legalcontent: {
    padding: '2px !important',
    zIndex: 1,
  },
  links: {
    margin: '0 3px',
    fontSize: '0.9rem',
    color: '#007bff',
    textDecoration: 'underline',
    minWidth: 0,
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
    margin: '8px',
  },
});

function LegalCard (props){
  const { classes } = props;

  return (
    <Card className={classes.card} style={{ backgroundColor: props.bgcolor }}>
      <CardContent className={classes.legalcontent}>
        <React.Fragment>
          <Button
            className={classes.links}
            target='_blank'
            rel='noopener noreferrer'
            href='https://docs.google.com/forms/d/e/1FAIpQLScTN1ZJyuge5I889KEY6OH1IYsg-m_hIkCsrF6BZ-L2OSesEQ/viewform?usp=sf_link'
          >
            Feedback
          </Button>
          <Button className={classes.links} target='_blank' href='./privacy.html'>
            Privacy
          </Button>

          <Button
            className={classes.links}
            target='_blank'
            rel='noopener noreferrer'
            href='https://kotobago.substack.com/'
          >
            Newsletter
          </Button>

          <FAQ />

          <Button className={classes.links} target='_blank' href='./tos.html'>
            Legal
          </Button>
          <img href='http://www.lduhtrp.net/image-8946040-10537500' alt='' />
        </React.Fragment>
      </CardContent>
    </Card>
  );
}

export default withStyles(styles, { withTheme: true })(LegalCard);
