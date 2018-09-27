import { connect } from 'react-redux';
import HomePage from './Views/HomePage';
import { initAuth, logout } from '../Login/LoginActions';
import { onChangeCameraFilterFromMap } from '../Commons/Map/MapActions';



const mapStateToProps = state => ({
    userInfo: state.loginReducer.userInfo,
    cameraInfo:state.mapReducer.cameraInfo
});

export default connect(mapStateToProps, {
  initAuth,
  logout,
  onChangeCameraFilterFromMap
})(HomePage);