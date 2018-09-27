import { connect } from 'react-redux';
import PrincipalPage from './Views/PrincipalPage';
import { initAuth, logout } from '../Login/LoginActions';

const mapStateToProps = state => ({
    userInfo: state.loginReducer.userInfo,
});

export default connect(mapStateToProps, {
  initAuth,
  logout
})(PrincipalPage);