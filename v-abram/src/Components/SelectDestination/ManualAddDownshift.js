import React, { Component } from 'react';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Paper, MenuItem } from '@material-ui/core/';
import matchSorter from 'match-sorter';
import { AssignmentReturn, FlightTakeoffRounded, NaturePeopleRounded } from '@material-ui/icons';

const deburr = require('lodash.deburr');

function renderInput(inputProps){
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      // label='Where are you from?'
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ city, index, itemProps, highlightedIndex, selectedItem }){
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(city.n) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={city.k}
      selected={isHighlighted}
      component='div'
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      <span
        style={{
          // color: '#ddd',
          marginRight: 12,
          // display: 'flex',
          // alignContent: 'center',
        }}
      >
        {city.l ? (
          <NaturePeopleRounded color='secondary' />
        ) : (
          <FlightTakeoffRounded color='black' />
          // style={{ backgroundColor: '#fff', borderRadius: 8 }}
        )}
      </span>
      {city.s + ' (' + city.n + '), ' + city.c}
    </MenuItem>
  );
}

function getSuggestions(value, results){
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  const tmp = [];
  for (let j = 0; j < 2; j++) {
    for (let k = 0; k < results.length; k++) {
      if (results[k].l === (j === 0 ? false : true)) {
        tmp.push(results[k]);
      }
    }
  }
  results = tmp;
  const getItems = (value) =>
    value
      ? matchSorter(results, value, {
          keys: [ 'i', 'n', 'nl_n', 's', 'nl_s', 'c', 'nl_c' ],
        })
      : results;

  return inputLength === 0
    ? []
    : getItems(inputValue).filter(() => {
        // put the city data here.
        const keep = count < 8;

        if (keep) {
          count += 1;
        }
        // console.log(keep)
        return keep;
      });
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    height: '26rem',
    zIndex: 101,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    position: 'absolute',
    width: '23rem',
    maxWidth: '80vw',
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

class ManualAddDownshift extends Component {
  state = {
    selectedItem: {},
  };
  handleSelection = (city) => {
    this.props.setDestination(city);
  };
  render() {
    const { setDestination, classes, results, handleInput } = this.props;
    const { selectedItem } = this.state;

    return (
      <div className={classes.root}>
        <Downshift
          itemToString={(item) => (item ? item.s + ' (' + item.n + '), ' + item.c : '')}
          onSelect={(selectedItem) => this.handleSelection(selectedItem)}
          // selectedItem={selectedItem}
          // onStateChange={(e,f)=>console.log(e,f)}
          // onChange={(e, stateAndHelpers) => {setDestination({ city: e, index: 0 }); console.log(e)}}
          id='downshift-simple'
          onInputValueChange={(inputValue) => handleInput(inputValue)}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            highlightedIndex,
            inputValue,
            isOpen,
            selectedItem,
            clearSelection,
            // openMenu,
          }) => (
            <div className={classes.container}>
              {renderInput({
                classes,
                label: 'Add Destination Manually',
                margin: 'dense',
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                spellCheck: 'false',
                InputProps: getInputProps({
                  placeholder: 'Yeosu (South Korea)',
                  style: { minWidth: '300px' },
                  onClick() {
                    clearSelection();
                  },
                }),
              })}
              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    {getSuggestions(inputValue, results).map((city, index) =>
                      renderSuggestion({
                        city,
                        index,
                        itemProps: getItemProps({ item: city }),
                        highlightedIndex,
                        selectedItem,
                      })
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}

export default withStyles(styles)(ManualAddDownshift);
