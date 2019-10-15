const routes = {
  INIT_VIEW: setRouteToInitView,
  DEST_PICKER: setRouteToDestPicker,
  DEST_PICKER_CARDVIEW: setRouteToDestPickerCardView,
  TRIP_OVERVIEW: setRouteToTripOverview,
  DESTINATION_DETAIL: setRouteToDestinationDetail,
};

export function setRoute (route){
  return dispatch => {
    if (routes[route]) {
      dispatch(routes[route]());
    } else {
      dispatch({ type: 'NO_ACTION' });
    }
  };
}

// function setDestinationDetailIndex(payload){
//   return { type: 'SET_DESTINATION_DETAIL_INDEX', payload}
// }

export function setRouteToDestinationDetail (payload){
  return dispatch => {
    dispatch({ type: 'SET_DESTINATION_DETAIL_INDEX', payload });
    dispatch({ type: 'SET_ROUTE_TO_DESTINATION_DETAIL' });
  };
}
function setRouteToInitView (){
  return { type: 'SET_ROUTE_TO_INIT_VIEW' };
}

function setRouteToTripOverview (){
  return { type: 'SET_ROUTE_TO_TRIP_OVERVIEW' };
}

function setRouteToDestPicker (){
  return { type: 'SET_ROUTE_TO_DEST_PICKER' };
}

function setRouteToDestPickerCardView (){
  return { type: 'SET_ROUTE_TO_DEST_PICKER_CARDVIEW' };
}
