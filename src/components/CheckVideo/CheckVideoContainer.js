import { connect } from 'react-redux';
import CheckVideo from './Views/CheckVideo';
import { initAuth, logout } from '../Login/LoginActions';

const mapStateToProps = state => ({
    userInfo: state.loginReducer.userInfo,
    cameraInfo:state.mapReducer.cameraInfo
});

export default connect(mapStateToProps, {
  initAuth,
  logout
})(CheckVideo);