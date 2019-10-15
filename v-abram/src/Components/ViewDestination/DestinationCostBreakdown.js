import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core/';

const CustomTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.black,
    fontSize: 16,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = (theme) => ({
  root: {
    width: '100%',
    margin: 'auto',
    marginTop: theme.spacing.unit / 2,
    overflowX: 'auto',
  },
  table: {
    minWidth: 0,
  },
  row: {
    '&:nth-of-type(even)': {
      backgroundColor: '#eee',
    },
  },
});

let id = 0;
function createData (name, carbs, protein) {
  id += 1;
  return { id, name, carbs, protein };
}

const rows = [
  createData('Grand Total', 15, 574.68, 24, 4.0),
  createData('Accommodation', 237, 9.0, 37, 4.3),
  createData('Food', 262, 16.0, 24, 6.0),
  createData('Local Transport', 305, 3.7, 67, 4.3),
  createData('Visas', 356, 16.0, 49, 3.9),
  createData('Data / 4G', 356, 16.0, 49, 3.9),
  createData('Misc.', 356, 16.0, 49, 3.9),
];

// cost breaksown
// if food or hotel is disabled, show with strikeout text style

// Misc.
//   Entertainment 	$ 10.98
//   Tips and Handouts 	-
//   Scams, Robberies, and Mishaps 	-
//   Souvenirs 	$ 27.47

function CustomizedTable (props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell />
            <CustomTableCell align="right">Per day</CustomTableCell>
            <CustomTableCell align="right">Total (%x% days)</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow className={classes.row} key={row.id}>
              <CustomTableCell component="th" scope="row">
                {row.name}
              </CustomTableCell>
              <CustomTableCell align="right">{row.carbs}</CustomTableCell>
              <CustomTableCell align="right">{row.protein}</CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default withStyles(styles)(CustomizedTable);
