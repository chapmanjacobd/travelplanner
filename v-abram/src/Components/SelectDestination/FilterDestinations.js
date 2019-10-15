import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton, NativeSelect } from '@material-ui/core/';
import { AddPhotoAlternateOutlined, PlaylistAddSharp } from '@material-ui/icons';
import GroupMode from './GroupMode';
import { setDisplayedLengthOfStay, recalculateCostPerDay } from '../../actions/exploreActions';

const styles = (theme) => ({
	root: {
		display: 'inline-flex',
		flexWrap: 'wrap',
		// minWidth: 120,
		// maxWidth: 220,
		// margin: '6px 8px 6px 4px',
		alignItems: 'center',
	},
	icon: {
		paddingRight: '3px',
	},
	iconButton: {
		// display: 'block',
		// marginTop: theme.spacing.unit * 2,
		// margin: 2,
		// padding: 4,
	},
	paper: {
		maxWidth: 968,
		margin: 'auto',
	},
	searchbar: {
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
	},
	searchinput: {
		fontSize: theme.typography.fontSize,
	},
	block: {
		display: 'block',
	},
	contentWrapper: {
		margin: '20px 16px',
	},
	formControl: {
		margin: 0,
		width: 0,
		height: 0,
		visibility: 'hidden',
		position: 'relative',
		right: '7%',
	},
	MuiButton: {
		backgroundColor: 'rgb(248, 248, 248)',
		padding: '0px 16px',
		height: 48,
		marginRight: 8,
		transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
		borderRadius: 0,
		borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
		paddingBottom: '2px',
		'&:hover': {
			backgroundColor: 'rgb(234, 228, 208)',
			borderBottom: '2px solid #221e0f',
			paddingBottom: 0,
		},
	},
	// MuiFormLabel: {
	//   color: 'rgba(0, 0, 0, 0.87)',
	//   padding: 0,
	//   fontSize: '0.875rem',
	//   transition:
	//     'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
	//   fontFamily: 'Roboto", "Helvetica", "Arial", sans-serif',
	//   // backgroundColor: '#e0e0e0',
	//   justifyContent: 'center',
	// },
	noLabel: {
		marginTop: theme.spacing.unit * 3,
	},
	listText: {
		padding: '0 8px 0 0 !important',
	},
});

class FilterDestinations extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: [ 'bus', 'train', 'taxi', 'flight', 'twoflights' ],
			transportPrefOpen: false,
			lengthOfStay: this.props.defaultLengthOfStay ? this.props.defaultLengthOfStay : 8,
		};
	}

	handleChangePassport = (event) => {
		console.log(event);
		this.setState({ [event.target.name]: event.target.value }, () => this.props.setPrefValues(this.state));
		console.log('handlingChange');
	};

	toggleOpen = (name) => {
		this.setState({ [name]: !this.state[name] });
	};

	handleChange = (event) => {
		this.setState({ name: event.target.value });
	};

	handleChangeMultiple = (event) => {
		const { options } = event.target;
		const value = [];
		for (let i = 0, l = options.length; i < l; i += 1) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}
		this.setState({
			name: value,
		});
	};
	handleChangeLength = (e) => {
		this.props.setLengthOfStay(e.target.value);
	};

	render() {
		const { classes, lengthOfStay } = this.props;
		const SelectDays = () => {
			const arr = [];
			for (let i = 0; i < 183; i++) {
				arr[i] = i;
			}
			return (
				<NativeSelect
					variant='standard'
					value={this.props.lengthOfStay}
					onChange={(e) => this.props.setLengthOfStay(e.target.value)}
					name='days'
					className={classes.MuiButton}
				>
					{arr.map((i) => (
						<option value={i}>
							{i + ' '} {i == 1 ? 'day' : 'days'}
						</option>
					))}
				</NativeSelect>
			);
		};
		return (
			<React.Fragment>
				<SelectDays />

				<GroupMode />
			</React.Fragment>
		);
	}
}
const mapStateToProps = (store) => ({
	lengthOfStay: store.explore.displayedLengthOfStay,
});

const mapDispatchToProps = (dispatch) => ({
	setLengthOfStay: (length) => dispatch(setDisplayedLengthOfStay(length)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
	withStyles(styles, { withTheme: true })(FilterDestinations),
);
