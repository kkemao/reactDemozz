import { connect } from 'react-redux';
import ShootingRecord from './Views/ShootingRecord';
import { initAuth, logout } from '../Login/LoginActions';

const mapStateToProps = state => ({
    userInfo: state.loginReducer.userInfo
});

export default connect(mapStateToProps, {
  initAuth,
  logout
})(ShootingRecord);