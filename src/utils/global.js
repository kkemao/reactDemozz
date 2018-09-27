import { message } from 'antd';
import request from './request';
import { api } from '../constants/Api';
import $IF from './config';

export const Events = {
  1: {
    id: 1,
    text: '入库',
    img: require('../asset/event/e_add.png'),
    name: 'add'
  },
  2: {
    id: 2,
    text: '停止布控',
    img: require('../asset/event/e_stoptask.png'),
    name: 'stoptask'
  },
  3: {
    id: 3,
    text: '开始布控',
    img: require('../asset/event/e_starttask.png'),
    name: 'starttask'
  },
  4: {
    id: 4,
    text: '删除',
    img: require('../asset/event/e_del.png'),
    name: 'del'
  },
  5: {
    id: 5,
    text: '编辑',
    img: require('../asset/event/e_edit.png'),
    name: 'edit'
  },
  1001: {
    id: 1001,
    text: '入库',
    img: require('../asset/event/e_add.png'),
    name: 'add'
  },
  1002: {
    id: 1002,
    text: '停止布控',
    img: require('../asset/event/e_stoptask.png'),
    name: 'stoptask'
  },
  1003: {
    id: 1003,
    text: '开始布控',
    img: require('../asset/event/e_starttask.png'),
    name: 'starttask'
  },
  1004: {
    id: 1004,
    text: '删除',
    img: require('../asset/event/e_del.png'),
    name: 'del'
  },
  1005: {
    id: 1005,
    text: '编辑',
    img: require('../asset/event/e_edit.png'),
    name: 'edit'
  }
};

$IF.roleMap = {
  SUPER_ADMIN: {
    id: 1,
    name: '超级管理员',
    modulars: [1, 100, 200, 300, 400, 500, 600, 700],
    unModulars: [101, 201, 202],
    addBank: true,
    crimeEdit: true,
    personEdit: true,
    personMark: true,
    personDelete: true,
    alarmDelete: true,
    search: true
  },
  MIDDLE_ADMIN: {
    id: 2,
    name: '中级管理员',
    modulars: [1, 100, 201],
    unModulars: [101, 200, 202],
    addBank: true,
    crimeEdit: false,
    personEdit: true,
    personMark: true,
    personDelete: true,
    alarmDelete: true,
    search: true
  },
  ADMIN: {
    id: 3,
    name: '初级管理员',
    modulars: [1, 100, 202],
    unModulars: [101, 200, 201],
    addBank: true,
    crimeEdit: false,
    personEdit: true,
    personMark: true,
    personDelete: true,
    alarmDelete: true,
    search: true
  },
  USER: {
    id: 4,
    name: '操作账号',
    modulars: [1, 100],
    unModulars: [101, 200, 201, 202],
    addBank: true,
    crimeEdit: false,
    personEdit: true,
    personMark: true,
    personDelete: true,
    alarmDelete: true,
    search: true
  },
  GUEST: {
    id: 5,
    name: '查询账号',
    modulars: [1, 101],
    unModulars: [100, 200, 201, 202],
    addBank: false,
    crimeEdit: false,
    personEdit: false,
    personMark: false,
    personDelete: false,
    alarmDelete: false,
    search: true
  }
};

//格式化报警信息
export const formatAlarmData = data => {
  if (data instanceof Array && data.length > 0) {
    for (var i = data.length - 1; i > -1; i--) {
      var location = formatEventData(data[i].events);
      data[i].location = location ? location : '';
    }
  }
  return data;
};
//格式化事件数据
export const formatEventData = data => {
  var location = '';
  if (data instanceof Array) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].confidence === -1 && Events[data[i].cameraName]) {
          data[i].imageData = Events[data[i].cameraName].img;
        }
        if (data[i].confidence > 0 && location === '') {
          location = data[i].cameraName;
        }
      }
    }
  }
  return location;
};
//获取区域列表
export function getZoneChild() {
  return request({
    url: api.zoneChild,
    method: 'post',
    data: {
      id: '0',
      nodeType: 'district',
      countNodeType: 'camera',
      spreadNodeType: 'camera',
      userId: null
    }
  }).then(res => {
    if (res && res.errCode === 0 && res.data) {
      let camerasData = {};
      for (let i = 0; i < res.data.length; i++) {
        let districts = res.data[i].childList;
        for (let j = 0; j < districts.length; j++) {
          let areas = districts[j].nextList;
          for (let k = 0; k < areas.length; k++) {
            let cameras = areas[k].nextList;
            for (let l = 0; l < cameras.length; l++) {
              camerasData[cameras[l].id] = cameras[l];
            }
          }
        }
      }
      console.log('区域所有摄像头数据', camerasData);
      return Promise.resolve(camerasData);
    } else {
      message.error('获取区域数据出错！');
    }
  });
}
//服务器连接IP替换
export function replaceImgDomain(data) {
  if (!window.$IF.env) return;
  const env = window.$IF.env;
  if (env.domain.replaceDomain === false) {
    return data;
  }
  var replaceData = data;
  if (env.domain.replaceDomain && env.domain.path === [])
    replaceData = replaceData.replace(new RegExp('http://', 'gm'), 'http://');
  if (env.domain.replaceDomain && env.domain.path.length > 0)
    env.domain.path.forEach(function(d, i) {
      replaceData = replaceData.replace(d.src, d.dst);
    });
  console.info('-----------successData----------', JSON.parse(replaceData));
  return replaceData;
}
export function getEnviroment(scope) {
  var host = window.location.host;
  //  一级路径匹配
  var curEnv = '';
  for (let env in scope.environments) {
    if (scope.environments[env].host === host) {
      curEnv = env;
    }
  }
  if (curEnv === '') {
    alert('配置文件错误！无此环境配置信息');
    return;
  }
  console.info('当前配置环境为:', curEnv, $IF.environments[curEnv]);
  window.config.env = $IF.environments[curEnv];
  return $IF.environments[curEnv];
}
//获取oauth认证信息及用户相关权限等信息
export function getOauth() {
  if (localStorage.getItem('oauth'))
    $IF.oauth = JSON.parse(localStorage.getItem('oauth'));
  if (!$IF.authentication) {
    $IF.oauth = {
      oauth_AIK_role_info_s: [
        {
          id: 2,
          resIds: 1
        }
      ],
      oauth_AIK_user_info: {
        name: 'admin',
        roleIds: 2,
        policeStationId: 5,
        faceId: '0',
        login: 'test',
        id: 88
      }
    };
  }
  if ($IF.oauth) {
    $IF.oauth.rights = ',' + $IF.oauth.oauth_AIK_role_info_s[0].resIds + ',';
  }
  if ($IF.oauth) {
    var role = $IF.roleMap[$IF.oauth.oauth_AIK_role_info_s[0].name];
    role = role || $IF.roleMap['GUEST'];
    $IF.right = role;
    $IF.oauth.oauth_AIK_user_info.roleIds = role.id;
  }
  console.log('当前用户拥有的权限', $IF.right);
}

export function IEVersion() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE =
    userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 =
    userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp['$1']);
    if (fIEVersion === 7) {
      return 7;
    } else if (fIEVersion === 8) {
      return 8;
    } else if (fIEVersion === 9) {
      return 9;
    } else if (fIEVersion === 10) {
      return 10;
    } else {
      return 6; //IE版本<=7
    }
  } else if (isEdge) {
    return 'edge'; //edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return -1; //不是ie浏览器
  }
}
//判断浏览器类型
export function BrowserType() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串

  var isIE =
    userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 =
    userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1; //判断是否IE11浏览器
  if (isIE || isEdge || isIE11) {
    return 'IE';
  } //判断是否IE浏览器
  if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    return 'Opera';
  } //判断是否Opera浏览器
  if (userAgent.indexOf('Firefox') > -1) {
    return 'FF';
  } //判断是否Firefox浏览器
  if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome';
  }
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari';
  } //判断是否Safari浏览器
}
export function getUuid() {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
}

// 播放声音(暂时未调用，用的是alarmaudio组件)
export function playSound(src, domId) {
  console.log('playsound', src);
  var dom = document.getElementById(domId);
  var browser = navigator.appName;
  var b_version = navigator.appVersion;
  var version = parseFloat(b_version);

  if (dom.length) {
    dom.src = src;
    dom.play();
  } else {
    var bgsound = document.createElement('bgsound');
    bgsound.id = domId;
    bgsound.src = src;
    document.body.appendChild(bgsound);
  }
}
//ZML模拟数据用的切割
export function chunk(arr, size) {
    var arr2=[];
    let arrLen = arr.length;
    if(!arrLen) return arr2;
    for(var i=0;i<arrLen;i=i+size){
      arr2.push(arr.slice(i,i+size));
    }
    return arr2;
  }
//截图
export function captureImage (video,scale) {
    var canvas = document.createElement("canvas");
    canvas.width = (video.videoWidth || video.offsetHeight) * scale;
    canvas.height = (video.videoHeight||video.offsetWidth) * scale;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    var img = document.createElement("img");
    img.src = canvas.toDataURL();
    return img;
};
//数组对象排序
export function compareArr(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 -value2;
    };
  }
