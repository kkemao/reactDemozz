/* 地图 actions */
import * as types from './MapActionType';

export const mapTest = data => {
  return async dispatch => {
    dispatch(mapTestAction('测试'));
  };
};

const mapTestAction = text => ({
  type: types.MAPTEST,
  payload: {
    MapTest: text,
    IsShowBox: false
  }
});

// export const mapRect = () => {
//   return async dispatch => {
//     dispatch(mapRectAction('框选'));
//   };
// };

export const mapRect = data => dispatch => {
  dispatch({
    type: types.MAPRECT,
    payload: {
      MapTest: '测距',
      IsShowBox: !data.IsShowBox
    }
  });
};

// const mapRectAction = text => ({
//   type: types.MAPRECT,
//   payload: {
//     mapRect: text
//   }
// });

export const onChangeCameraFilterFromMap = cameraInfo => dispatch => {
    console.log('zml cameraInfo',cameraInfo);
    dispatch({
      type: types.MAP_SEARCH_CAMERAFILTER_CHANGE,
      payload:{
        cameraInfo:cameraInfo
      } 
    });
  };