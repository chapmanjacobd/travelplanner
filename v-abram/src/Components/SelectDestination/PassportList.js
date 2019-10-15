import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Select, { components } from 'react-select';
import Tooltip from '@atlaskit/tooltip';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, GridList, TextField } from '@material-ui/core/';
import { countryOptions } from './data/countryOptions';
import { setACnumberOnExplore } from '../../actions/exploreActions';
import { passportSync, passportGroupUpdate } from '../../actions/passportActions';
import PassportDownshift from './PassportDownshift';
import { initInnerState } from '../../reducers/passportReducer';

const styles = theme => ({
  textField: {
    width: 80,
    marginLeft: 20,
    marginTop: -5,
  },
});

const range = num => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr[i] = i;
  }
  return arr;
};

class PassportList extends React.Component {
  constructor (props) {
    super(props);
    console.log(this.props.inner);
    this.state = {
      numberOfStatus: this.props.numberOfStatus,
      innerState: this.props.inner,
      passportMatrices: this.props.group.source,
      //calculating final matrix from sources
      result: this.props.group.result,
      acNumber: this.props.acNumber,
      selectRefs: [],
    };
  }
  componentWillUnmount () {
    console.log('hello world');
    console.log(this.state);
    const matrix = {};
    const selected = this.state.passportMatrices;
    console.log('11111111111111111111111111111111111111');
    console.log(selected);
    for (let k in selected) {
      let country = selected[k];
      let n, a, b;
      for (let i = 0; i < 199; i++) {
        n = countryOptions[i].value;
        a = matrix[n];
        b = country[n];
        matrix[n] = a > b ? a : b;
      }
    }
    let totalA = 0;
    let totalC = 0;
    console.log(this.state.acNumber);
    for (let i = 0; i < this.props.numberOfStatus; i++) {
      totalA += this.state.acNumber[i].adult;
      totalC += this.state.acNumber[i].children;
    }
    const groupState = {
      numberOfStatus: this.state.numberOfStatus,
      acNumber: [
        ...this.state.acNumber,
      ],
      innerState: {
        ...this.state.innerState,
      },
      source: { ...this.state.passportMatrices },
      result: { ...matrix },
      totalAdult: totalA,
      totalChildren: totalC,
    };
    this.props.passportGroupUpdate(groupState);
    this.props.setACnumberOnExplore(totalA, totalC);
  }

  componentWillReceiveProps = nextProps => {
    console.log(this.state);
    if (nextProps.requestMessage === 1) {
      this.setState(prevState => {
        return {
          ...prevState,
          passportMatrices: { ...prevState.passportMatrices },
          requestMessage: nextProps.requestMessage,
        };
      });
    }
    if (nextProps.numberOfStatus === 1 + this.props.numberOfStatus) {
      this.setState(prevState => {
        return {
          ...prevState,
          numberOfStatus: nextProps.numberOfStatus,
          acNumber: [
            ...prevState.acNumber,
            {
              adult: 1,
              children: 0,
            },
          ],
          innerState: {
            ...prevState.innerState,
            [this.props.numberOfStatus]: {
              ...initInnerState,
            },
          },
          passportMatrices: { ...prevState.passportMatrices },
        };
      });
    }
  };

  sendPassportDataToMode = (matrix, inner, index) => {
    this.setState(prevState => {
      return {
        ...prevState,
        innerState: {
          ...prevState.innerState,
          [index]: inner,
        },
        passportMatrices: {
          ...prevState.passportMatrices,
          [index]: matrix,
        },
      };
    });
  };
  refCollector = ref => {
    this.setState(prevState => {
      return {
        ...prevState,
        passportMatrices: { ...prevState.passportMatrices },
        selectRefs: [
          ...prevState.selectRefs,
          ref,
        ],
      };
    });
  };

  handleTextOnChange = e => {
    console.log(e.target.value);
    console.log(this.state.acNumber);
    // console.log(e.type, e.target);
    const key = e.target.id.split('-');
    const value = e.target.value;
    this.setState(prevState => {
      const newAC = [
        ...prevState.acNumber,
      ];
      newAC[key[1]] = {
        ...prevState.acNumber[key[1]],
        [key[0]]: parseInt(value),
      };
      return {
        ...prevState,
        passportMatrices: { ...prevState.passportMatrices },
        acNumber: newAC,
      };
    });
  };
  // 123123123
  // aaaaaaaaa
  // aaaaaaaaa
  // zzzzzzzzz
  handleOnClick = e => {
    console.log(e.target.className);
    // if (e.target.className.split(' ')[0] != 'css-1toct9k') {
    //   for (let i = 0; i < this.state.selectRefs.length; i++) {
    //     this.state.selectRefs[i].blur();
    //   }
    // }
  };
  render () {
    const { classes } = this.props;
    const hello = 11;
    const hh = 12;
    return (
      <React.Fragment onClick={e => this.handleOnClick(e)}>
        {' '}
        {/* <GridList component='nav' cols='1' spacing='4'> */}{' '}
        {range(this.props.numberOfStatus).map(a => (
          <Grid
            item
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: '4px 4px 5px',
              height: 60,
            }}
          >
            <PassportDownshift
              refCollector={this.refCollector}
              pindex={a}
              pMode='G'
              inner={this.props.inner[a]}
              sendPassportDataToMode={this.sendPassportDataToMode}
            />{' '}
            <TextField
              id={'adult-' + a.toString()}
              label='Adult'
              value={this.state.acNumber[a].adult}
              onChange={this.handleTextOnChange}
              type='number'
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
                min: '0',
                max: '10',
                step: '1',
              }}
              margin='normal'
            />
            <TextField
              id={'children-' + a.toString()}
              label='Children'
              value={this.state.acNumber[a].children}
              onChange={this.handleTextOnChange}
              type='number'
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin='normal'
            />
          </Grid>
        ))}{' '}
        {/* </GridList> */}{' '}
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => {
  return {
    group: store.passport.groupMode,
    inner: store.passport.groupMode.innerState,
    acNumber: store.passport.groupMode.acNumber,
    numberOfStatus: store.passport.groupMode.numberOfStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setACnumberOnExplore: (totalA, totalC) => dispatch(setACnumberOnExplore(totalA, totalC)),
    passportSync: status => dispatch(passportSync(status)),
    passportGroupUpdate: groupStatus => dispatch(passportGroupUpdate(groupStatus)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, {
    withTheme: true,
  })(PassportList),
);
