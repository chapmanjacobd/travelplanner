import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Select, { components } from 'react-select';
import Tooltip from '@atlaskit/tooltip';
import { withStyles } from '@material-ui/core/styles';
import { Person, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import Flag from 'react-country-flag';
import { countryOptions } from './data/countryOptions';
import Badge from '@material-ui/core/Badge';
import { countryIndex as originCountryIndex } from './data/countryIndex';

const { Option } = components;

const customStyles = {
	control: (provided, state) => ({
		...provided,
		overflow: 'visible',
		boxShadow: '0 0 0 grey',
		// border: state.isFocused ? 0 : 0,
		//   // This line disable the blue border
		//   boxShadow: state.isFocused ? 0 : 0,
		//   "&:hover": {
		//     border: state.isFocused ? 0 : 0
		//   }
		outline: 0,
		width: 300,
	}),
	menu: (provided, state) => ({
		...provided,
		// color: 'red',
		zIndex: 4,
		maxHeight: 'unset',
		overflow: 'visible',
		// display: 'flex',
		// maxWidth: '250px',
	}),
	menuList: (provided, state) => ({
		...provided,
		maxHeight: 'unset',
		overflow: 'visible',
	}),
	valueContainer: (provided, state) => ({
		...provided,
		zIndex: 3,
		height: '2em', // this is necessary for the UI purpose. But it make this downshift do functions inappropriately
		// minWidth: 100,
		// width: 200 //under 3 flags option
		overflow: 'visible',
	}),
	multiValueContainer: (provided, state) => ({
		...provided,
		zIndex: 3,
		width: !state.overThreeState ? 200 : 150,
	}),
};

const styles = (theme) => ({
	root: {
		display: 'inline-flex',
		flexWrap: 'wrap',
		maxHeight: '2em',
		// minWidth: 120,
		// maxWidth: 200,
		// margin: '6px 8px 6px 4px',
		alignItems: 'center',
	},
	basicMultiSelect: {
		display: 'flex',
		width: 320,
		// minWidth: 400,
		// maxWidth: 600,
		// maxHeight: '2em',
	},
});

class PassportDownshift extends React.Component {
	constructor(props) {
		super(props);
		console.log(this.props.pindex);
		this.state = {
			overThreeState: this.props.inner.overThreeState, //false,
			countryOptions: this.props.inner.countryOptions, //countryOptions,
			wholeCountryOptions: this.props.inner.wholeCountryOptions, //countryOptions,
			selectedOptions: this.props.inner.selectedOptions, //[],
			currentBuffer: this.props.inner.currentBuffer, //[],
			bufferPosition: this.props.inner.bufferPosition, //0
			bufferPos: this.props.inner.bufferPos,
			isDisabled: true,
			isLoading: false,
			isRtl: true,
			filterInfoFromPassport: null,
			menuIsOpen: false,
			blur: true,
			isFocused: true,
			flagCount: 0,
			countryIndex: { ...originCountryIndex },
		};
	}
	componentDidMount() {
		this.props.refCollector(this.selectRef);
	}
	componentDidUpdate(prevProps, prevState) {
		if (this.state !== prevState) {
			const matrix = this.calculatePassport();
			let innerState = {
				overThreeState: this.state.overThreeState,
				countryOptions: this.state.countryOptions,
				wholeCountryOptions: this.state.wholeCountryOptions,
				selectedOptions: this.state.selectedOptions,
				currentBuffer: this.state.currentBuffer,
				bufferPosition: this.state.bufferPosition,
				bufferPos: this.state.bufferPos,
			};
			this.props.sendPassportDataToMode(matrix, innerState, this.props.pindex);
		}
	}

	handleClickInput = () => {
		this.setState((prevState) => {
			return { menuIsOpen: !prevState.menuIsOpen };
		});
	};

	handleClickIndicator = () => {
		this.setState((prevState) => {
			return {
				...prevState,
				menuIsOpen: false,
				person: {
					...prevState.person,
					child: !prevState.person.child,
				},
			};
		});
		this.blur();
	};

	handleOnChange = (selected) => {};

	bufferPositionUp = () => {
		this.setState((prevState) => {
			const current = prevState.bufferPosition;
			const len = prevState.selectedOptions.length - 2;
			const next = current < len ? current + 1 : current;
			return {
				bufferPosition: next,
				currentBuffer: this.currentBuffer(prevState.selectedOptions, next),
			};
		});
	};

	bufferPositionDown = () => {
		this.setState((prevState) => {
			const current = prevState.bufferPosition;
			const next = current > 0 ? current - 1 : current;
			return {
				bufferPosition: next,
				currentBuffer: this.currentBuffer(prevState.selectedOptions, next),
			};
		});
	};

	currentBuffer = (buffer, position) => {
		if (buffer.length <= 3) {
			return buffer;
		} else {
			let len = buffer.length;
			return buffer.slice(position, position + 2);
		}
	};

	calculatePassport = () => {
		// when this requests and there's some data which is not updated yet, error happen
		const selected = this.state.selectedOptions;
		const matrix = {};
		if (selected.length === 0) {
			for (let i = 0; i < 199; i++) {
				matrix[countryOptions[i].value] = 4;
			}
		}
		for (let j in selected) {
			let country = selected[j];
			let k = this.state.countryIndex[country.value];
			let n, a, b;
			for (let i = 0; i < 199; i++) {
				n = countryOptions[i].value;
				a = matrix[n]; // be careful... check if the connection to the api is on...
				b = countryOptions[k].data[n];
				matrix[n] = a < b ? a : b;
			}
		}
		// selected.forEach(country => {
		//   let k = this.state.countryIndex[country.value];
		//   let n, a, b;
		//   for (let i = 0; i < 199; i++) {
		//     n = countryOptions[i].value;
		//     a = matrix[n]; // be careful... check if the connection to the api is on...
		//     b = countryOptions[k].data[n];
		//     matrix[n] = a < b ? a : b;
		//   }
		// });
		return matrix;
	};

	handleSelectChange = (selected) => {
		console.log('11111111111');
		console.log(selected.length);
		console.log(this.state.selectedOptions.length);
		if (selected.length === 0) {
			this.setState(() => {
				return {
					overThreeState: false,
					countryOptions: countryOptions,
					wholeCountryOptions: countryOptions,
					selectedOptions: [],
					currentBuffer: [],
				};
			});
		} else if (this.state.currentBuffer.length < selected.length) {
			//adding process
			const recent = selected[selected.length - 1];
			this.setState((prevState) => {
				// overState is True
				if (this.state.overThreeState) {
					const updated = [ ...prevState.selectedOptions, selected[2] ];
					const updatedCountryOptions = prevState.wholeCountryOptions.map((item) => {
						return {
							...item,
							clicked: recent.value === item.value || item.clicked === true,
						};
					});
					const next = prevState.selectedOptions.length - 1;
					const updatedBuffer = { ...this.state.bufferPos };
					for (let i = 0; i < updated.length; i++) {
						updatedBuffer[updated[i].value] = i + 1;
					}
					return {
						countryOptions: updatedCountryOptions.filter((item) => {
							return item.clicked === false;
						}),
						wholeCountryOptions: updatedCountryOptions,
						selectedOptions: updated,
						bufferPosition: next,
						currentBuffer: this.currentBuffer(updated, next),
						bufferPos: updatedBuffer,
					};
				} else {
					// overState is False
					let updatedCountryOptions = prevState.wholeCountryOptions.map((item) => {
						return {
							...item,
							clicked: item.value === recent.value && item.clicked,
						};
					});
					const next = prevState.selectedOptions.length - 1;
					const updatedBuffer = { ...this.state.bufferPos };

					for (let i = 0; i < selected.length; i++) {
						updatedBuffer[selected[i].value] = i + 1;
					}
					console.log(selected);
					console.log(this.currentBuffer(selected, next));
					return {
						overThreeState: prevState.selectedOptions.length + 1 >= 4,
						countryOptions: updatedCountryOptions.filter((item) => {
							return item.clicked === false;
						}),
						wholeCountryOptions: updatedCountryOptions,
						selectedOptions: selected,
						bufferPosition: next,
						currentBuffer: this.currentBuffer(selected, next),
						bufferPos: updatedBuffer,
					};
				}
			});
		} else {
			//dropping process
			if (this.state.overThreeState) {
				this.setState((prevState) => {
					let updated;
					let removed;
					if (prevState.currentBuffer[0].value === selected[0].value) {
						removed = prevState.currentBuffer[1];
					} else {
						removed = prevState.currentBuffer[0];
					}
					let updatedCountryOptions = prevState.wholeCountryOptions.map((item) => {
						return {
							...item,
							clicked: !(item.value === removed.value) && item.clicked,
						};
					});
					const current = prevState.bufferPosition;
					const next = current > 0 ? current - 1 : current;
					const updatedBuffer = { ...this.state.bufferPos };
					updated = prevState.selectedOptions.filter((item) => {
						return item.value !== removed.value;
					});
					for (let i = 0; i < updated.length; i++) {
						updatedBuffer[updated[i].value] = i + 1;
					}
					return {
						overThreeState: prevState.selectedOptions.length >= 5,
						countryOptions: updatedCountryOptions.filter((item) => {
							return item.clicked === false;
						}),
						wholeCountryOptions: updatedCountryOptions,
						selectedOptions: updated,
						bufferPosition: next,
						currentBuffer: this.currentBuffer(updated, next),
						bufferPos: updatedBuffer,
					};
				});
			} else {
				this.setState((prevState) => {
					let removed = prevState.currentBuffer[prevState.currentBuffer.length - 1];
					let updatedCountryOptions = prevState.wholeCountryOptions.map((item) => {
						return {
							...item,
							clicked: !(item.value === removed.value) && item.clicked,
						};
					});
					const updatedBuffer = { ...this.state.bufferPos };
					for (let i = 0; i < selected.length; i++) {
						updatedBuffer[selected[i].value] = i + 1;
					}
					return {
						countryOptions: updatedCountryOptions.filter((item) => {
							return item.clicked === false;
						}),
						wholeCountryOptions: updatedCountryOptions,
						selectedOptions: selected,
						currentBuffer: selected,
						bufferPos: updatedBuffer,
					};
				});
			}
		}
	};

	handleBlur = () => {
		this.setState((prevState) => {
			return { menuIsOpen: false };
		});
	};

	blur = () => this.selectRef.blur();
	// onSelectRef = (ref) => {
	//   console.log(ref);
	//   this.selectRef = ref;
	// };

	render() {
		const { classes } = this.props;
		const ITEM_SIZE = 25;

		const handleClick = () => {
			console.log('Buffer Button is working!!');
		};

		const DropdownIndicator = (props) => {
			const UnderThree = () => <Person style={{ height: ITEM_SIZE, width: ITEM_SIZE }} />;
			let OverThree = function() {
				return (
					<div {...props}>
						<Person style={{ height: ITEM_SIZE, width: ITEM_SIZE }} />
						<KeyboardArrowLeft
							style={{ height: ITEM_SIZE, width: ITEM_SIZE }}
							onClick={this.bufferPositionDown}
						/>
						<KeyboardArrowRight style={{ height: ITEM_SIZE, width: ITEM_SIZE }} />
					</div>
				);
			};
			OverThree = OverThree.bind(this); //overThree when selected passports are more than 3

			return (
				<div>
					<components.DropdownIndicator {...props}>
						{<Person style={{ height: ITEM_SIZE, width: ITEM_SIZE }} />}
						{this.state.overThreeState ? (
							<KeyboardArrowLeft
								style={{ height: ITEM_SIZE, width: ITEM_SIZE }}
								onClick={this.bufferPositionDown}
							/>
						) : (
							''
						)}
						{this.state.overThreeState ? (
							<KeyboardArrowRight
								style={{ height: ITEM_SIZE, width: ITEM_SIZE }}
								onClick={this.bufferPositionUp}
							/>
						) : (
							''
						)}
					</components.DropdownIndicator>
				</div>
			);
		};

		const IconOption = (props) => (
			<Option {...props} option>
				<div style={{ position: 'relative', height: 30 }}>
					<div style={{ position: 'absolute' }}>{props.data.label}</div>
					{/* {props.data.clicked?<div style={{position: 'absolute', 
                                            left: '50%',
                                            textAling: 'center'
                                            }}><CircularProgress size={20}/></div>:''}   */}
				</div>
			</Option>
		);
		const Input = (props) => {
			return props.isHidden ? (
				<components.Input {...props} />
			) : (
				<div ref={(ref) => (this.inputRef = ref)}>
					<Tooltip content='Custom Input'>
						<components.Input {...props} />
					</Tooltip>
				</div>
			);
		};

		const ValueContainer = ({ children, ...props }) => {
			return (
				<div onClick={this.handleClickInput} style={{ overflow: 'visible' }}>
					<components.ValueContainer {...props}>{children}</components.ValueContainer>
				</div>
			);
		};

		const MultiValueLabel = (props) => {
			return (
				<Tooltip content={props.data.value}>
					<components.MultiValueLabel {...props}>
						<Flag
							styleProps={{
								width: '20px',
								height: '20px',
							}}
							code={props.data.value}
							svg
						/>
					</components.MultiValueLabel>
				</Tooltip>
			);
		};
		const MultiValueContainer = (props) => {
			return (
				<Tooltip content='Customise your multi-value container!'>
					<Badge
						className={classes.margin}
						style={{ overflow: 'visible' }}
						badgeContent={this.state.bufferPos[props.data.value]}
						color='primary'
					>
						<components.MultiValueContainer {...props} />
					</Badge>
				</Tooltip>
			);
		};

		return (
			<Select
				disableFocusListener
				ref={(ref) => {
					this.selectRef = ref;
				}}
				value={this.state.currentBuffer}
				styles={customStyles}
				components={{
					MultiValueContainer,
					Input,
					DropdownIndicator,
					ValueContainer,
					MultiValueLabel,
					Option: IconOption,
				}}
				isMulti
				title='Filter destinations by passport'
				placeholder='Passport(s)'
				options={this.state.countryOptions}
				// onBlur={this.handleBlur}
				onChange={this.handleSelectChange}
				className={classes.basicMultiSelect}
				classNamePrefix='select'
				style={{
					overflow: 'hidden',
				}}
				// menuIsOpen
			/>
		);
	}
}

PassportDownshift.defaultProps = {};

export default withStyles(styles)(PassportDownshift);
