/* 登录页 actions */
import Cookies from 'js-cookie';
import md5 from 'react-native-md5';
import * as types from './LoginActionTypes';
import request from '../../utils/request';
import { api } from '../../constants/Api';
import { tokenInvalid } from '../../utils/config';
// import { getOauth } from '../utils/global';

export const login = (data, props) => {
  console.log(data,props,'~~~')
  const { username, password, remember } = data;
  return async dispatch => {
    request({
      url: api.userLogin,
      method: 'form',
      data: {
        username: username,
        password: md5.hex_md5(password),
        ...{
          grant_type: 'password',
          scope: 'read write',
          client_secret: '123456',
          client_id: 'clientapp'
        }
      }
    }).then(res => {
        console.log('zml loginRes',res);
      if (res && !res.error) {
        const userInfo = res;
        if (remember) {
          //设置下次登录也有效
          Cookies.set('token', res.access_token, {
            expires: tokenInvalid
          });
        } else {
          //设置当前登录有效
          Cookies.set('token', res.access_token);
        }
        request({
          url: api.checkOutOfDate,
          method: 'Get'
        })
          .then(res => {
            console.log('error', res);
            if(res.statusCode == 403) {
              res.statusMessage = '暂时无法登陆，请稍后重试！'
            }
            if (res.data || res.error) {
              dispatch(loginFail(res.statusMessage || '该账号已超过访问时限!'));
              return;
            }
            request({
              url: api.getUserRightSever,
              method: 'Get',
              data: {
                urlParams: {
                  id: username
                }
              }
            }).then(Res => {
              if (!Res.error && Res.errCode === 0) {
                userInfo.oauth_AIK_user_info = Res.data.userinfo;
                userInfo.oauth_AIK_role_info_s = Res.data.roleInfoList;
                userInfo.resIds = Res.data.roleInfoList[0].resIds;
                window.localStorage.setItem(
                  'userInfo',
                  JSON.stringify(userInfo)
                );
                //兼容深目1.x存储的oauth
                window.localStorage.setItem('oauth', JSON.stringify(userInfo));
                window.localStorage.setItem(
                  'currentSessionTime',
                  new Date().getTime()
                );
                props.history.push('/');
              } else if (Res.errCode === 1001) {
                dispatch(
                  loginFail(
                    Res.data ||
                      '账号已被原单位解除绑定，暂无法登陆，请联系管理员！'
                  )
                );
              } else {
                dispatch(loginFail(Res.data || Res.statusMessage));
              }
            });
          })
          .catch(error => {
            console.log('error', error);
          });
      } else {
        if (res.statusCode === 0) {
          dispatch(loginFail('系统维护中，请稍后再试!'));
          const timer = setTimeout(() => {
            dispatch({
              type: types.LOGIN_SUCCESS,
              payload: {
                isError: false,
                errorMsg: ''
              }
            });
            clearTimeout(timer);
          }, 2000);
        } else if (res.statusCode === 400) {
          dispatch(loginFail('账号或密码输入错误!'));
          const timer = setTimeout(() => {
            dispatch({
              type: types.LOGIN_SUCCESS,
              payload: {
                isError: false,
                errorMsg: ''
              }
            });
            clearTimeout(timer);
          }, 2000);
        } else {
          dispatch(loginFail('系统维护中，请稍后再试!'));
          const timer = setTimeout(() => {
            dispatch({
              type: types.LOGIN_SUCCESS,
              payload: {
                isError: false,
                errorMsg: ''
              }
            });
            clearTimeout(timer);
          }, 2000);
        }
      }
    });
  };
};

const loginSuccess = data => ({
  type: types.LOGIN_SUCCESS,
  payload: {
    isError: false,
    errorMsg: '',
    userInfo: data
  }
});

const loginFail = errorMsg => ({
  type: types.LOGIN_FAIL,
  payload: {
    isError: true,
    errorMsg: errorMsg
  }
});

export const logout = props => dispatch => {
  const { logoutTxt } = props;
  request({
    url: api.userLogout,
    method: 'get',
    data: {}
  }).then(res => {
    if (res && res.errCode === 0) {
      //退出登录清除cookie中的用户信息
      window.localStorage.removeItem('userInfo');
      window.localStorage.removeItem('oauth');
      Cookies.remove('token');
      //退出登录清除已填写的检索事由
      window.localStorage.removeItem('searchReasonParam');
      dispatch({
        type: types.LOGOUT,
        payload: {
          userInfo: ''
        }
      });
      props.history.push({
        pathname: '/login',
        state: { logoutTxt }
      });
    }
  });
};

export const initAuth = props => (dispatch, ownProps) => {
  const userInfo = window.localStorage.getItem('userInfo');
  let token = '';
  if (Cookies.get('token')) {
    token = Cookies.get('token');
  }

  if (userInfo && token) {
    let userInfoObj = JSON.parse(userInfo);
    const { oauth_AIK_user_info } = userInfoObj;

    if (
      oauth_AIK_user_info &&
      oauth_AIK_user_info.faceId &&
      oauth_AIK_user_info.faceId !== '0'
    ) {
      request({
        url: api.imageService,
        method: 'get',
        data: {
          urlParams: {
            id: oauth_AIK_user_info.faceId
          }
        }
      }).then(res => {
        userInfoObj.userAvatar = '';
        if (res && res.errCode === 0 && res.data) {
          userInfoObj.userAvatar = res.data.uri;
        }
        dispatch(loginSuccess(userInfoObj));
      });
    } else {
      userInfoObj.userAvatar = '';
      dispatch(loginSuccess(userInfoObj));
    }
    //获取oauth认证信息及用户相关权限等信息
    // getOauth();
    if (props.location.pathname === '/login') {
      props.history.push('/');
    }
  } else if (props.location.pathname !== '/login') {
    props.history.push('/login');
  }
};
export const changeLoginType = loginType => ({
  type: types.LOGIN_CHANGE_LOGIN_TYPE,
  payload: {
    loginType: loginType
  }
});
