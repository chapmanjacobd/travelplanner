import React, { Component } from 'react';
import axios from 'axios';
import { Toolbar, Tooltip, IconButton, Hidden } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
  Flight,
  LocalSee,
  Public,
  // inter-city transport filter
  AirplanemodeInactive, // no flights
  DirectionsBus, // only bus
  SubwayRounded,
  Train, // only train
  LocalTaxi, // only taxi
  BusinessCenter,
  LocationCity,
  Domain,
  Landscape,
  DomainDisabled,
  BeachAccess,
  Album,
  Movie,
  Poll,
  Flag,
  Warning,
  Error,
  Explore,
  WbSunnyRounded,
  AcUnitRounded,
  Today,
  SentimentSatisfiedRounded,
  SentimentVerySatisfiedRounded,
  SentimentDissatisfiedRounded,
  SentimentVeryDissatisfiedRounded,
  Directions,
  Hotel,
  CheckCircleOutlineRounded,
  PauseCircleOutlineRounded,
  RemoveCircleOutlineRounded,
  HelpOutline,
  CancelOutlined,
  Add,
  VideoLibrary,
  Search,
  UnfoldLess as FoldSpace,
  AddPhotoAlternateOutlined,
  PlaylistAddSharp,
} from '@material-ui/icons/';
import MUIDataTable from 'mui-datatables';
import * as explore from '../../actions/exploreActions';
import '../../images/flags/flags.min.css';
import '../../images/flags/flags.png';
import Progress from '../Misc/Progress';
import FilterByPassport from './FilterByPassport';
import FilterDestinations from './FilterDestinations';
import FilterByTransport from './FilterByTransport';
import FilterByZoom from './FilterByZoom';
import ManualAddDownshift from './ManualAddDownshift';
import ModifyPriceMobileHandler from '../Misc/ModifyPriceMobileHandler';
import * as routerActions from '../../actions/routerActions';

function getFormatDate(date){
  let yyyy = date.getFullYear();
  let mm = 1 + date.getMonth();
  let dd = date.getDate();
  return yyyy + '-' + (mm >= 10 ? mm : '0' + mm) + '-' + (dd >= 10 ? dd : '0' + dd);
}

const columns = [
  {
    name: 'u',
    label: <Flag />,
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return value ? (
          <div className='flagcont' data-heading='Flag:'>
            <i title={value} className={'flag flag-' + value.toLowerCase()} />
          </div>
        ) : null;
      },
    },
  },
  {
    name: 'n',
    label: 'Neighborhood',
    options: {
      display: 'true',
      filter: false,
      sort: true,
    },
  },
  {
    name: 'search',
    label: 'Web',
    options: {
      display: 'true',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {value === false ? null : (
              <IconButton
                href={'https://google.com/search?q=' + value}
                target='_blank'
                rel='nofollow'
              >
                <Search />
              </IconButton>
            )}
          </div>
        );
      },
    },
  },
  {
    name: 'search',
    label: 'Video',
    options: {
      display: 'true',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {value === false ? null : (
              <IconButton
                href={'https://youtube.com/search?q=' + value}
                target='_blank'
                rel='nofollow'
              >
                <VideoLibrary />
              </IconButton>
            )}
          </div>
        );
      },
    },
  },
  {
    name: 's',
    label: 'Area',
    options: {
      display: 'false',
      filter: false,
      sort: true,
    },
  },
  {
    name: 'l',
    label: 'Transport',
    options: {
      display: 'false',
      filter: true,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {value === false ? (
              <React.Fragment>
                <Flight />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <SubwayRounded />
                {/* check if train, bus, car, or taxi is set */}
              </React.Fragment>
            )}
          </div>
        );
      },
    },
  },
  {
    name: 'costPerDay', // need to calculate
    label: 'Cost-per-day (incl. airfare)',
    options: {
      display: 'true',
      filter: false,
      sort: true,
      sortDirection: 'asc',
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          // maximumFractionDigits: 2,
        });
        return (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {nf.format(value)}
          </div>
        );
      },
    },
  },
  {
    name: 'r2r',
    label: 'Directions',
    options: {
      display: 'true',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {value === false ? null : (
              <IconButton
                href={'https://www.rome2rio.com/map/' + value}
                target='_blank'
                rel='nofollow'
              >
                <Directions />
              </IconButton>
            )}
          </div>
        );
      },
    },
  },
  {
    name: 'hotelscombined_link',
    label: 'Stay',
    options: {
      display: 'true',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {value === false ? null : (
              <IconButton href={value} target='_blank' rel='nofollow'>
                <Hotel />
              </IconButton>
            )}
          </div>
        );
      },
    },
  },
  // {
  //   name: 'k',
  //   label: 'Neighborhoods',
  //   options: {
  //     display: 'true',
  //     filter: false,
  //     sort: false,
  //     customBodyRender: (value, tableMeta, updateValue) => {
  //       return value ? (
  //         <IconButton onClick={() => this.props.getNeighborhoods(value)}>
  //           <LocationCity />
  //         </IconButton>
  //       ) : null;
  //     },
  //   },
  // },
  {
    name: 'creative',
    label: 'Creativity',
    options: {
      display: 'false',
      filter: true,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <div
            style={{
              fontSize: '17pt',
            }}
          >
            {value < 1 ? null : (
              <React.Fragment>
                {value === 'Film' ? (
                  <span aria-label='creative cities' title='City of Film' role='img'>
                    🎬
                  </span>
                ) : null}
                {value === 'Media arts' ? (
                  <span aria-label='creative cities' title='City of Media arts' role='img'>
                    🕹️
                  </span>
                ) : null}
                {value === 'Food' ? (
                  <span aria-label='creative cities' title='City of Food' role='img'>
                    🥘
                  </span>
                ) : null}
                {value === 'Writing' ? (
                  <span aria-label='creative cities' title='City of Writing' role='img'>
                    📚
                  </span>
                ) : null}
                {value === 'Architecture' ? (
                  <span aria-label='creative cities' title='City of Architecture' role='img'>
                    🏯
                  </span>
                ) : null}
                {value === 'Music' ? (
                  <span aria-label='creative cities' title='City of Music' role='img'>
                    🎶
                  </span>
                ) : null}
                {value === 'Folk art' ? (
                  <span aria-label='creative cities' title='City of Folk art' role='img'>
                    🎭
                  </span>
                ) : null}
              </React.Fragment>
            )}
          </div>
        );
      },
    },
  },
  // {
  //   name: 'Exact Date', // insert date difference
  //   label: 'Exact Date',
  //   options: {
  //     display: 'true',
  //     filter: true,
  //     sort: true,
  //     customBodyRender: (value, tableMeta, updateValue) => {
  //       return (
  //         <React.Fragment>
  //           {value === 0 ? (
  //             <React.Fragment>
  //               <CheckCircleOutline />
  //             </React.Fragment>
  //           ) : (
  //             <React.Fragment>
  //               {value > 0 ? <span color="green">{value}</span> : null}
  //               {value < 0 ? <span color="red">{value}</span> : null}
  //             </React.Fragment>
  //           )}
  //         </React.Fragment>
  //       );
  //     },
  //   },
  // },
  // {
  //   name: 'Safety', // need to implement
  //   label: 'Safety',
  //   options: {
  //     display: 'true',
  //     filter: true,
  //     sort: true,
  //     customBodyRender: (value, tableMeta, updateValue) => {
  //       return (
  //         <React.Fragment>
  //           {value < 1 ? null : (
  //             <span aria-label={'Safety Rating: ' + value} title={'Safety Rating: ' + value} role="img">
  //               {value === 1 ? <SentimentVerySatisfiedRounded /> : null}
  //               {value === 2 ? <SentimentSatisfiedRounded /> : null}
  //               {value === 3 ? <SentimentDissatisfiedRounded /> : null}
  //               {value === 4 ? <SentimentVeryDissatisfiedRounded /> : null}
  //             </span>
  //           )}
  //         </React.Fragment>
  //       );
  //     },
  //   },
  // },
  {
    name: 'x',
    label: 'City Links',
    options: {
      display: 'true',
      filter: false,
      sort: true,
    },
  },
  {
    name: 'tempavg',
    label: 'Temp',
    options: {
      display: 'true',
      filter: false,
      sort: true,
      customBodyRender: (value, tempmin, tempmax, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        });

        return (
          <React.Fragment>
            {value >= 38 ? (
              <div
                title={
                  'Oven: ' +
                  nf.format(value * 9 / 5 + 32) +
                  '°F average temperature the month of your arrival'
                }
                className='meters'
                style={{
                  background: 'rgb(219, 132, 110) none repeat scroll 0% 0%',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value) + '°C'}
              </div>
            ) : null}
            {38 > value && value >= 31 ? (
              <div
                title={
                  'Hot!: ' +
                  nf.format(value * 9 / 5 + 32) +
                  '°F average temperature the month of your arrival'
                }
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #e0aa65, #e0aa65 92%, rgb(169, 200, 210) 92%, rgb(169, 200, 210))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value) + '°C'}
              </div>
            ) : null}
            {31 > value && value >= 25 ? (
              <div
                title={
                  'Warm: ' +
                  nf.format(value * 9 / 5 + 32) +
                  '°F average temperature the month of your arrival'
                }
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #cea33c, #cea33c 84%, rgb(169, 200, 210) 84%, rgb(169, 200, 210))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value) + '°C'}
              </div>
            ) : null}

            {25 > value && value >= 21 ? (
              <div
                title={
                  'A little warm: ' +
                  nf.format(value * 9 / 5 + 32) +
                  '°F average temperature the month of your arrival'
                }
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 72%, rgb(169, 200, 210) 72%, rgb(169, 200, 210))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value) + '°C'}
              </div>
            ) : null}
            {21 > value && value >= 18 ? (
              <div
                title={
                  'Comfortable: ' +
                  nf.format(value * 9 / 5 + 32) +
                  '°F average temperature the month of your arrival'
                }
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(104, 188, 111), rgb(104, 188, 111) 60%, rgb(169, 200, 210) 60%, rgb(169, 200, 210))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value) + '°C'}
              </div>
            ) : null}

            {18 > value && value >= 14 ? (
              <div
                title={
                  'Fresh: ' +
                  nf.format(value * 9 / 5 + 32) +
                  '°F average temperature the month of your arrival'
                }
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(32, 206, 144), rgb(32, 206, 144) 48%, rgb(169, 200, 210) 48%, rgb(169, 200, 210))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value) + '°C'}
              </div>
            ) : null}
            {14 > value && value >= 10 ? (
              <div
                title={
                  'Chilly: ' +
                  nf.format(value * 9 / 5 + 32) +
                  '°F average temperature the month of your arrival'
                }
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(18, 133, 170), rgb(18, 133, 170) 36%, rgb(169, 200, 210) 36%, rgb(169, 200, 210))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value) + '°C'}
              </div>
            ) : null}

            {10 > value ? (
              <div
                title={
                  'Cold!: ' +
                  nf.format(value * 9 / 5 + 32) +
                  '°F average temperature the month of your arrival'
                }
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(18, 90, 170), rgb(18, 90, 170) 20%, rgb(169, 200, 210) 20%, rgb(169, 200, 210))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value) + '°C'}
              </div>
            ) : null}
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'rain',
    label: 'Rain',
    options: {
      display: 'true',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });

        return (
          <React.Fragment>
            {value >= 900 ? (
              <div
                title={'Wild Horse Rain: ' + value + 'mm average rain the month of your arrival'}
                style={{
                  width: '100%',
                  backgroundColor: 'rgb(240, 205, 14)',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  backgroundColor: 'rgb(106, 177, 204)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                }}
              >
                {nf.format(value / 280)}
              </div>
            ) : null}
            {900 > value && value >= 300 ? (
              <div
                title={'Heavy Rain: ' + value + 'mm average rain the month of your arrival'}
                style={{
                  width: '100%',
                  backgroundColor: 'rgb(240, 205, 14)',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 84%, #f0cd0e 84%, #f0cd0e)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                }}
              >
                {nf.format(value / 280)}
              </div>
            ) : null}
            {300 > value && value >= 220 ? (
              <div
                title={'Lots of Rain: ' + value + 'mm average rain the month of your arrival'}
                style={{
                  width: '100%',
                  backgroundColor: 'rgb(240, 205, 14)',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 72%, #f0cd0e 72%, #f0cd0e)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                }}
              >
                {nf.format(value / 280)}
              </div>
            ) : null}
            {220 > value && value >= 105 ? (
              <div
                title={'Rainy: ' + value + 'mm average rain the month of your arrival'}
                style={{
                  width: '100%',
                  backgroundColor: 'rgb(240, 205, 14)',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 60%, #f0cd0e 60%, #f0cd0e)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                }}
              >
                {nf.format(value / 280)}
              </div>
            ) : null}
            {105 > value && value >= 75 ? (
              <div
                title={'Scattered showers: ' + value + 'mm average rain the month of your arrival'}
                style={{
                  width: '100%',
                  backgroundColor: 'rgb(240, 205, 14)',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 48%, #f0cd0e 48%, #f0cd0e)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                }}
              >
                {nf.format(value / 280)}
              </div>
            ) : null}
            {75 > value && value >= 55 ? (
              <div
                title={'Light rain: ' + value + 'mm average rain the month of your arrival'}
                style={{
                  width: '100%',
                  backgroundColor: 'rgb(240, 205, 14)',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 24%, #f0cd0e 24%, #f0cd0e)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                }}
              >
                {nf.format(value / 280)}
              </div>
            ) : null}
            {55 > value && value >= 30 ? (
              <div
                title={'Sunny: ' + value + 'mm average rain the month of your arrival'}
                style={{
                  width: '100%',
                  backgroundColor: 'rgb(240, 205, 14)',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 24%, #f0cd0e 24%, #f0cd0e)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                }}
              >
                {nf.format(value / 280)}
              </div>
            ) : null}
            {30 > value ? (
              <div
                title={'Dry: ' + value + 'mm average rain the month of your arrival'}
                style={{
                  width: '100%',
                  backgroundColor: 'rgb(240, 205, 14)',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  backgroundColor: '#f0cd0e',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                }}
              >
                {nf.format(value / 280)}
              </div>
            ) : null}
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'sun',
    label: 'Sun',
    options: {
      display: 'false',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        });
        return (
          <React.Fragment>
            {value >= 18000 ? (
              <div
                title={'Very-High: ' + nf.format(value) + 'kJ m^2 per day solar radiation'}
                style={{
                  backgroundColor: 'rgb(219, 132, 110)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value / 1000) + 'MJ'}
              </div>
            ) : null}
            {18000 > value && value >= 14800 ? (
              <div
                title={'High: ' + nf.format(value) + 'kJ m^2 per day solar radiation'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(104, 188, 111),rgb(104, 188, 111) 70%, rgb(106, 177, 204) 70%, rgb(106, 177, 204))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value / 1000) + 'MJ'}
              </div>
            ) : null}
            {14800 > value && value >= 10000 ? (
              <div
                title={'Medium-High: ' + nf.format(value) + 'kJ m^2 per day solar radiation'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #e0aa65, #e0aa65 60%, #6ab1cc 60%, #6ab1cc)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value / 1000) + 'MJ'}
              </div>
            ) : null}
            {10000 > value && value >= 5000 ? (
              <div
                title={'Medium: ' + nf.format(value) + 'kJ m^2 per day solar radiation'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(32, 206, 144), rgb(32, 206, 144) 50%, #6ab1cc 50%, #6ab1cc)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value / 1000) + 'MJ'}
              </div>
            ) : null}
            {5000 > value && value >= 1000 ? (
              <div
                title={'Low: ' + nf.format(value) + 'kJ m^2 per day solar radiation'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(18, 133, 170), rgb(18, 133, 170) 24%, #6ab1cc 24%, #6ab1cc)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value / 1000) + 'MJ'}
              </div>
            ) : null}

            {1000 > value ? (
              <div
                title={'Very Low: ' + nf.format(value) + 'kJ m^2 per day solar radiation'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(18, 90, 170), rgb(18, 90, 170) 20%, #6ab1cc 20%, #6ab1cc)',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value / 1000) + 'MJ'}
              </div>
            ) : null}
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'wind',
    label: 'Wind',
    options: {
      display: 'false',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });

        return (
          <React.Fragment>
            {value >= 28 ? (
              <div
                title={'Violent storm: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundColor: 'rgb(224, 122, 101) none repeat scroll 0% 0%',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value)}
              </div>
            ) : null}
            {28 > value && value >= 24 ? (
              <div
                title={'Storm: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundColor: 'rgb(224, 170, 101) none repeat scroll 0% 0%',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value)}
              </div>
            ) : null}

            {24 > value && value >= 20 ? (
              <div
                title={'Strong gale: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 90%, rgb(224, 170, 101) 90%, rgb(224, 170, 101))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value)}
              </div>
            ) : null}
            {20 > value && value >= 17 ? (
              <div
                title={'Fresh gale: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 80%, rgb(224, 170, 101) 80%, rgb(224, 170, 101))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value)}
              </div>
            ) : null}
            {17 > value && value >= 14 ? (
              <div
                title={'High wind: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 70%, rgb(224, 170, 101) 70%, rgb(224, 170, 101))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value)}
              </div>
            ) : null}
            {14 > value && value >= 10.7 ? (
              <div
                title={'Strong breeze: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 60%, rgb(224, 170, 101) 60%, rgb(224, 170, 101))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value)}
              </div>
            ) : null}
            {10.7 > value && value >= 7.9 ? (
              <div
                title={'Fresh breeze: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 50%, rgb(224, 170, 101) 50%, rgb(224, 170, 101))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value)}
              </div>
            ) : null}
            {7.9 > value && value >= 5.5 ? (
              <div
                title={'Moderate breeze: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 40%, rgb(224, 170, 101) 40%, rgb(224, 170, 101))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value)}
              </div>
            ) : null}
            {5.5 > value && value >= 3.3 ? (
              <div
                title={'Gentle breeze: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 30%, rgb(224, 170, 101) 30%, rgb(224, 170, 101))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value)}
              </div>
            ) : null}
            {3.3 > value && value >= 1.5 ? (
              <div
                title={'Light breeze: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 20%, rgb(224, 170, 101) 20%, rgb(224, 170, 101))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value)}
              </div>
            ) : null}
            {(1.5 > value) & (value > 0) ? (
              <div
                title={'Light air: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 10%, rgb(224, 170, 101) 10%, rgb(224, 170, 101))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {nf.format(value)}
              </div>
            ) : null}
            {value === 0 ? (
              <div
                title={'Light air: ' + nf.format(value) + 'm/s max wind speed'}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgb(106, 177, 204), rgb(106, 177, 204) 10%, rgb(224, 170, 101) 10%, rgb(224, 170, 101))',
                  textAlign: 'center',
                  padding: '6px 8px 0px',
                  border: '1px solid #888',
                  width: '100%',
                  textShadow: '2px 1px #c9c9c9',
                  boxShadow: '2px 2px silver',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                --
              </div>
            ) : null}
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'density',
    label: 'Density',
    options: {
      display: 'false',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return (
          <React.Fragment>
            <div
              aria-label={'Population is ' + value * 100}
              title={'Population: ' + nf.format(value * 100)}
            >
              {value >= 5000 ? (
                <div
                  style={{
                    backgroundColor: 'rgb(201, 201, 201)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  City
                </div>
              ) : null}
              {5000 > value && value >= 500 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #e0aa65, #e0aa65 92%, rgb(169, 200, 210) 92%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  City
                </div>
              ) : null}
              {500 > value && value >= 150 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #cea33c, #cea33c 84%, rgb(169, 200, 210) 84%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Town
                </div>
              ) : null}
              {150 > value && value >= 50 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 72%, rgb(169, 200, 210) 72%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Village
                </div>
              ) : null}
              {50 > value && value >= 10 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(18, 133, 170), rgb(18, 133, 170) 24%, rgb(169, 200, 210) 24%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Village
                </div>
              ) : null}
              {(10 > value) & (value > 0) ? (
                <div
                  style={{
                    backgroundColor: 'rgb(169, 200, 210)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Hamlet
                </div>
              ) : null}
              {value === 0 ? (
                <div
                  style={{
                    backgroundColor: 'rgb(169, 200, 210)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  --
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'tags',
    label: 'Activity',
    options: {
      display: 'true',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return (
          <React.Fragment>
            <div aria-label={'Activity level is ' + value} title={'Activity level: ' + value}>
              {value >= 60000 ? (
                <div
                  style={{
                    background: 'rgb(219, 132, 110) none repeat scroll 0% 0%',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {60000 > value && value >= 40000 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #e0aa65, #e0aa65 92%, rgb(169, 200, 210) 92%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {40000 > value && value >= 15000 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #cea33c, #cea33c 84%, rgb(169, 200, 210) 84%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {15000 > value && value >= 7000 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 72%, rgb(169, 200, 210) 72%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {7000 > value && value >= 3000 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(104, 188, 111), rgb(104, 188, 111) 60%, rgb(169, 200, 210) 60%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {3000 > value && value >= 800 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(32, 206, 144), rgb(32, 206, 144) 48%, rgb(169, 200, 210) 48%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {800 > value && value >= 200 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(18, 133, 170), rgb(18, 133, 170) 24%, rgb(169, 200, 210) 24%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {(200 > value) & (value > 0) ? (
                <div
                  style={{
                    backgroundColor: 'rgb(169, 200, 210)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {value === 0 ? (
                <div
                  style={{
                    backgroundColor: 'rgb(18, 90, 170)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  --
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'tourism',
    label: 'Tourism',
    options: {
      display: 'true',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return (
          <React.Fragment>
            <div aria-label={'Tourism level is ' + value} title={'Tourism level: ' + value}>
              {value >= 3000 ? (
                <div
                  style={{
                    background: 'rgb(219, 132, 110) none repeat scroll 0% 0%',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {3000 > value && value >= 1000 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #e0aa65, #e0aa65 92%, rgb(169, 200, 210) 92%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {1000 > value && value >= 400 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #cea33c, #cea33c 84%, rgb(169, 200, 210) 84%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {400 > value && value >= 200 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 72%, rgb(169, 200, 210) 72%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {200 > value && value >= 100 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(104, 188, 111), rgb(104, 188, 111) 60%, rgb(169, 200, 210) 60%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {100 > value && value >= 50 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(32, 206, 144), rgb(32, 206, 144) 48%, rgb(169, 200, 210) 48%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {50 > value && value >= 15 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(18, 133, 170), rgb(18, 133, 170) 24%, rgb(169, 200, 210) 24%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {(15 > value) & (value > 0) ? (
                <div
                  style={{
                    backgroundColor: 'rgb(169, 200, 210)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {value === 0 ? (
                <div
                  style={{
                    backgroundColor: 'rgb(169, 200, 210)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  --
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'tourism_percent',
    label: '% of Tourism',
    options: {
      display: 'false',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return (
          <React.Fragment>
            <div
              aria-label={'Activity is ' + value + '% related to tourism'}
              title={'Activity is ' + value + '% related to tourism'}
            >
              {value >= 90 ? (
                <div
                  style={{
                    background: 'rgb(219, 132, 110) none repeat scroll 0% 0%',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {80 > value && value >= 35 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(219, 132, 110), rgb(219, 132, 110) 92%, rgb(169, 200, 210) 92%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {35 > value && value >= 30 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #cea33c, #cea33c 84%, rgb(169, 200, 210) 84%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {30 > value && value >= 25 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(104, 188, 111), rgb(104, 188, 111) 72%, rgb(169, 200, 210) 72%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {25 > value && value >= 20 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 60%, rgb(169, 200, 210) 60%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {20 > value && value >= 15 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 48%, rgb(169, 200, 210) 48%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {15 > value && value >= 5 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 24%, rgb(169, 200, 210) 24%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {(5 > value) & (value > 0) ? (
                <div
                  style={{
                    backgroundColor: 'rgb(169, 200, 210)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {value === 0 ? (
                <div
                  style={{
                    backgroundColor: 'rgb(169, 200, 210)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  --
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'food',
    label: 'Food',
    options: {
      display: 'true',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return (
          <React.Fragment>
            <div
              aria-label={'Number of restaurants is about ' + value}
              title={'Estimated restaurants: ' + value}
            >
              {value >= 4000 ? (
                <div
                  style={{
                    background: 'rgb(219, 132, 110) none repeat scroll 0% 0%',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {4000 > value && value >= 2000 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #e0aa65, #e0aa65 92%, rgb(169, 200, 210) 92%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {2000 > value && value >= 1000 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #cea33c, #cea33c 84%, rgb(169, 200, 210) 84%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {1000 > value && value >= 250 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 72%, rgb(169, 200, 210) 72%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {250 > value && value >= 100 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(104, 188, 111), rgb(104, 188, 111) 60%, rgb(169, 200, 210) 60%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {100 > value && value >= 50 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(32, 206, 144), rgb(32, 206, 144) 48%, rgb(169, 200, 210) 48%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {50 > value && value >= 25 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(18, 133, 170), rgb(18, 133, 170) 24%, rgb(169, 200, 210) 24%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {(25 > value) & (value > 0) ? (
                <div
                  style={{
                    backgroundColor: 'rgb(169, 200, 210)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {value === 0 ? (
                <div
                  style={{
                    backgroundColor: 'rgb(169, 200, 210)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  --
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'beach',
    label: 'Coast',
    options: {
      display: 'false',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return (
          <React.Fragment>
            <div aria-label={'Activity level is ' + value} title={'Activity level: ' + value}>
              {value >= 60000 ? (
                <div
                  style={{
                    background: 'rgb(219, 132, 110) none repeat scroll 0% 0%',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {60000 > value && value >= 20000 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #e0aa65, #e0aa65 92%, rgb(169, 200, 210) 92%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {20000 > value && value >= 5000 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #cea33c, #cea33c 84%, rgb(169, 200, 210) 84%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {5000 > value && value >= 2000 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 72%, rgb(169, 200, 210) 72%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {2000 > value && value >= 200 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(104, 188, 111), rgb(104, 188, 111) 60%, rgb(169, 200, 210) 60%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {200 > value && value >= 15 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(32, 206, 144), rgb(32, 206, 144) 48%, rgb(169, 200, 210) 48%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {15 > value && value >= 3 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(18, 133, 170), rgb(18, 133, 170) 24%, rgb(169, 200, 210) 24%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {(3 > value) & (value > 0) ? (
                <div
                  style={{
                    backgroundColor: 'rgb(169, 200, 210)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value}
                </div>
              ) : null}
              {value === 0 ? (
                <div
                  style={{
                    backgroundColor: 'rgb(169, 200, 210)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  --
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'elevation',
    label: 'Elevation',
    options: {
      display: 'false',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return (
          <React.Fragment>
            <div
              aria-label={'Median elevation is ' + nf.format(value * 3.281) + 'ft'}
              title={'Median elevation: ' + nf.format(value * 3.281) + 'ft'}
            >
              {value >= 8000 ? (
                <div
                  style={{
                    background: 'rgb(219, 132, 110) none repeat scroll 0% 0%',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value + 'm'}
                </div>
              ) : null}
              {8000 > value && value >= 4300 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #e0aa65, #e0aa65 92%, rgb(169, 200, 210) 92%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value + 'm'}
                </div>
              ) : null}
              {4300 > value && value >= 2900 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #cea33c, #cea33c 84%, rgb(169, 200, 210) 84%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value + 'm'}
                </div>
              ) : null}
              {2900 > value && value >= 1600 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 72%, rgb(169, 200, 210) 72%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value + 'm'}
                </div>
              ) : null}
              {1600 > value && value >= 1100 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(104, 188, 111), rgb(104, 188, 111) 60%, rgb(169, 200, 210) 60%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value + 'm'}
                </div>
              ) : null}
              {1100 > value && value >= 500 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(32, 206, 144), rgb(32, 206, 144) 48%, rgb(169, 200, 210) 48%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value + 'm'}
                </div>
              ) : null}
              {500 > value && value >= 350 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(18, 133, 170), rgb(18, 133, 170) 24%, rgb(169, 200, 210) 24%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value + 'm'}
                </div>
              ) : null}
              {350 > value ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(18, 90, 170), rgb(18, 90, 170) 20%, rgb(169, 200, 210) 20%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {value + 'm'}
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'elevation_range',
    label: 'Range',
    options: {
      display: 'false',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        const nf = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return (
          <React.Fragment>
            <div
              aria-label={'Range of elevation is ' + nf.format(value * 3.281) + 'ft'}
              title={'Range of elevation: ' + nf.format(value * 3.281) + 'ft'}
            >
              {value >= 8000 ? (
                <div
                  style={{
                    background: 'rgb(219, 132, 110) none repeat scroll 0% 0%',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {'±' + value / 2 + 'm'}
                </div>
              ) : null}
              {8000 > value && value >= 4300 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #e0aa65, #e0aa65 92%, rgb(169, 200, 210) 92%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {'±' + value / 2 + 'm'}
                </div>
              ) : null}
              {4300 > value && value >= 2900 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #cea33c, #cea33c 84%, rgb(169, 200, 210) 84%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {'±' + value / 2 + 'm'}
                </div>
              ) : null}
              {2900 > value && value >= 1600 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 72%, rgb(169, 200, 210) 72%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {'±' + value / 2 + 'm'}
                </div>
              ) : null}
              {1600 > value && value >= 1100 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(104, 188, 111), rgb(104, 188, 111) 60%, rgb(169, 200, 210) 60%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {'±' + value / 2 + 'm'}
                </div>
              ) : null}
              {1100 > value && value >= 500 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(32, 206, 144), rgb(32, 206, 144) 48%, rgb(169, 200, 210) 48%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {'±' + value / 2 + 'm'}
                </div>
              ) : null}
              {500 > value && value >= 350 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(18, 133, 170), rgb(18, 133, 170) 24%, rgb(169, 200, 210) 24%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {'±' + value / 2 + 'm'}
                </div>
              ) : null}
              {350 > value ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(18, 90, 170), rgb(18, 90, 170) 20%, rgb(169, 200, 210) 20%, rgb(169, 200, 210))',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {'±' + value / 2 + 'm'}
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      },
    },
  },
  // {
  //   name: 'elevation_max',
  //   label: 'Max Elevation',
  //   options: {
  //     display: 'false',
  //     filter: false,
  //     sort: true,
  //     // customSort: (data, colIndex, order) => {
  //     //   return data.sort(function (a, b){
  //     //     return a - b;
  //     //   });
  //     // },
  //     customBodyRender: (value, tableMeta, updateValue) => {
  //       const nf = new Intl.NumberFormat('en-US', {
  //         minimumFractionDigits: 0,
  //         maximumFractionDigits: 0,
  //       });
  //       return (
  //         <React.Fragment>
  //           <div
  //             aria-label={'Max elevation is ' + nf.format(value * 3.281) + 'ft'}
  //             title={'Max elevation: ' + nf.format(value * 3.281) + 'ft'}
  //           >
  //             {value >= 8000 ? (
  //               <div
  //                 style={{
  //                   background: 'rgb(219, 132, 110) none repeat scroll 0% 0%',
  //                   textAlign: 'center',
  //                   padding: '6px 8px 0px',
  //                   border: '1px solid #888',
  //                   width: '100%',
  //                   textShadow: '2px 1px #c9c9c9',
  //                   boxShadow: '2px 2px silver',
  //                   fontWeight: 800,
  //                   fontSize: '1.2rem',
  //                 }}
  //               >
  //                 {value + 'm'}
  //               </div>
  //             ) : null}
  //             {8000 > value && value >= 4300 ? (
  //               <div
  //                 style={{
  //                   backgroundImage:
  //                     'linear-gradient(to right, #e0aa65, #e0aa65 92%, rgb(169, 200, 210) 92%, rgb(169, 200, 210))',
  //                   textAlign: 'center',
  //                   padding: '6px 8px 0px',
  //                   border: '1px solid #888',
  //                   width: '100%',
  //                   textShadow: '2px 1px #c9c9c9',
  //                   boxShadow: '2px 2px silver',
  //                   fontWeight: 800,
  //                   fontSize: '1.2rem',
  //                 }}
  //               >
  //                 {value + 'm'}
  //               </div>
  //             ) : null}
  //             {4300 > value && value >= 2900 ? (
  //               <div
  //                 style={{
  //                   backgroundImage:
  //                     'linear-gradient(to right, #cea33c, #cea33c 84%, rgb(169, 200, 210) 84%, rgb(169, 200, 210))',
  //                   textAlign: 'center',
  //                   padding: '6px 8px 0px',
  //                   border: '1px solid #888',
  //                   width: '100%',
  //                   textShadow: '2px 1px #c9c9c9',
  //                   boxShadow: '2px 2px silver',
  //                   fontWeight: 800,
  //                   fontSize: '1.2rem',
  //                 }}
  //               >
  //                 {value + 'm'}
  //               </div>
  //             ) : null}
  //             {2900 > value && value >= 1600 ? (
  //               <div
  //                 style={{
  //                   backgroundImage:
  //                     'linear-gradient(to right, rgb(92, 170, 18), rgb(92, 170, 18) 72%, rgb(169, 200, 210) 72%, rgb(169, 200, 210))',
  //                   textAlign: 'center',
  //                   padding: '6px 8px 0px',
  //                   border: '1px solid #888',
  //                   width: '100%',
  //                   textShadow: '2px 1px #c9c9c9',
  //                   boxShadow: '2px 2px silver',
  //                   fontWeight: 800,
  //                   fontSize: '1.2rem',
  //                 }}
  //               >
  //                 {value + 'm'}
  //               </div>
  //             ) : null}
  //             {1600 > value && value >= 1100 ? (
  //               <div
  //                 style={{
  //                   backgroundImage:'linear-gradient(to right, rgb(104, 188, 111), rgb(104, 188, 111) 60%, rgb(169, 200, 210) 60%, rgb(169, 200, 210))',
  //                   textAlign: 'center',
  //                   padding: '6px 8px 0px',
  //                   border: '1px solid #888',
  //                   width: '100%',
  //                   textShadow: '2px 1px #c9c9c9',
  //                   boxShadow: '2px 2px silver',
  //                   fontWeight: 800,
  //                   fontSize: '1.2rem',
  //                 }}
  //               >
  //                 {value + 'm'}
  //               </div>
  //             ) : null}
  //             {1100 > value && value >= 500 ? (
  //               <div
  //                 style={{
  //                   backgroundImage:'linear-gradient(to right, rgb(32, 206, 144), rgb(32, 206, 144) 48%, rgb(169, 200, 210) 48%, rgb(169, 200, 210))',
  //                   textAlign: 'center',
  //                   padding: '6px 8px 0px',
  //                   border: '1px solid #888',
  //                   width: '100%',
  //                   textShadow: '2px 1px #c9c9c9',
  //                   boxShadow: '2px 2px silver',
  //                   fontWeight: 800,
  //                   fontSize: '1.2rem',
  //                 }}
  //               >
  //                 {value + 'm'}
  //               </div>
  //             ) : null}
  //             {500 > value && value >= 350 ? (
  //               <div
  //                 style={{
  //                   backgroundImage:
  //                     'linear-gradient(to right, rgb(18, 133, 170), rgb(18, 133, 170) 36%, rgb(169, 200, 210) 36%, rgb(169, 200, 210))',
  //                   textAlign: 'center',
  //                   padding: '6px 8px 0px',
  //                   border: '1px solid #888',
  //                   width: '100%',
  //                   textShadow: '2px 1px #c9c9c9',
  //                   boxShadow: '2px 2px silver',
  //                   fontWeight: 800,
  //                   fontSize: '1.2rem',
  //                 }}
  //               >
  //                 {value + 'm'}
  //               </div>
  //             ) : null}
  //             {350 > value & value > 0 ? (
  //               <div
  //                 style={{
  //                   backgroundImage:
  //                     'linear-gradient(to right, rgb(18, 90, 170), rgb(18, 90, 170) 20%, rgb(169, 200, 210) 20%, rgb(169, 200, 210))',
  //                   textAlign: 'center',
  //                   padding: '6px 8px 0px',
  //                   border: '1px solid #888',
  //                   width: '100%',
  //                   textShadow: '2px 1px #c9c9c9',
  //                   boxShadow: '2px 2px silver',
  //                   fontWeight: 800,
  //                   fontSize: '1.2rem',
  //                 }}
  //               >
  //                 {value + 'm'}
  //               </div>
  //             ) : null}
  //           </div>
  //         </React.Fragment>
  //       );
  //     },
  //   },
  // },
  {
    name: 'population',
    label: 'Population',
    options: {
      display: 'false',
      filter: false,
      sort: true,
    },
  },
  {
    name: 'slope_median',
    label: 'Average Slope',
    options: {
      display: 'false',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <React.Fragment>
            <div aria-label={'Average slope is ' + value} title={'Average slope is: ' + value}>
              {value >= 30 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(-' +
                      value +
                      'deg, rgb(38, 192, 40) 50%, rgb(209, 209, 209) 50%, rgb(100, 206, 255) 100%)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Extreme
                </div>
              ) : null}
              {30 > value && value >= 15 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(-' +
                      value +
                      'deg, rgb(38, 192, 40) 50%, rgb(209, 209, 209) 50%, rgb(100, 206, 255) 100%)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Steep
                </div>
              ) : null}
              {15 > value && value >= 9 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(-' +
                      value +
                      'deg, rgb(38, 192, 40) 50%, rgb(209, 209, 209) 50%, rgb(100, 206, 255) 100%)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Moderate
                </div>
              ) : null}
              {9 > value && value >= 3 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(-' +
                      value +
                      'deg, rgb(38, 192, 40) 50%, rgb(209, 209, 209) 50%, rgb(100, 206, 255) 100%)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Gentle
                </div>
              ) : null}
              {3 > value && value > 0 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(-' +
                      value +
                      'deg, rgb(38, 192, 40) 50%, rgb(209, 209, 209) 50%, rgb(100, 206, 255) 100%)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Flat
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'slope_max',
    label: 'Maximum Slope',
    options: {
      display: 'false',
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <React.Fragment>
            <div aria-label={'Max slope is ' + value} title={'Max slope is: ' + value}>
              {value >= 30 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(-' +
                      value +
                      'deg, rgb(38, 192, 40) 50%, rgb(209, 209, 209) 50%, rgb(100, 206, 255) 100%)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Extreme
                </div>
              ) : null}
              {30 > value && value >= 15 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(-' +
                      value +
                      'deg, rgb(38, 192, 40) 50%, rgb(209, 209, 209) 50%, rgb(100, 206, 255) 100%)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Steep
                </div>
              ) : null}
              {15 > value && value >= 9 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(-' +
                      value +
                      'deg, rgb(38, 192, 40) 50%, rgb(209, 209, 209) 50%, rgb(100, 206, 255) 100%)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Moderate
                </div>
              ) : null}
              {9 > value && value >= 3 ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(-' +
                      value +
                      'deg, rgb(38, 192, 40) 50%, rgb(209, 209, 209) 50%, rgb(100, 206, 255) 100%)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Gentle
                </div>
              ) : null}
              {3 > value ? (
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(-' +
                      value +
                      'deg, rgb(38, 192, 40) 50%, rgb(209, 209, 209) 50%, rgb(100, 206, 255) 100%)',
                    textAlign: 'center',
                    padding: '6px 8px 0px',
                    border: '1px solid #888',
                    width: '100%',
                    textShadow: '2px 1px #c9c9c9',
                    boxShadow: '2px 2px silver',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  Flat
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      },
    },
  },
  {
    name: 'hc',
    label: 'Hotels',
    options: {
      display: 'false',
      filter: false,
      sort: true,
    },
  },
  {
    name: 'c',
    label: 'Country',
    options: {
      display: 'false',
      filter: true,
      sort: true,
    },
  },
  {
    name: 'r',
    label: 'Region',
    options: {
      display: 'false',
      filter: true,
      sort: true,
    },
  },
];

const styles = (theme) => ({
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
  filters: {
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'start',
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
    padding: 0,
    minHeight: 64,
  },
  meters: {
    '&:hover': {
      boxShadow: 'none',
    },
  },
});

const prevDestinationName = (props) => {
  return props.prevDestination.n + ', ' + props.prevDestination.s;
};

let API_URL = 'http://localhost:3005';

if (process.env.NODE_ENV === 'production') {
  API_URL = 'https://travel.unli.xyz/api';
}

async function browseDest(input){
  if (input) {
    const { data } = await axios.get(`${API_URL}/browseDest?input=${input}`);
    // console.log(data);

    return data;
  } else {
    return [ '...' ];
  }
}

class SelectDestination extends Component {
  state = {
    foodPref: '',
    hotelPref: '',
    localTransportPref: '',
    lengthOfStay: this.defaultLengthOfStay(),
    input: '',
    results: [],
  };

  handleInput = (input) => {
    browseDest(input).then((results) => {
      // console.log(results);
      this.setState({ results });
    });
  };

  // this only works with the first time. not the last time.

  componentDidUpdate(prevProps) {
    if (prevProps.totalPeople !== this.props.totalPeople || prevProps.prefs !== this.props.prefs) {
      this.props.recalculateCostPerDay();
    }
    console.log('================================================');
  }

  defaultLengthOfStay() {
    if (this.props.currentIndex === 0) {
      // console.log(endDate);
      var date1 = new Date(this.props.endDate);
      var date2 = new Date(this.props.startDate);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      //console.log(diffDays);
      return diffDays;
    } else {
      return 8;
    }
  }

  // 여기서 테이블에 들어가는 데이터들이 나온다. 이 함수들이 도시들을 불러온다.
  // 스테이트로 설정해주는데 그 데이터가 들어가기 전에 필터링해주자

  togglePrefOpen = (name) => {
    //console.log('toggling open');
    this.setState({
      [name]: ![ name ],
    });
  };
  setPrefValues = (state) => {
    const { foodPref, hotelPref, localTransportPref, lengthOfStay } = state;
    this.setState({ foodPref, hotelPref, localTransportPref, lengthOfStay }, () =>
      this.props.updateDestinationPrefs({ value: this.state })
    );
  };
  getLegEndDate = () => {
    const date = new Date(this.props.prefs.endTripDate);
    date.setDate(date.getDate() + this.props.lengthOfStay);
    return getFormatDate(date);
  };

  render() {
    const { classes, routes, currentState } = this.props;
    const { results } = this.state;
    const options = {
      textLabels: {
        body: {
          noMatch:
            'Please wait up to 20 seconds for the data to fully load then try refreshing the page or click the Feedback button',
        },
      },
      // filterType: '',
      // pagination: false,
      fixedHeader: true,
      rowsPerPage: 75,
      selectableRows: false,
      responsive: 'scroll',
      print: false,
      download: false,
      setRowProps: null,
      customToolbar: (value, tableMeta, updateValue) => {
        return (
          <React.Fragment>
            {/* <FilterByTransport /> */}
            {/* <FilterByZoom /> */}
            <FilterByPassport />
            {/* <Tooltip title='Change view mode'>
              {this.props.currentPage !== 'DEST_PICKER_CARDVIEW' ? (
                <IconButton
                  aria-label='Card View'
                  onClick={() => this.props.setURL('DEST_PICKER_CARDVIEW')}
                >
                  <AddPhotoAlternateOutlined className={classes.icon} />
                </IconButton>
              ) : (
                <IconButton aria-label='List View' onClick={() => this.props.setURL('DEST_PICKER')}>
                  <PlaylistAddSharp className={classes.icon} />
                </IconButton>
              )}
            </Tooltip> */}
          </React.Fragment>
        );
      },
    };
    // console.log(typeof(routes))
    let { data } = routes;

    const KeyColumn = {
      name: 'k',
      label: ' ',
      options: {
        display: 'true',
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value ? (
            <IconButton onClick={() => this.props.setDestination({ k: value })}>
              <Add />
            </IconButton>
          ) : null;
        },
      },
    };
    // add column
    if (typeof SelectDestinationKeyAdded === 'undefined') {
      window.SelectDestinationKeyAdded = true;
      columns.unshift(KeyColumn);
    }

    if (data != null) {
      const arrivalMonth = new Date(this.props.prefs.endTripDate).getMonth();
      data = data.map((x) => ({ ...x, rain: x.rain[arrivalMonth] }));
      data = data.map((x) => ({ ...x, tempavg: x.tempavg[arrivalMonth] }));
      data = data.map((x) => ({ ...x, wind: x.wind[arrivalMonth] }));
      data = data.map((x) => ({ ...x, sun: x.sun[arrivalMonth] }));
      data = data.map((x) => ({ ...x, search: x.s ? x.n + ', ' + x.s : x.n }));
      data = data.map((x) => ({
        ...x,
        r2r: this.props.current_state.n + ', ' + this.props.current_state.s + '/' + x.search,
      }));
      data = data.map((x) => ({
        ...x,
        hotelscombined_link: x.hcid
          ? 'https://www.hotelscombined.com/Hotels/Search?destination=' +
            x.hcid +
            '&radius=6mi&checkin=' +
            getFormatDate(this.props.prefs.endTripDate) +
            '&checkout=' +
            this.getLegEndDate() +
            '&Rooms=1&adults_1=1' +
            '&pageSize=15&pageIndex=0&sort=MinRate-asc&showSoldOut=false?a_aid=208728'
          : 'https://www.hotelscombined.com/?a_aid=208728',
      }));
      // debugger;
      data = data.filter((city) => {
        if (this.props.passportResult[city.u] !== 4) {
          return true;
        } else {
          return false;
        }
      });
    }

    return (
      <React.Fragment>
        <Toolbar className={classes.filters}>
          <div
            style={{
              // filter: 'drop-shadow(rgba(255, 255, 255, 2) 0px 0px 1px)',
              // border: '2px solid #f9f9f9',
              // padding: 2,
              // backgroundColor: 'whitesmoke',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <FilterDestinations />
            <Hidden mdUp>
              <ModifyPriceMobileHandler />
            </Hidden>

            <div
              style={{
                margin: '0 8px',
              }}
            >
              <ManualAddDownshift
                handleInput={this.handleInput}
                setDestination={this.props.setDestination}
                className='origin'
                target='origin'
                // label='Where are you from?'
                results={results}
              />
            </div>
          </div>
        </Toolbar>
        {routes && routes.status !== 'loading' ? (
          <MUIDataTable
            title={
              <React.Fragment>
                Destinations from {prevDestinationName(this.props)}:
                <br />
                <div style={{ fontSize: 'small', color: 'grey' }}>
                  {getFormatDate(this.props.prefs.endTripDate)} to {this.getLegEndDate()}
                </div>
              </React.Fragment>
            }
            data={data}
            columns={columns}
            options={options}
          />
        ) : (
          <Progress prevDestinationName={prevDestinationName(this.props)} />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (store) => ({
  endDate: store.explore.end_date,
  startDate: store.explore.start_date,
  routes: store.explore.routes[store.explore.routes.length - 1],
  currentIndex: store.explore.current_index,
  lengthOfStay: store.explore.displayedLengthOfStay,
  totalPeople: store.explore.totalAdult + store.explore.totalChildren,
  prefs: store.explore.prefs,
  passportResult: store.passport.groupMode.result,
  prevDestination: store.explore.prevDestination,
});
const mapDispatchToProps = (dispatch) => ({
  setDestination: (city) => dispatch(explore.setDestination(city)),
  updateDestinationPrefs: (payload) => dispatch(explore.updateDestinationPrefs(payload)),
  setLengthOfStay: (length) => dispatch(explore.setDisplayedLengthOfStay(length)),
  recalculateCostPerDay: () => dispatch(explore.recalculateCostPerDay()),
  setURL: (r) => dispatch(routerActions.setRoute(r)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SelectDestination));
