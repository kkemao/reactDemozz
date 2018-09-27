/* global window */
import axios from 'axios';
import qs from 'qs';
// import jsonp from 'jsonp'
import lodash from 'lodash';
// import pathToRegexp from 'path-to-regexp'
import { message } from 'antd';
// import config from './config';
import { replaceImgDomain } from './global';
import Cookies from 'js-cookie';
import Url from './Url';
import { mock } from './mock';

let logoutLock = false;
function buildParam(url, params) {
  if (!params) {
    return url;
  }
  for(var i in params){
    url = url.replace('{'+i+'}',params[i]);
  }

  return url;
}

const fetch = options => {
  let { method = 'get', data = {}, url } = options;
  try {
    url = buildParam(url, data.urlParams);
  } catch (e) {
    throw new Error('请求链接参数错误.');
  }

  delete data.urlParams;
  console.log('request url', url, data);
  const cloneData = lodash.cloneDeep(data);

  //配置axios请求默认值
  let token = '';
  if (Cookies.get('token')) {
    token = Cookies.get('token');
  }
  axios.defaults.baseURL = window.$IF.env.apiBaseURL; //默认Url地址
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

  // try {
  //   let domin = ''
  //   if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
  //     domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
  //     url = url.slice(domin.length)
  //   }
  //   const match = pathToRegexp.parse(url)
  //   url = pathToRegexp.compile(url)(data)
  //   for (let item of match) {
  //     if (item instanceof Object && item.name in cloneData) {
  //       delete cloneData[item.name]
  //     }
  //   }
  //   url = domin + url
  // } catch (e) {
  //   message.error(e.message)
  // }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData
      });
    case 'delete':
      return axios.delete(url, {
        data: cloneData
      });
    case 'post':
      return axios.post(url, cloneData);
    case 'put':
      return axios.put(url, cloneData);
    case 'patch':
      return axios.patch(url, cloneData);
    case 'form':
      return axios.post(url, qs.stringify(cloneData), {
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          Authorization: 'Basic ' + btoa('clientapp:123456'),
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      });
    case 'upload':
      if (options.progress) {
        return axios.post(url, data, {
          onUploadProgress: options.progressCallback
        });
      } else {
        return axios.post(url, data, {
          headers: {
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        });
      }
    default:
      return axios(options);
  }
};

export default function request(options) {
  return fetch(options)
    .then(response => {
      //restore all response img url
      // return JSON.parse(Url.restoreAll(JSON.stringify(response)));
      return JSON.parse(
        Url.restoreAll(replaceImgDomain(JSON.stringify(response)))
      );
    })
    .then(response => {
        console.log('zml request,',options);
        return mock(options, response);
    })
    .then(response => {
      const { data } = response;

      return Promise.resolve({
        ...data
      });
    })
    .catch(error => {
      const { response } = error;
      let msg;
      let statusCode;

      const currentUrl = window.location.pathname;
      const urlPathName = currentUrl.slice(currentUrl.lastIndexOf('/'));

      if (response && response instanceof Object) {
        const { data, status, statusText } = response;
        statusCode = status;
        msg = data.message || statusText;
        if (urlPathName !== '/login') {
          message.destroy();
          //对异常情况产生的退出加锁，避免message单例在回调执行期内，比如message目前设置5s后才执行回调函数，小于5s间隔内的频繁请求导致回掉一直被替换无法执行
          if (logoutLock) return;
          logoutLock = true;
          if (
            status === 403 &&
            statusText === 'Forbidden' &&
            error.message &&
            error.message.indexOf('no privilege') !== -1
          ) {
            message.error('服务接口没配置权限！将自动退出系统！', 1, () => {});
            setTimeout(errorCallBack, 5000);
          } else if (
            status === 405 &&
            statusText === 'Forbidden' &&
            error.message &&
            error.message.indexOf('no privilege') !== -1
          ) {
            message.error('禁止IP！将自动退出系统！', 1, () => {});
            setTimeout(errorCallBack, 5000);
          } else {
            message.error(
              '系统服务异常！错误:' + response.status + '！将自动退出系统！',
              1,
              () => {}
            );
            setTimeout(errorCallBack, 5000);
            //复现未加锁不能退出的情况
            // setInterval(function(){
            //   request({
            //     url: api.getUserRightSever,
            //     method: 'Get',
            //     data: {
            //       urlParams: {
            //         id: 'sujiangang'
            //       }
            //     }
            //   })
            // },1000)
          }
          removeCache();
        }
      } else if (urlPathName !== '/login') {
        if (logoutLock) return;
        logoutLock = true;
        message.destroy();
        message.error('系统服务异常！将自动退出系统！', 1, () => {});
        setTimeout(errorCallBack, 5000);
        //接口出错清除前端存储信息
        removeCache();
      }
      recordError({
        options,
        error: response,
        currentUrl
      });
      return Promise.resolve({
        error: true,
        statusCode: statusCode,
        statusMessage: msg
      });
    });
}
function removeCache() {
  //退出登录清除localStorage中的用户信息
  window.localStorage.removeItem('userInfo');
  window.localStorage.removeItem('oauth');
  //退出登录清除cookie中的用户信息
  Cookies.remove('token');
  //退出登录清除已填写的检索事由
  window.localStorage.removeItem('searchReasonParam');
}
function errorCallBack() {
  console.log('logout back to login');
  window.location = '/login';
}

function recordError(error) {
  localStorage.setItem(String(new Date().getTime()), JSON.stringify(error));
}
