import { connect } from 'react-redux';
import ExportData from './Views/ExportData';
// import { initAuth, logout } from '../Login/LoginActions';

const mapStateToProps = state => ({
    // userInfo: state.loginReducer.userInfo
});

export default connect(mapStateToProps, {
//   initAuth,
//   logout
})(ExportData);