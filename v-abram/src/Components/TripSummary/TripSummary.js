import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { InlineDatePicker } from 'material-ui-pickers';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import DateFnsUtils from '@date-io/date-fns';
import { Typography, Grid, TextField, Button } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { NavigateNext, Home, WorkOutlineRounded as WorkOutline, LinkRounded } from '@material-ui/icons/';
import { setStartTripDate, setEndTripDate, setDuration } from '../../actions/exploreActions';

const styles = (theme) => ({
	searchbar: {
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
	},
	searchinput: {
		fontSize: theme.typography.fontSize,
	},
	block: {
		display: 'block',
	},
	halfwidth: {
		maxWidth: '49%',
		overflow: 'hidden',
	},
	contentWrapper: {
		margin: '10px auto',
		overflow: 'auto',
	},
	button: {
		display: 'flex',
		margin: '10px auto 0',
		padding: '6px 42px',
		borderRadius: 5,
		border: '1px solid #888',
	},
	MuiButton: {
		minWidth: '100%',
		padding: '0px 0px 3px',
		transitionDuration: '0ms',
		'&:hover': {
			backgroundColor: 'rgba(0, 0, 0, 0.08)',
			borderBottom: '3px solid',
			borderRadius: 0,
			paddingBottom: 0,
		},
	},
	label: {
		textAlign: 'right',
		width: '156px',
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 200,
	},
});

const addDays = (date, duration) => {
	let newDate = new Date(date);
	newDate.setDate(newDate.getDate() + duration * 1);
	return newDate;
};
const dateDiffInDays = (a, b) => {
	// Discard the time and time-zone information.
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
	const utc1 = Date.UTC(a.getUTCFullYear(), a.getMonth(), a.getDate());
	const utc2 = Date.UTC(b.getUTCFullYear(), b.getMonth(), b.getDate());
	return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
};

// make a container that gives this thing special props
class TripSummary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: new Date(),
			endDate: new Date(),
			duration: 0,
			today: new Date(),
		};
	}

	handleStartDateChange = (newDate) => {
		if (newDate == this.props.startTripDate) {
			return 0;
		}
		this.props.setStartTripDate(newDate);
		if (newDate > this.props.endTripDate) {
			this.props.setEndTripDate(addDays(newDate, this.props.duration));
		} else {
			this.props.setDuration(dateDiffInDays(newDate, this.props.endTripDate));
		}
	};
	handleEndDateChange = (newDate) => {
		// this.setState(prevState => {
		//   return {
		//     duration: dateDiffInDays(newDate, prevState.startDate),
		//     endDate: newDate,
		//   };
		// });

		this.props.setEndTripDate(newDate);
	};
	handleSetDuration = (event) => {
		const duration = event.target.value;
		// this.setState(prevState => {
		//   return {
		//     duration: duration * 1,
		//     endDate: addDays(prevState.startDate, duration),
		//   };
		// });
		this.props.setDuration(duration);
	};

	reducer = (accumulator, currentValue) => accumulator + currentValue;
	averageCostPerDay = () => {
		if (this.props.day_prices.length) {
			let sum = 0;
			let avg = 0;
			sum = this.props.leg_prices.reduce(this.reducer);
			avg = sum / this.tripLength();
			if (isNaN(avg)) avg = 0;
			return avg.toFixed(2);
		}
	};

	originTotalCost = () => {
		let i;
		let totalLength = 0;
		for (i = 0; i < this.props.lengths.length; i++) {
			if (this.props.leg_prices[i] !== 0) {
				totalLength += this.props.lengths[i];
			}
		}
		return this.originCostPerDay() * totalLength;
	};

	totalCost = () => {
		if (this.props.leg_prices.length) {
			return this.props.leg_prices.reduce(this.reducer).toFixed(2);
		}
	};

	originCostPerDay = () => {
		console.log(this.props.origin);
		return this.props.origin ? this.props.origin.b : 0;
	};

	originName = () => (this.props.origin ? this.props.origin.n : 'origin');

	tripLength = () => {
		if (this.props.lengths.length) {
			return this.props.lengths.reduce(this.reducer);
		}
	};

	tripLengthFormatter = (tripLength) => {
		if (tripLength > 60) {
			const avgMonth = 30.4166666667;
			let months = Math.floor(tripLength / avgMonth);
			let days = Math.round(tripLength % avgMonth);
			return `${months} months, ${days} days`;
		}
		return tripLength + ' days';
	};

	endDate = () => {
		let theDate = new Date(this.props.start_date);
		theDate.setDate(theDate.getDate() + Number(this.tripLength()));
		return (
			<div id='s-end-date' itemProp='endDate' title={theDate.toDateString()} data-label='End:'>
				{(theDate.getMonth() + 1 < 10 ? '0' : '') +
					(theDate.getMonth() + 1) +
					' / ' +
					((theDate.getDate() + 1 < 10 ? '0' : '') + (theDate.getDate() + 1)) +
					' / ' +
					theDate.getUTCFullYear()}
			</div>
		);
	};

	compareOriginToTotal = () => {
		// console.log(typeof(this.tripLength()))
		if (this.originTotalCost() >= this.totalCost()) {
			return (
				<div
					title='Cost of living, on average, is cheaper during your trip so you can save money by going on this trip (including airfare)'
					style={{ color: 'green' }}
					data-label='Money saved:'
				>
					${(this.originTotalCost() - this.totalCost()).toFixed(2)}
				</div>
			);
		} else {
			return (
				<div
					title='Cost of living, on average, is more expensive for your trip so you will likely spend more money than usual by going on this trip'
					style={{ color: 'red' }}
					data-label='Money spent:'
				>
					${(this.totalCost() - this.originTotalCost()).toFixed(2)}
				</div>
			);
		}
	};

	handleOnClick = (e) => {
		console.log('hello world');
		console.log(e.target.value);
	};

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value });
	};

	render() {
		const { classes, returnHomeLabel } = this.props;
		return (
			<div id='tripsummary' className={classes.paper}>
				{/* <div id="tripsummaryheader" itemProp="name">
          <Typography variant="h6">Trip Summary</Typography>
        </div> */}

				<Grid container spacing={16} alignItems='center'>
					<Grid item xs>
						<div className={classes.margin}>
							<Grid
								container
								spacing={0}
								alignItems='flex-start'
								style={{ justifyContent: 'center', flexDirection: 'column' }}
							>
								<Grid
									container
									spacing={0}
									alignItems='flex-start'
									style={{
										display: 'flex',
										flexWrap: 'nowrap',
										// height: '51px',
										justifyContent: 'center',
										flexDirection: 'row',
										marginBottom: 8,
									}}
								>
									<Grid
										item
										style={{
											width: '50%',
											overflow: 'hidden',
											// border: '1px solid rgba(0, 0, 0, 0.42)',
											marginRight: 8,
											textAlign: 'center',
										}}
									>
										<Typography variant='caption' color='textSecondary'>
											Average cost per day
										</Typography>
										<Typography variant='body2' style={{ color: 'green' }}>
											{'$ ' +
												(this.props.totalLength === 0
													? (0).toFixed(2)
													: (this.props.totalPrice / this.props.totalLength).toFixed(2))}
										</Typography>
									</Grid>
									<Grid
										item
										style={{
											width: '50%',
											overflow: 'hidden',
											// border: '1px solid rgba(0, 0, 0, 0.42)',
											textAlign: 'center',
										}}
									>
										<Typography variant='caption' color='textSecondary'>
											Remaining budget
										</Typography>
										<Typography variant='body2' style={{ color: 'green' }}>
											{'$ ' + (this.props.budget - this.props.totalPrice).toFixed(2)}
										</Typography>
									</Grid>
								</Grid>
								<Grid
									container
									spacing={0}
									alignItems='flex-start'
									style={{
										display: 'flex',
										flexWrap: 'nowrap',
										justifyContent: 'center',
										flexDirection: 'row',
									}}
								>
									<Grid item className={classes.halfwidth} style={{ marginRight: '8px' }}>
										<InlineDatePicker
											label='Start Date'
											value={this.props.startTripDate}
											minDate={this.state.today}
											onChange={this.handleStartDateChange}
										/>
									</Grid>
									<Grid
										item
										style={{
											marginRight: '8px',
											maxWidth: '40%',
											// overflow: 'hidden',
										}}
									>
										<TextField
											style={{ width: '50px' }}
											id='standard-number'
											label='Duration'
											type='number'
											className={classes.textField}
											InputLabelProps={{
												shrink: true,
											}}
											disabled={true}
											defaultValue={this.props.duration}
											value={this.props.duration}
											onChange={this.handleSetDuration}
										/>
									</Grid>
									<Grid item className={classes.halfwidth}>
										<InlineDatePicker
											label='End Date'
											value={this.props.endTripDate}
											disabled={true}
											minDate={this.props.startTripDate}
											onChange={this.handleEndDateChange}
										/>
									</Grid>
								</Grid>
								<Grid
									container
									spacing={0}
									alignItems='flex-start'
									style={{
										display: 'flex',
										flexWrap: 'nowrap',
										height: '51px',
										justifyContent: 'center',
										flexDirection: 'row',
										paddingTop: 8,
									}}
								>
									{/* <Grid
                    item
                    style={{
                      width: '35%',
                      overflow: 'hidden',
                      minHeight: 51,
                      display: 'flex',
                      marginRight: 8,
                      borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                      minWidth: 100,
                    }}
                  >
                    <FormControlLabel
                      className={classes.MuiButton}
                      control={
                        <Checkbox
                          icon={<WorkOutline />}
                          checkedIcon={<Home />}
                          value="returnHome"
                        />
                      }
                      label={<Typography style={{ paddingTop: 8 }}>Explore</Typography>}
                      labelPlacement="end"
                    />
                  </Grid> */}
									<Grid
										item
										style={{
											width: '65%',
											overflow: 'hidden',
											borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
											minHeight: 51,
										}}
									>
										<Button
											className={classes.MuiButton}
											style={{ padding: 0, paddingBottom: '3px', transitionDuration: '0ms' }}
										>
											<div
												style={{
													display: 'flex',
													flexDirection: 'column',
													textAlign: 'center',
													paddingTop: 4,
													// padding: '4px 20px 0px 0px',
												}}
											>
												<Typography variant='caption' color='textSecondary'>
													From {this.originName()}
												</Typography>

												<Typography variant='body2'>Compare cost with home</Typography>
											</div>
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</div>
					</Grid>
				</Grid>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	duration: state.explore.prefs.duration,
	startTripDate: state.explore.prefs.startTripDate,
	endTripDate: state.explore.prefs.endTripDate,
	budget: state.explore.prefs.budget,
	totalPrice: state.explore.totalPrice,
	totalLength: state.explore.totalLength,
	prevDestination: state.explore.prevDestination
});
const mapDispatchToProps = (dispatch) => ({
	setDuration: (duration) => dispatch(setDuration(duration)),
	setStartTripDate: (date) => dispatch(setStartTripDate(date)),
	setEndTripDate: (date) => dispatch(setEndTripDate(date)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TripSummary));
