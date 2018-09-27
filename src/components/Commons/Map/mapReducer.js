import * as types from './MapActionType';

const mapReducer = (state = { MapTest: '测距', IsShowBox: false,cameraInfo: [] }, action) => {
  switch (action.type) {
    case types.MAPTEST:
        return {
            ...state,
            ...action.payload
        };
    case types.MAPRECT:
        return {
            ...state,
            ...action.payload
        };
    case types.MAP_SEARCH_CAMERAFILTER_CHANGE:
        return {
            ...state,
            ...action.payload
        };
    default:
        return state;
  }
};

export default mapReducer;
