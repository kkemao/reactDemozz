// import React from 'react';
import { connect } from 'react-redux';
import Map from './Map';
import { mapTest, mapRect, onChangeCameraFilterFromMap } from './MapActions';
// import { selectItem } from '../actions/CollectionSystemActions';
// import {
//   onChangeCameraFilterFromMap,
//   showTimeLineEvent,
//   changeTipModalState
// } from '../actions/SearchSystemActions';
const mapStateToProps = (state, props) => {
    return {
        ...props,
        // MapTest: state.mapReducer.MapTest,
        // IsShowBox: state.mapReducer.IsShowBox,
        // CurrentMode: props.currentMode,
        // cameraIds:
        // props.currentMode == 'capture' ? [] : state.searchSystemReducer.cameraIds,
        // selectMenuData:
        // props.currentMode == 'capture'
        //     ? state.collectionSystemReducer.selectMenuData
        //     : state.searchSystemReducer.selectMenuData,
        // dingDian: state.dingDianReducer.dingDian,
    };
};

export default connect(mapStateToProps, {
  mapTest,
  mapRect,
  onChangeCameraFilterFromMap,
//   showTimeLineEvent,
//   selectItem,
//   changeTipModalState
})(Map);
