window.config = {
    "version": "v2.0.0-zhangzhou",
    "systemName": '漳州市AI+交通管理系统', //系统名称
    "baseName": "",
    "logoConfig": {
        "systemLogo": false, //系统logo
        "companyLogo": true //公司logo
    },
    "hasCountDownLogout": true,
    "countDownLogoutTime": 1800000,
    "environments": {
        "ifaas": {
            "host": '127.0.0.1:8066',
            "apiBaseURL": 'http://127.0.0.1:8083', //api端口
            "mqttServer": {
            "host": '127.0.0.1',
            "port": 9001
            },
            "domain": {
            "replaceDomain": false
            },
            "pathMiddle": ""
        },
        "zml": {
            "host": '192.168.2.126:3040',
            // "apiBaseURL": 'http://192.168.11.165:8083', 
            "apiBaseURL": 'http://192.168.11.168:8083', //api端口 
            "mqttServer": {
              "host": '192.168.11.165', 
              "port": 9001
            },
            "domain": {
              "replaceDomain": false
            },
            "pathMiddle": ""
        },
        "czf": {
            "host": '192.168.2.97:3040',
            // "apiBaseURL": 'http://192.168.11.165:8083', 
            "apiBaseURL": 'http://192.168.11.168:8083', //api端口 
            "mqttServer": {
              "host": '192.168.11.165', 
              "port": 9001
            },
            "domain": {
              "replaceDomain": false
            },
            "pathMiddle": ""
        },
        "localhost": {
            "host": "localhost:3040",
            // "apiBaseURL": 'http://192.168.11.165:8083',   
            // "apiBaseURL": 'http://192.168.11.182:8083', //api端口 
            "apiBaseURL": 'http://192.168.11.168:8083', //api端口 
            "mqttServer": {
                "host": '192.168.11.190',
                "port": 9001
            },
            "domain": {
                "replaceDomain": false
            },
            "pathMiddle": ""
        }
    },
    "centerProxyServerPrefix": 'http://127.0.0.1', //中心代理服务器前缀
    "proxyLoginServerPrefix": 'http://10.204.120.178:1111', //二维码代理服务器前缀
    "keepLogin": true,//是否保持登录
    "systemDateRange": 90,//(系统时间范围，单位:天)
    "tokenInvalid": 1, //token保存时间(天)
    "loginTypeConfig": {
        "defaultType": 'form', //配置默认登录方式（form或qrcode）
        "form": true, //是否支持表单登录
        "qrcode": false //是否支持二维码登录
    },
    "getSearchStatisticWay": 'parallel', //请求检索统计结果方式:串行serial、并行parallel、混合mixin
    "streamMediaConfig": {
        "mediaType": 'rtmp',
        "playStartGap": 20000,
        "playEndGap": 2000,
        "hasStreamService": true
    },
    "hasStreamService": false,
    "mapServer": {
        "mapType": 'baiduOnline', //baiduOnline百度在线地图，baiduOffline百度离线地图
        "mapDefaultZoom": 12,
        "mapCenter": {
          "lat": 114.102316,
          "lng": 22.648365
        },
        "mapZoom": {
          "minZoom": 6,
          "maxZoom": 18
        },
        "serverUrl": {
          "baiduOffline": {
            "origin": 'http://192.168.11.65/ifaas/'
          },
          "baiduOnline": {
            "origin": 'http://api.map.baidu.com/'
          }
        }
    },
    "HomePage": {
        "id": 'HomePage',
        "name": '首页',
        "pageUrl": '/',
        "icon": './menu/homeTab.png',
        "iconAct": './menu/homeTabAct.png',
        "newIcon": 'sy',
        "state": null,
        "visibility": true,
        "disable": true
    },
    "ReviewPicture": {
        "id": 'ReviewPicture',
        "name": '抓拍审阅',
        "pageUrl": '/',
        "icon": './menu/captureTab.png',
        "iconAct": './menu/captureTabAct.png',
        "newIcon": 'zpsh',
        "state": null,
        "visibility": true,
        "disable": true
    },
    "ShootingRecord": {
        "id": 'ShootingRecord',
        "name": '拍摄记录',
        "pageUrl": '/',
        "icon": './menu/shootTab.png',
        "iconAct": './menu/shootTabAct.png',
        "newIcon": 'psjl',
        "state": null,
        "visibility": true,
        "disable": true
    },
    "FileStore": {
        "id": 'FileStore',
        "name": '档案库',
        "pageUrl": '/',
        "icon": './menu/fileTab.png',
        "iconAct": './menu/fileTabAct.png',
        "newIcon": 'dak',
        "state": null,
        "visibility": true,
        "disable": true
    },
    "ExportData": {
        "id": 'ExportData',
        "name": '数据导出',
        "pageUrl": '/',
        "icon": './menu/dataTab.png',
        "iconAct": './menu/dataTabAct.png',
        "newIcon": 'sjdc',
        "state": null,
        "visibility": true,
        "disable": true
    },
    "AccountSetting":{
        "bindingPhone": {
            "id": 'bindingPhone',
            "name": '绑定手机',
            "visibility": true,
            "disable": true
        },
        "compareFace": {
            "id": 'compareFace',
            "name": '人像对比',
            "visibility": true,
            "disable": false
        },
        "focus": {
            "id": 'focus',
            "name": '我的关注',
            "visibility": true,
            "disable": true
        },
        "changePass": {
            "id": 'changePass',
            "name": '修改账户',
            "visibility": true,
            "disable": false
        },
        "changeUser": {
            "id": 'changeUser',
            "name": '切换用户',
            "visibility": true,
            "disable": false
        }
    },
    "OtherSetting":{
        "addAccount": {
            "id": 'addAccount',
            "name": '添加人员',
            "visibility": true,
            "disable": false
        },
        "operationRecord": {
            "id": 'operationRecord',
            "name": '操作记录',
            "visibility": true,
            "disable": false
        },
        "personalManage": {
            "id": 'personalManage',
            "name": '人员管理',
            "visibility": true,
            "disable": false
        },
        "thresholdSetting": {
            "id": 'thresholdSetting',
            "name": '相似度阈值',
            "visibility": true,
            "disable": false
        },
        "videoSavetime": {
            "id": 'videoSavetime',
            "name": '视频储存时间',
            "visibility": true,
            "disable": false
        },
        "punishSetting": {
            "id": 'punishSetting',
            "name": '处罚相关设置',
            "visibility": true,
            "disable": false
        }
    }
}