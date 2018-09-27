import { connect } from 'react-redux';
import FileStore from './Views/FileStore';
import { initAuth, logout } from '../Login/LoginActions';

const mapStateToProps = state => ({
    userInfo: state.loginReducer.userInfo,
});

export default connect(mapStateToProps, {
  initAuth,
  logout
})(FileStore);