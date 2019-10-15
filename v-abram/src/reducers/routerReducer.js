const initialStore = {
  current: 'INIT_VIEW',
  routes: [
    'INIT_VIEW',
    'DEST_PICKER',
    'DEST_PICKER_CARDVIEW',
    'TRIP_OVERVIEW',
    'DESTINATION_DETAIL',
  ],
  destinationDetailIndex: 0,
};
export default function reducer (store = initialStore, action){
  switch (action.type) {
    case 'SET_ROUTE_TO_INIT_VIEW': {
      return { ...store, current: 'INIT_VIEW' };
    }
    case 'SET_ROUTE_TO_DEST_PICKER': {
      return { ...store, current: 'DEST_PICKER' };
    }
    case 'SET_ROUTE_TO_DEST_PICKER_CARDVIEW': {
      return { ...store, current: 'DEST_PICKER_CARDVIEW' };
    }
    case 'SET_ROUTE_TO_TRIP_OVERVIEW': {
      return { ...store, current: 'TRIP_OVERVIEW' };
    }
    case 'SET_ROUTE_TO_DESTINATION_DETAIL': {
      return { ...store, current: 'DESTINATION_DETAIL' };
    }
    case 'SET_DESTINATION_DETAIL_INDEX': {
      return { ...store, destinationDetailIndex: action.payload.index };
    }
    default:
      return store;
  }
}
