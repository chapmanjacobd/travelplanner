import { countryOptions } from '../Components/SelectDestination/data/countryOptions';
import { countryIndex } from '../Components/SelectDestination/data/countryIndex';
import { bufferPos } from '../Components/SelectDestination/data/bufferPos';

const initResult = { ...bufferPos };
export const initInnerState = {
  overThreeState: false,
  countryOptions: countryOptions,
  wholeCountryOptions: countryOptions,
  selectedOptions: [],
  currentBuffer: [],
  bufferPosition: 0,
  countryIndex: countryIndex,
  bufferPos: bufferPos,
};

const initializeGroupInner = (() => {
  let inner = {};
  for (let i = 0; i < 4; i++) {
    inner[i] = { ...initInnerState };
  }
  return inner;
})();

const initializeGroupACnumbers = num => {
  //Adult/Children Number
  let acNumber = {};
  for (let i = 0; i < num; i++) {
    acNumber[i] = { adult: null, children: null };
  }
  return acNumber;
};

const initialStore = {
  mode: 'S',
  syncCheck: true,
  groupMode: {
    totalAdult: 1,
    totalChildren: 0,
    numberOfStatus: 1,
    innerState: { 0: { ...initInnerState } },
    acNumber: [{ adult: 1, children: 0 }],
    passportConinter: {},
    passportMatrices: {},
    source: [],
    result: initResult,
    requestMessage: 0,
  },
};

export default function reducer(store = initialStore, action) {
  // console.log('come into the reducer!');
  switch (action.type) {
    case 'INCREASE_PASSPORT':
      return {
        ...store,
        groupMode: {
          ...store.groupMode,
          numberOfStatus: store.groupMode.numberOfStatus + 1,
          acNumber: [...store.groupMode.acNumber, { adult: 1, children: 0 }],
          innerState: {
            ...store.groupMode.innerState,
            [store.groupMode.numberOfStatus]: { ...initInnerState },
          },
        },
      };
    case 'PASSPORT_SYNC':
      return {
        ...store,
        syncCheck: action.status,
      };
    case 'PASSPORT_GROUP_UPDATE':
      return {
        ...store,
        groupMode: {
          ...action.groupStatus,
        },
      };
    case 'PASSPORT_MODE_CHANGE':
      return {
        ...store,
        mode: action.mode,
      };
    default:
      return store;
  }
}
