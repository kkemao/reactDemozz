import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { message, Spin } from 'antd';
import './Map.css';
import '../../../styles/animate.css';
import axios from 'axios';
import addCameraLay from './addCameraLay';
import MapConfig from './MapConfig';
import addCameraListBox from './addCameraListBox';
import request from '../../../utils/request';
import { api } from '../../../constants/Api';
import GetUtils, {
  loadScript,
  renderHotMap,
  renderHotMapPerson,
  addControl,
  cacuPointsTolist
} from './getUtils';
import { mapServer } from '../../../utils/config';
import CameraBox from './CameraBox.js';
import ErrorBoundary from '../../Error/ErrorBoundary';

import MapMock from './MapMock.json';                   //ZML模拟点位
import MapMockPerson from './MapMockPerson.json';


const defaultProps = {
  MapTest: 'Map',
  mapRect: function() {
    // console.log();
  }
};

const propTypes = {
  MapTest: PropTypes.string.isRequired,
  mapRect: PropTypes.func.isRequired
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      systemMode: props.CurrentMode,
      myDis: null,
      map: null,
      BMap: null,
      BMapLib: null,
      // openRect:true为打开框选功能
      openRect: false,
      drawRectState: null,
      hotMap: {
        obj: null,
        isShow: props.CurrentMode == 'search' ? false : true
      },
      hotMapPerson: {
        obj1: null,
        isShow: props.CurrentMode == 'search' ? false : true
      },
      toolStateString: 'cancelDrawRect',
      points: null,
      // 地图组件部分路径
      serverUrl: MapConfig,
      isShowCameraBox: false,
      isLoading: false,
      maxCount: 0,
      cameraListClose: null,
      isCameraEventInMap: false,
      currentClickCameraId: -1,
      isSearchState: false,
      searchResult: null,
      cameraSelectedObj: {}, // cameraid: true or false
      res:{},         //ZML模拟机动车点位
      resPerson:{}      //ZML模拟人点位
    };

    this.removeCamera = this.removeCamera.bind(this);
  }

componentWillReceiveProps(nextProps) {
    let nextArr = nextProps.mockMapPoint;
    if(nextArr.length != this.props.mockMapPoint.length){
        const {map, points, pointsPersonArr} = this.state;
        let isShow = this.state.hotMap.isShow;
        if(nextArr.indexOf('行人闯红灯')==-1){
            if(isShow){
                this.state.hotMapPerson.obj1.hide();
            }else{
                this.removeSinglePoint(pointsPersonArr,map,2);
            }
        }else{
            if(isShow){
                this.state.hotMapPerson.obj1.show();
            }else{
                this.removeCamera(this.state.map);
                this.renderCamera(
                    this.state.BMap,
                    this.state.map,
                    this.props,
                    isShow,
                    this.props.ids && this.props.ids.length > 0 ? true : false
                );
            }
        };

        if(nextArr.indexOf('车辆违法')==-1){
            if(isShow){
                this.state.hotMap.obj.hide();
            }else{
                this.removeSinglePoint(points,map,1);
            }
        }else{
            if(isShow){
                this.state.hotMap.obj.show();
            }else{
                // this.removeCamera(this.state.map);
                // this.renderCamera(
                //     this.state.BMap,
                //     this.state.map,
                //     this.props,
                //     isShow,
                //     this.props.ids && this.props.ids.length > 0 ? true : false
                // );
            }
        };
    }
       
    
}

  componentDidMount() {
    // 组件渲染完成后加载地图
    this.loadMap();
  }
//ZML模拟消除单组点位
removeSinglePoint=(pointArr,map,type)=>{
    // console.log('zml 移除',pointArr.length);
    if (pointArr && pointArr.length > 0) {
        // console.log('zml 移除00',pointArr[0]['containerdiv']);
        const len = pointArr.length;
        for (let j = 0; j < len; j++) {
            if (pointArr[j]['containerdiv'] !== null) {
                map.removeOverlay(pointArr[j].containerdiv);
                pointArr[j].containerdiv = null;
                // console.log('zml 移除11',j,pointArr[j].containerdiv);
            }
        }
    }
    // console.log('zml 移除--00',pointArr);
      if(type ==1){
        this.setState({
            points: pointArr
        });
      }else if(type ==2){
        //   console.log('zml 移除--',pointArr);
        this.setState({
            pointsPersonArr: pointArr
        });
      }
    
}
//ZML双色点位的控制
checkBoxChange=(nextArr)=>{
    
}

  //获取所有摄像头列表
  getAllCameraList = props => {
    console.log('zkfpropstype', props);
    this.setState({
      isLoading: true
    });
    const param = {
      queryBy: 'nameAndCode',
      query: '',
      id: 1,
      nodeType: 'district',
      inStation: '0',
      captureBankId: '1', // 库id
      placeTypeId: '' // 场所类型id   props.dingDian.placeType
    };
    const urlParam = {
      page: 1,
      pagesize: 100000
    };
    //ZML模拟8月8日demo输出虚假点位
    // request({
    //   url: api.GetCameraList,
    //   method: 'post',
    //   data: {
    //     ...param,
    //     urlParams: urlParam
    //   }
    // }).then(res => {
        console.log('zml demo输出res',MapMock);
        //ZML模拟8月8日demo输出虚假点位
        //    let res =  
        this.setState({
            isLoading: false,
            // res: res // 更换为测试数据cameraInfo/res
            res: MapMock, // ZML模拟8月8日demo输出虚假点位
            resPerson:MapMockPerson
        });
        // this.renderPointCollection(BMap, map, point);
        this.renderCamera(
            this.state.BMap,
            this.state.map,
            props,
            this.state.hotMap.isShow,
            props.CurrentMode == 'search' && props.ids.length > 0 ? true : false
        );
        this.getBMapLib(this.state.map);
    // });
  };

  renderImgFromSearch = res => {
    // 摄像头检索结果张数对象  id-value -> res.cameraStatistic
    console.log('zkf-res-count', res);
    if (res && res.data && res.data.length > 0) {
      var rl = res.data.length;
      for (let i = 0; i < rl; i++) {
        var pDom = document.getElementById(
          'faceCameraBox-' + res.data[i].cameraId
        );
        if (pDom) {
          if (
            this.state.cameraSelectedObj[res.data[i].cameraId] &&
            this.state.cameraSelectedObj[res.data[i].cameraId] == true
          ) {
            pDom.className = 'faceBoxInMap newstyle active';
          } else {
            pDom.className = 'faceBoxInMap newstyle';
          }
          document.getElementById(
            'faceImgCameraBox-' + res.data[i].cameraId
          ).src =
            res.data[i].cameraFaceInfoDtoList[0].file;
          document.getElementById(
            'faceBoxInMap-count-' + res.data[i].cameraId
          ).innerHTML = res.cameraStatistic
            ? res.cameraStatistic[res.data[i].cameraId]
            : 0;
        }
      }
    }
  };
  // 加载地图文件
  loadMap() {
    loadScript(
      mapServer.serverUrl[mapServer.mapType].origin +
        this.state.serverUrl[mapServer.mapType].mapUrl
    )
      .then(
        mapScript => {
          setTimeout(() => {
            if (!window.BMap) return;
            const BMap = window.BMap;
            const map = new BMap.Map('mapContianer', {
              minZoom: mapServer.mapZoom.minZoom,
              maxZoom: mapServer.mapZoom.maxZoom,
              enableMapClick: false
            });
            // 在线百度地图样式应用
            if (mapServer.mapType == 'baiduOnline') {
              // map.setMapStyle({
              //   styleJson: [
              //     {
              //       featureType: 'all',
              //       elementType: 'all',
              //       stylers: {
              //         lightness: 10,
              //         saturation: -100
              //       }
              //     }
              //   ]
              // });
              map.setMapStyle({
                styleJson: [
                    {
                              "featureType": "background",
                              "elementType": "geometry.fill",
                              "stylers": {
                                        "color": "#1c232bff",
                                        "weight": "1",
                                        "lightness": -29
                              }
                    },
                    {
                              "featureType": "road",
                              "elementType": "geometry",
                              "stylers": {
                                        "color": "#050d16ff"
                              }
                    },
                    {
                              "featureType": "all",
                              "elementType": "labels.text.fill",
                              "stylers": {
                                        "color": "#808696ff"
                              }
                    },
                    {
                              "featureType": "all",
                              "elementType": "labels.text.stroke",
                              "stylers": {
                                        "color": "#050b14ff"
                              }
                    },
                    {
                              "featureType": "manmade",
                              "elementType": "geometry",
                              "stylers": {
                                        "color": "#222b33ff"
                              }
                    }
          ]
              });
            }
            this.setState({
              BMap: BMap,
              map: map
            });
            this.renderMap(this.state.BMap, this.state.map);
            map.addEventListener('click', e => {
              console.log(
                '当前点击位置坐标为：' + e.point.lng + '，' + e.point.lat
              );
            });
            map.addEventListener('rightclick', e => {
              this.clickMain('cancelDrawRect', '');
            });
            if (this.props.CurrentMode !== 'monitor') {
              map.addEventListener('zoomend', () => {
                console.log('this.getZoom()', map.getZoom());
                // map.removeOverlay(this.state.hotMap.obj);

                if (!this.state.hotMap.isShow) {
                  this.renderCamera(
                    BMap,
                    map,
                    this.props,
                    this.state.hotMap.isShow,
                    this.props.CurrentMode == 'search' &&
                    this.props.ids.length > 0
                      ? true
                      : false,
                    true
                  );
                }
                if (this.props.ids == '' || this.props.CurrentMode == 'capture')
                  this.hotMapFun(map, this.props);
              });
            }
          }, 200);
        },
        err => {
          // console.log('err', err);
          message.error(err);
        }
      )
      .then(() => {
        this.loadRectJs();
      });
  }

  // 加载框选js文件
  loadRectJs() {
    if (!window.BMap) return;
    loadScript(
      mapServer.serverUrl[mapServer.mapType].origin +
        this.state.serverUrl[mapServer.mapType].drawingManage
    )
      .then(script => {
        loadScript(
          mapServer.serverUrl[mapServer.mapType].origin +
            this.state.serverUrl[mapServer.mapType].getUtils
        );
      })
      .then(script => {});
  }

  // 渲染地图
  renderMap(BMap, map) {
    if (!BMap || !map) return;
    const point = new BMap.Point(
      mapServer.mapCenter.lat,
      mapServer.mapCenter.lng
    );
    map.centerAndZoom(point, mapServer.mapDefaultZoom);
    map.enableScrollWheelZoom(); // 允许滚轮缩放
    // addControl(BMap, map);
    this.getAllCameraList(this.props);
  }

  // 获取地图工具BMapLib
  getBMapLib(map) {
        loadScript(
        mapServer.serverUrl[mapServer.mapType].origin +
            this.state.serverUrl[mapServer.mapType].heatMap
        ).then(obj => {
        map && this.hotMapFun(map, this.props);
        });
  }

  hotMapFun = (map, props, pointsArr,pointsPersonArr) => {
        map.removeOverlay(this.state.hotMap.obj);
        map.removeOverlay(this.state.hotMapPerson.obj1);
        const show = this.state.hotMap.isShow;
        const hotMap = renderHotMap(
            window.BMapLib,
            map,
            pointsArr ? pointsArr : this.state.points,
            this.state.maxCount,
            //   props.dingDian.placeType,
            this.state.hotMap.obj
        );
        const hotMapPerson = renderHotMapPerson(
            window.BMapLib,
            map,
            this.state.pointsPersonArr ,
            this.state.maxCount,
            //   props.dingDian.placeType,
            this.state.hotMapPerson.obj1
        );
        !this.state.hotMap.isShow && hotMap.hide();
        !this.state.hotMap.isShow && hotMapPerson.hide();
        this.setState({
            BMapLib: window.BMapLib,
            hotMap: {
                obj: hotMap,
                isShow: show
            },
            hotMapPerson: {
                obj1:hotMapPerson,
                isShow: show
            },
        });
        // this.mapDistance(map);
  };

  // 测距
  mapDistance(map) {
    loadScript(
      mapServer.serverUrl[mapServer.mapType].origin +
        this.state.serverUrl[mapServer.mapType].distanceTool
    ).then(obj => {
      this.myDis = new this.state.BMapLib.DistanceTool(map);
    });
  }

  // 移除摄像头
  removeCamera(map) {
    const {points, pointsPersonArr} = this.state;
    if (points && points.length > 0) {
      const l = points.length;
      for (let i = 0; i < l; i++) {
        if (points[i]['containerdiv'] !== null) {
          map.removeOverlay(points[i].containerdiv);
          points[i].containerdiv = null;
        }
      }
    }
    //ZML模拟为了8月8日的demo
    if (pointsPersonArr && pointsPersonArr.length > 0) {
        const len = pointsPersonArr.length;
        for (let j = 0; j < len; j++) {
          if (pointsPersonArr[j]['containerdiv'] !== null) {
            map.removeOverlay(pointsPersonArr[j].containerdiv);
            pointsPersonArr[j].containerdiv = null;
          }
        }
      }
    this.setState({
      points: points,
      pointsPersonArr:pointsPersonArr
    });
  }

  // 标注摄像头
  renderCamera(BMap, map, props, isShow, isSearchState, isChangeZoom) {
        isChangeZoom = isChangeZoom || false;
        if (typeof this.state.cameraListClose == 'function')
        this.state.cameraListClose();
        !isShow && this.removeCamera(map);
        var maxCount = this.state.maxCount;
        var maxPersonCount = this.state.maxCount;
        // const points = this.state.points;
        const points = this.state.res ? this.state.res.data : [];
        const pointsArr = [];
        const pl = (points && points.length) || 0;
       
        if (!map) return;
        console.log('renderstarttime', new Date().getTime(), points, props);
        for (let i = 0; i < pl; i++) {
            if (!points[i]) continue;
            points[i].count = points[i].captureCount;
            if (points[i].count > maxCount) maxCount = points[i].count;
            // 检索状态下如果该摄像头结果为0 则不展示
            if (points[i].searchResult == 0 && props.ids && props.ids.length > 0) {
                pointsArr.push(points[i]);
                continue;
            }
            if (points[i].geoString.indexOf('POINT') !== -1) {
                points[i].geoString = points[i].geoString
                .replace('POINT(', '')
                .replace(')', '');
            }
            points[i].lng = points[i].geoString.split(' ')[0];
            points[i].lat = points[i].geoString.split(' ')[1];
            points[i].offset = map.pointToOverlayPixel(
                new BMap.Point(points[i].lng, points[i].lat)
            );
            var isRender = false;
            var hasResultCount = 0;
            // 如果检索状态下有结果的话 就直接跳过判断渲染到地图
            if (
                !(
                props.ids &&
                props.ids.length > 0 &&
                points[i].searchResult &&
                points[i].searchResult > 0
                )
            ) {
                for (let j = 0; j < i; j++) {
                // 114.074868,"lat":22.540678
                // if(points[i].isRender == false)continue; //只跟渲染的摄像头比较
                if (
                    points[j] &&
                    points[j].offset &&
                    points[j].offset.x &&
                    Math.abs(points[i].offset.x - points[j].offset.x) < 12 &&
                    Math.abs(points[i].offset.y - points[j].offset.y) < 12
                ) {
                    // if( Math.abs(points[i].lng - points[j].lng) < 0.0001 || Math.abs(points[i].lat - points[j].lat) < 0.0001 ){
                    isRender = true;
                }
                }
            }
            const point = points[i]; // new BMap.Point(points[i]['lng'], points[i]['lat']);
            pointsArr.push(points[i]);
            if (
                !isShow &&
                isRender !== true &&
                this.props.CurrentMode !== 'monitor'
            ) {
                const cObj = addCameraLay({
                BMap: BMap,
                map: map,
                point: point,
                showCount: false,
                from: 'searchSystem',
                isSearchState: isSearchState,
                mouseClick: this.cameraIn.bind(this),
                mouseEnter: this.cameraMouseEnter.bind(this)
                // mouseLeave: this.cameraOut.bind(this)
                });
                point.cameraBgDom = cObj.cameradiv;
                point.containerdiv = cObj.containerdiv;
            }
            hasResultCount++;
        }
        //ZML模拟为了demo才写的
        const pointsPerson = this.state.resPerson ? this.state.resPerson.data : [];             //ZML模拟人点位
        const pointsPersonArr = [];
        const pointPersonLen = (pointsPerson && pointsPerson.length) || 0;
        for (let j = 0; j < pointPersonLen; j++) {
            if (!pointsPerson[j]) continue;
            pointsPerson[j].count = pointsPerson[j].captureCount;
            if (pointsPerson[j].count > maxPersonCount) maxPersonCount = pointsPerson[j].count;
            // 检索状态下如果该摄像头结果为0 则不展示
            if (pointsPerson[j].searchResult == 0 && props.ids && props.ids.length > 0) {
                pointsPersonArr.push(pointsPerson[j]);
                continue;
            }
            if (pointsPerson[j].geoString.indexOf('POINT') !== -1) {
                pointsPerson[j].geoString = pointsPerson[j].geoString
                .replace('POINT(', '')
                .replace(')', '');
            }
            pointsPerson[j].lng = pointsPerson[j].geoString.split(' ')[0];
            pointsPerson[j].lat = pointsPerson[j].geoString.split(' ')[1];
            pointsPerson[j].offset = map.pointToOverlayPixel(
                new BMap.Point(pointsPerson[j].lng, pointsPerson[j].lat)
            );
           
            const pointPerson = pointsPerson[j]; // new BMap.Point(pointsPerson[i]['lng'], pointsPerson[i]['lat']);
            pointsPersonArr.push(pointsPerson[j]);
            if (
                !isShow &&
                this.props.CurrentMode !== 'monitor'
            ) {
                const cObjPerson = addCameraLay({
                    BMap: BMap,
                    map: map,
                    point: pointPerson,
                    showCount: false,
                    from: 'searchSystem',
                    isSearchState: isSearchState,
                    mouseClick: this.cameraIn.bind(this),
                    mouseEnter: this.cameraMouseEnter.bind(this)
                });
                pointPerson.cameraBgDom = cObjPerson.cameradiv;
                pointPerson.containerdiv = cObjPerson.containerdiv;
            }
        }
        //ZML模拟为了demo才写的
        console.log('renderstarttime222', new Date().getTime());
        if (hasResultCount == 0) {
        this.props.isGis == true && message.warn('没有符合条件的摄像头。');
        }
    
        this.setState({
        points: pointsArr,
        pointsPersonArr:pointsPersonArr,              //ZML模拟人点位
        maxCount: maxCount,
        //   isShowCameraBox: props.cameraIds.length > 0 ? true : false,
        isSearchState: isSearchState
        });
        return pointsArr;
  }

  // 点击摄像头响应事件
  cameraIn(point) {
    const pointList = cacuPointsTolist(
      this.state.BMap,
      this.state.map,
      this.state.points,
      point
    );
    console.log('zml 点击摄像头响应事件',pointList);
    if (pointList.length <= 1) {
        // zml注释
        // if (this.props.CurrentMode == 'capture') {
        //     this.captureEvent({ type: 'name', point: point });
        // } else if (this.props.CurrentMode == 'search') {
        //     this.setState({
        //     currentClickCameraId: point.id,
        //     isCameraEventInMap: true
        //     });
        //     this.props.showTimeLineEvent({
        //       id: point.id,
        //       name: point.name,
        //       type: this.props.type
        //     });
        // }
        console.log('zml 单选摄像头',point);
        let pointSingleArr = [point];
        
        this.sameRemoveSelected(point);  //ZML统一修改变色

        var cameraListClose = addCameraListBox({
            BMap: this.state.BMap,
            map: this.state.map,
            point: point,
            pointList: pointSingleArr,
            isSearchState:
              (this.props.currentMode == 'search' && this.props.ids.length > 0) ||
              false,
            cb: res => {
              if (this.props.CurrentMode == 'capture') {
                this.captureEvent(res);
              } else if (this.props.CurrentMode == 'search') {
                this.setState(
                  {
                    currentClickCameraId: res.point.id,
                    isCameraEventInMap: true
                  },
                  () => {
                    
                      //zml注释
                    // this.props.showTimeLineEvent({
                    //   id: res.point.id,
                    //   name: res.point.name,
                    //   type: this.props.type
                    // });
                  }
                );
              }
                //ZML8月8输出demo
                setTimeout(() => {
                    this.props.onChangeCameraFilterFromMap([res.point]);
                }, 300);
            },
            onChangeCameraFilterFromMap:this.props.onChangeCameraFilterFromMap
        });
        this.props.onChangeCameraFilterFromMap(pointSingleArr);
    } else {
      console.warn(
        '当前点位包含' + pointList.length + '个重叠的摄像头',
        pointList
      );
      console.log('zkfzkf', this.props, this.state);
      //zml删除已经标黄的点位
      let allPoints = this.state.points.concat(this.state.pointsPersonArr);
        for (let i in allPoints) {
            if (allPoints[i]['cameraBgDom']) {
                allPoints[i]['selected'] == false
                allPoints[i]['cameraBgDom'].className = 'camerabg-inmap';
            }
        }
      var cameraListClose = addCameraListBox({
        BMap: this.state.BMap,
        map: this.state.map,
        point: point,
        pointList: pointList,
        isSearchState:
          (this.props.currentMode == 'search' && this.props.ids.length > 0) ||
          false,
        cb: res => {
          if (this.props.CurrentMode == 'capture') {
            this.captureEvent(res);
          } else if (this.props.CurrentMode == 'search') {
            this.setState(
              {
                currentClickCameraId: res.point.id,
                isCameraEventInMap: true
              },
              () => {
                
                  //zml注释
                // this.props.showTimeLineEvent({
                //   id: res.point.id,
                //   name: res.point.name,
                //   type: this.props.type
                // });
              }
            );
          }
            //ZML8月8输出demo
            setTimeout(() => {
                this.props.onChangeCameraFilterFromMap([res.point]);
            }, 300);
           this.sameRemoveSelected(point);  //ZML统一修改变色
        },
        onChangeCameraFilterFromMap:this.props.onChangeCameraFilterFromMap,
        allPoints:this.state.points.concat(this.state.pointsPersonArr)    //ZML作为关闭窗口清除select表示
      });
      //ZML模拟另一组点位0808demo输出
      const pointPersonList = cacuPointsTolist(
        this.state.BMap,
        this.state.map,
        this.state.pointsPersonArr,
        point
      );

      this.setState({
        cameraListClose: cameraListClose
      });
    }
  }

  sameRemoveSelected = (point)=>{
    let pointSingleArr = [point];
    let allPoints = this.state.points.concat(this.state.pointsPersonArr);
    for (let i in allPoints) {
        if (allPoints[i]['cameraBgDom']) {
            allPoints[i]['selected'] == false
            allPoints[i]['cameraBgDom'].className = 'camerabg-inmap';
        }
    }
    point['selected'] == true;
    point['cameraBgDom'].className = 'camerabg-inmap selected';
  }

  // 移入摄像头响应事件
  cameraMouseEnter(point, e) {
    const pointList = cacuPointsTolist(
      this.state.BMap,
      this.state.map,
      this.state.points,
      point
    );
    if (pointList.length <= 1) {
      console.warn('当前点位没有重叠的摄像头');
      e.target.title = e.target.title.split(',')[0];
    } else {
      console.warn(
        '当前点位包含' + pointList.length + '个重叠的摄像头',
        pointList
      );
      e.target.title =
        e.target.title.split(',')[0] +
        ', 当前点位包含' +
        pointList.length +
        '个重叠的摄像头';
    }
  }

  // 查看摄像头抓拍详情 or 查看摄像头照片
  captureEvent(res) {
    const id = res.point.id;
    const count = res.point.captureCount;
    const {  history } = this.props;
    //zml注释
    // this.props.selectItem(res.point);
    //改变路由
    let href = window.location.pathname + 'Detail';
    history.replace({
      pathname: href,
      state: { cameraId: id, captureCount: count }
    });
    this.setState({});
  }

  // 鼠标移出摄像头点位触发
  cameraOut(point) {
    console.log('out', point);
  }

  // 测距的控制 打开open  关闭close
  openDis(type) {
    this.myDis[type](); //开启鼠标测距
    //this.myDis.close()  //关闭鼠标测距
  }

  // 取消框选
  cancelDrawRect() {
    if (this.state.openRect) {
      if (this.state.drawRectState == null) {
        // message.error('地图服务加载异常，请确保能正常访问地图服务地址。');
        return false;
      }
      this.state.drawRectState.drawingManager.close();
      this.state.drawRectState.clearThis();
      this.setState({
        openRect: !this.state.openRect
        // cameraSelectedObj: {}
      });
    }
    // this.state.map.setDefaultCursor("default");
  }

  // 框选
  drawRect(type) {
    if (this.state.openRect == true) {
      this.cancelDrawRect();
      return false;
    }
    if (this.state.BMapLib == null) {
      message.error('地图工具加载异常，请确保能正常访问地图服务地址。');
      return false;
    }
    this.setState({
      openRect: true
    });
    var drawRect;
    drawRect = new GetUtils({
      map: this.state.map,
      BMap: this.state.BMap,
      BMapLib: this.state.BMapLib,
      openRect: this.state.openRect,
      type: type,
      cb: this.cacuPoint.bind(this)
    });
    this.startDraw(drawRect);
  }

  // 开始画框，圈出框内摄像头
  startDraw(drawRect) {
    drawRect.openCvrRect();
    this.setState({
      drawRectState: drawRect
    });
  }

  // 框选回调
  cacuPoint(bounds, type) {
    const sw = bounds.getSouthWest(); //西南脚点
    const ne = bounds.getNorthEast(); //东北脚点
    const points = this.state.points.concat(this.state.pointsPersonArr);    //ZML模拟demo1的框选回调
    var count = 0;
    var cameraIds = [];
    var cameraObj = {};
    console.log('框选points', points);
    for (let i = 0; i < points.length; i++) {
      if (
        points[i]['lng'] >= sw.lng &&
        points[i]['lng'] <= ne.lng &&
        points[i]['lat'] >= sw.lat &&
        points[i]['lat'] <= ne.lat
      ) {
        points[i]['selected'] = !points[i]['selected'];
        points[i]['selected'] == true ? count++ : count--;
      }
      if (points[i]['selected'] == true) {
        cameraIds.push(points[i]['id']);
        cameraObj[points[i]['id']] = true;
      } else {
        cameraObj[points[i]['id']] = false;
      }
    }
    this.state.drawRectState.clearThis();
    this.setState({
      points: points,
      cameraSelectedObj: cameraObj
    });
    console.log('count', '框选了' + count + '个摄像头');
    this.isShowCameraBox(points);
    // setTimeout(() => {
    //   this.props.onChangeCameraFilterFromMap(cameraIds);
    // }, 300);
  }

  // 框选弹窗判断
  isShowCameraBox = (points, index) => {
      console.log('zml 框选判断',points, index);
    var count = 0;
    var cameraIds = [];

    var cameraSelectedObj = this.state.cameraSelectedObj;
    for (let i in points) {
      points[i].selected && count++;
      points[i].selected && cameraIds.push(points[i].id);
      if (points[i]['cameraBgDom']) {
        points[i]['selected'] == true
          ? (points[i]['cameraBgDom'].className = 'camerabg-inmap selected')
          : (points[i]['cameraBgDom'].className = 'camerabg-inmap');
      }
      if (points[i]['selected'] !== true)
        cameraSelectedObj[points[i].id] = false;
    }
    setTimeout(() => {
      this.props.onChangeCameraFilterFromMap(cameraIds);
    }, 300);
    if (count > 0) {
      this.setState({
        isShowCameraBox: true,
        cameraSelectedObj: cameraSelectedObj
      });
    } else {
      if (this.camera_selected_box) {
        ReactDOM.findDOMNode(this.camera_selected_box).className = 'camera-box';
        setTimeout(() => {
          if (ReactDOM.findDOMNode(this.camera_selected_box)) {
            ReactDOM.findDOMNode(this.camera_selected_box).className =
              'camera-box leftIn-off';
          }
        }, 20);
        setTimeout(() => {
          if (ReactDOM.findDOMNode(this.camera_selected_box)) {
            ReactDOM.findDOMNode(this.camera_selected_box).className =
              'camera-box';
            this.setState({
              isShowCameraBox: false,
              cameraSelectedObj: cameraSelectedObj
            });
          }
        }, 500);
      }
    }
  };
  //zml 选中的单个查看视频
choosenSinglePoint = (index)=>{
    let points =this.state.points;
    let cameraInfo = [];
    cameraInfo.push(points[index]);
    console.log('zml 点击',index,points[index]);
    setTimeout(() => {
        this.props.onChangeCameraFilterFromMap(cameraInfo);
    }, 300);
}

  // getPointsData = () => {
  //   axios
  //     .get('http://192.168.2.140:3000/points-sample-data.json', {})
  //     .then(response => {
  //       console.log('response', response);
  //       this.setState({
  //         res: response,
  //         // res: res // 更换为测试数据
  //       });
  //     });
  // }

  // 标注海量点
  renderPointCollection(BMap, map) {
    axios
      .get(window.location.origin + '/points-sample-data.json', {})
      .then(response => {
        const data = response.data;
        if (document.createElement('canvas').getContext) {
          // 判断当前浏览器是否支持绘制海量点
          var points = []; // 添加海量点数据
          for (let i = 0; i < data.data.length; i++) {
            points.push(new BMap.Point(data.data[i][0], data.data[i][1]));
          }
          const options = {
            size: 5, // 点的大小，参数为:BMAP_POINT_SIZE_BIG,BMAP_POINT_SIZE_SMALL
            shape: 2, //点的样式，参数为:BMAP_POINT_SHAPE_WATERDROP,BMAP_POINT_SHAPE_STAR,BMAP_POINT_SHAPE_RHOMBUS
            color: '#d340c3'
          };
          const pointCollection = new BMap.PointCollection(points, options); // 初始化:PointCollection
          pointCollection.addEventListener('click', function(e) {
            console.log('单击点的坐标为:' + e.point.lng + ',' + e.point.lat); // 监听点击事件
          });
          map.addOverlay(pointCollection); // 添加Overlay
        } else {
          console.log('请在chrome、IE9+以上浏览器运行');
        }
      });
  }

  // 组件方法传入子组件，用于监听子组件返回的参数变化
  listenChildchange = (points, index) => {
    return function(points, index) {
      this.isShowCameraBox(points, index);
    }.bind(this);
  };

  mapRectFun() {
    this.props.mapRect(this.props);
  }

  // 热力图开关
  hotMap_ON_OFF = () => {
    const isShow = !this.state.hotMap.isShow;
    if (this.state.hotMap.obj == null) {
      message.error('地图服务加载异常，请确保能正常访问地图服务地址。');
      return;
    }
    this.setState({
        hotMap: {
            obj: this.state.hotMap.obj,
            isShow: isShow
        },
        hotMapPerson: {
            obj1: this.state.hotMapPerson.obj1,
            isShow: isShow
        }
      
    });
    let mockMapPoint = this.props.mockMapPoint;
    console.log('zml 切换热力图的主按钮',mockMapPoint);
    if (isShow == true) {
        console.log('zml hotmap show', this.state.hotMapPerson.obj1.show)
        // this.state.hotMap.obj.show();
        // this.state.hotMapPerson.obj1.show();
        if(mockMapPoint.indexOf('行人闯红灯') !=-1){
            this.state.hotMapPerson.obj1.show();
        };
        if(mockMapPoint.indexOf('车辆违法') !=-1){
            this.state.hotMap.obj.show();
        };
        this.removeCamera(this.state.map);
    } else {
        this.state.hotMap.obj.hide();
        this.state.hotMapPerson.obj1.hide();
        this.renderCamera(
            this.state.BMap,
            this.state.map,
            this.props,
            isShow,
            this.props.ids && this.props.ids.length > 0 ? true : false
        );
    }

  };

  // 地图按钮分发器
  clickMain = (type, data) => {
    this.btnStateInMap(type, data);
    this[type](data);
  };

  // 设置地图右上角按钮的状态
  btnStateInMap(type, data) {
    // 先清除之前选择的状态，此处未判断之前是否选中，一律清除
    this.myDis && this.myDis.close();
    this.cancelDrawRect();
    var typeString = type + (typeof data == 'boolean' ? '' : data);
    if (data == false) {
      typeString = 'cancelDrawRect';
    }
    this.setState({
      toolStateString: typeString
    });
  }

  render() {
    const {
      MapTest,
      mapRect,
      CurrentMode,
      selectMenuData,
      hideTimeLineEvent,
      onClickFace,
      starttime,
      endtime,
      dayStartTime,
      dayEndTime,
      weekDay,
      quality,
      gender, //过滤项，性别
      genderConfidence, //过滤项，性别置信度
      race, //过滤项，种族
      raceConfidence, //过滤项，性别置信度
      age, //过滤项，年龄
      hat, //过滤项，帽子
      hatConfidence, //过滤项，性别置信度
      glasses, //过滤项，眼镜
      glassesConfidence, //过滤项，性别置信度
      customStyle,
      timeLineParam,
      isTimeLineEventState
    } = this.props;
    const captureParam = {
      sourceId: 0,
      sourceType: 0,
      starttime,
      endtime,
      dayStartTime,
      dayEndTime,
      weekDay,
      quality,
      gender, //过滤项，性别
      genderConfidence, //过滤项，性别置信度
      race, //过滤项，种族
      raceConfidence, //过滤项，性别置信度
      age, //过滤项，年龄
      hat, //过滤项，帽子
      hatConfidence, //过滤项，性别置信度
      glasses, //过滤项，眼镜
      glassesConfidence //过滤项，性别置信度
    };

    return (
      <ErrorBoundary>
        <div className="mapWrap">
          { this.state.isShowCameraBox ? (
            <CameraBox
              points={this.state.points}
              ref={div => {
                this.camera_selected_box = div;
              }}
              choosenSinglePoint={this.choosenSinglePoint}
              changeFun={this.listenChildchange(this.state.points)}
            //   changeTipModalState={this.props.changeTipModalState}   //zml注释
              ids={this.props.ids || ''}
            />
          ) : (
            ''
          )}
          <h5 className="map-tool-box">
                <span
                    onClick={this.clickMain.bind(
                    this,
                    'hotMap_ON_OFF',
                    !this.state.hotMap.isShow
                    )}
                    className={`map-control map-control-icon relitu ${
                    this.state.toolStateString == 'hotMap_ON_OFF' ? 'active' : ''
                    }`}
                >
                    {!this.state.hotMap.isShow ? '显示热力图' : '隐藏热力图'}
                </span>
            <span
              onClick={this.clickMain.bind(this, 'openDis', 'open')}
              className={`map-control map-control-icon dn ${
                this.state.toolStateString == 'openDisopen' ? 'active' : ''
              }`}
            >
              {MapTest}
            </span>
            <span
              onClick={this.clickMain.bind(this, 'mapRectFun', '')}
              className={`map-control map-control-icon dn ${
                this.state.toolStateString == 'mapRectFun' ? 'active' : ''
              }`}
            >
              打开
            </span>
            <span
                onClick={this.clickMain.bind(this, 'drawRect', 'append')}
                className={`map-control map-control-icon kuangxuan ${
                    this.state.toolStateString == 'drawRectappend' &&
                    this.state.openRect
                    ? 'active'
                    : ''
                }`}
                title="右键可直接退出框选"
                >
                {this.state.openRect ? '取消框选' : '框选'}
            </span>
          </h5>
            <Spin
              className="wp spin-center zi1060 "
              size="small"
              spinning={this.state.isLoading}
            />
          <div id="mapContianer" className="map-container" />
        </div>
      </ErrorBoundary>
    );
  }
}

Map.defaultProps = defaultProps;
Map.propTypes = propTypes;

export default Map;
