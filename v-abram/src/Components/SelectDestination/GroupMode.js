import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core/';
import PassportGroupSelect from './PassportGroupSelect';

const styles = (theme) => ({
  MuiButton: {
    backgroundColor: 'rgb(248, 248, 248)',
    height: 48,
    paddingBottom: '1px',
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

class GroupMode extends React.Component {
  constructor(props) {
    super(props);
    this.handleStatusToggle.bind(this);
    this.state = {
      numberOfPassport: 4,
    };
  }
  state = {
    modalOpen: false,
  };

  handleStatusToggle = () => {
    this.setState((prevState) => {
      return {
        modalOpen: !prevState.modalOpen,
      };
    });
  };

  updateNumber = (i) => {
    this.setState({ numberOfPassport: i });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Button
          onClick={this.handleStatusToggle}
          variant='text'
          className={classes.MuiButton}
          style={{
            // display: 'flex',
            boxShadow: 'none',
            textTransform: 'capitalize',
          }}
        >
          Passport Groups
        </Button>
        <PassportGroupSelect
          open={this.state.modalOpen}
          handler={this.handleStatusToggle}
          updateNumber={this.updateNumber}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(GroupMode);
