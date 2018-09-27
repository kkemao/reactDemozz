import { connect } from 'react-redux';
import ReviewPicture from './Views/ReviewPicture';
import { initAuth, logout } from '../Login/LoginActions';

const mapStateToProps = state => ({
    userInfo: state.loginReducer.userInfo
});

export default connect(mapStateToProps, {
  initAuth,
  logout
})(ReviewPicture);