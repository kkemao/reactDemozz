import request from './request';
import { api } from '../constants/Api';

let Cache = {
  camera: {},
  area: {},
  district: {}
};

function get(type, param) {
  switch (String(type).toLowerCase()) {
    case 'camera':
      break;
    case 'forefather':
    default:
      let json = {
        nodeType: 'camera',
        id: ''
      };
      if (typeof param == 'string' || typeof param == 'number') {
        json.id = param;
      } else if (typeof param == 'object') {
        json = param;
      } else {
        throw new Error('ForeFatherService 参数错误！');
      }

      if (Cache[json.nodeType] && Cache[json.nodeType][json.id]) {
        return Promise.resolve(Cache[json.nodeType][json.id]);
      }
      return getForeFather(json);
      break;
  }
}
function getForeFather(param) {
  return request({
    url: api.zoneForefather,
    method: 'post',
    data: param
  }).then(res => {
    const { data, errCode } = res;
    if (errCode == 0 && data.length > 0) {
      data.pop();
      Cache[param.nodeType][param.id] = data;
      return Promise.resolve(data);
    } else {
      throw new Error('no data');
    }
  });
}

export default {
  get: get
};
