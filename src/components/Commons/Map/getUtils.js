// 复杂的自定义覆盖物
export default function GetUtils(obj) {
  this.obj = obj;
  this.BMAP_DRAWING_RECTANGLE = 'rectangle';

  this.styleOptions = {
    strokeColor:
      this.obj.type == 'append' ||
      this.obj.type == 'appendA' ||
      this.obj.type == 'appendB'
        ? '#1070FF'
        : 'gray', //边线颜色。
    fillColor:
      this.obj.type == 'append' ||
      this.obj.type == 'appendA' ||
      this.obj.type == 'appendB'
        ? '#1070FF'
        : 'gray', //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 2, //边线的宽度，以像素为单位。
    strokeOpacity: 0.2, //边线透明度，取值范围0 - 1。
    fillOpacity: 0.1, //填充的透明度，取值范围0 - 1。
    strokeStyle: 'dashed' //边线的样式，solid或dashed。
  };

  this.BMAP_ANCHOR_TOP_RIGHT = 'Ub';

  if (this.obj.BMapLib == null) {
    alert('请求无返回，请检查地图服务是否开启。');
    return false;
  }
  //实例化鼠标绘制工具
  this.drawingManager = new this.obj.BMapLib.DrawingManager(this.obj.map, {
    isOpen: false, //是否开启绘制模式
    enableDrawingTool: false, //是否显示工具栏
    drawingToolOptions: {
      anchor: this.BMAP_ANCHOR_TOP_RIGHT, //位置
      offset: new this.obj.BMap.Size(5, 5) //偏离值
    },
    circleOptions: this.styleOptions, //圆的样式
    polylineOptions: this.styleOptions, //线的样式
    polygonOptions: this.styleOptions, //多边形的样式
    rectangleOptions: this.styleOptions //矩形的样式
  });

  this.openCvrRect = function() {
    this.drawingManager.setDrawingMode(this.BMAP_DRAWING_RECTANGLE);
    this.drawingManager.disableCalculate();
    this.drawingManager.open();

    //添加鼠标绘制工具监听事件，用于获取绘制结果
    this.drawingManager.addEventListener(
      'overlaycomplete',
      this.overlaycomplete
    );
  };

  this.rectLay = null;
  this.bounds = null;
  this.overlaycomplete = e => {
    this.rectLay = e.overlay;
    this.bounds = this.rectLay.getBounds();
    // this.drawingManager.close(); //关闭地图的绘制状态
    this.obj.cb(this.bounds, this.obj.type);
  };

  this.clearThis = function() {
    obj.map.removeOverlay(this.rectLay);
  };

  // if(obj.openRect){
  // }else{
  //     this.drawingManager.close();
  // }
}

/**
 * @exports GeoUtils as BMapLib.GeoUtils
 */
/**
 * GeoUtils类，静态类，勿需实例化即可使用
 * @class GeoUtils类的<b>入口</b>。
 * 该类提供的都是静态方法，勿需实例化即可使用。
 */

// var GeoUtils = obj.BMapLib.GeoUtils = function(){

// }

/**
 * 判断点是否在矩形内
 * @param {Point} point 点对象
 * @param {Bounds} bounds 矩形边界对象
 * @returns {Boolean} 点在矩形内返回true,否则返回false
 */
// GeoUtils.isPointInRect = function(point, bounds){
//     //检查类型是否正确
//     if (!(point instanceof obj.BMap.Point) ||
//         !(bounds instanceof obj.BMap.Bounds)) {
//         return false;
//     }
//     var sw = bounds.getSouthWest(); //西南脚点
//     var ne = bounds.getNorthEast(); //东北脚点
//     return (point.lng >= sw.lng && point.lng <= ne.lng && point.lat >= sw.lat && point.lat <= ne.lat);
// }

export function loadScript(url) {
  return new Promise(function(resolve, reject) {
      console.log('zml loadScript',url);
    const mapScript = document.createElement('script');
    mapScript.src = url;
    mapScript.type = 'text/javascript';
    mapScript.async = true;
    document.head.appendChild(mapScript);
    var onload = false;
    mapScript.onload = () => {
      onload = true;
      setTimeout(() => {
        resolve(mapScript);
      }, 200); // 这里加载过快  导致地图还没有加载下来出现错误
    };
    setTimeout(() => {
      if (onload == false) {
        reject('请求无返回，请检查地图服务是否开启。');
      }
    }, 3000);
  });
}

// 渲染热力图
export function renderHotMap(
  BMapLib,
  map,
  points,
  maxCount,
//   placeType,
  hotMapObj
) {
  if (hotMapObj) map.removeOverlay(hotMapObj);
  if (!map) return;
  const zoom = map.getZoom();
  // var pointsArr = [];
  // const pl = points.length;
  // for(let i = 0 ; i < pl ; i++){
  //   if(placeType !==0 && placeType !== points[i].placeTypeId)continue;
  //   pointsArr.push(points[i]);
  // }
  var r = 100 - (17 - zoom) * 15;
  r = r < 15 ? 15 : r;
  if (BMapLib == null) return;
  if (BMapLib.HeatmapOverlay == null) return;
  const heatmapOverlay = new BMapLib.HeatmapOverlay({
    radius: r
  });
  map.addOverlay(heatmapOverlay);
  heatmapOverlay.setDataSet({
    data: points,
    max: maxCount == 0 ? 200 : maxCount
  });
  var gradient = {
    0: 'rgb(10, 98, 164)',
    0.3: 'rgb(54, 141, 206)',
    1: 'rgb(144, 235, 157)'
  };
  heatmapOverlay.setOptions({ gradient: gradient });
  return heatmapOverlay;
}
// 渲染热力图
export function renderHotMapPerson(
    BMapLib,
    map,
    points,
    maxCount,
  //   placeType,
    hotMapObj
  ) {
    if (hotMapObj) map.removeOverlay(hotMapObj);
    if (!map) return;
    const zoom = map.getZoom();
    // var pointsArr = [];
    // const pl = points.length;
    // for(let i = 0 ; i < pl ; i++){
    //   if(placeType !==0 && placeType !== points[i].placeTypeId)continue;
    //   pointsArr.push(points[i]);
    // }
    var r = 100 - (17 - zoom) * 15;
    r = r < 25 ? 25 : r;
    if (BMapLib == null) return;
    if (BMapLib.HeatmapOverlay == null) return;
    const heatmapOverlay1 = new BMapLib.HeatmapOverlay({
      radius: r
    });
    map.addOverlay(heatmapOverlay1);
    heatmapOverlay1.setDataSet({
      data: points,
      max: maxCount == 0 ? 200 : maxCount
    });
    var gradient = {
      0: 'rgb(215, 25, 28)',
      0.3: 'rgb(239, 76, 79)',
      1: 'rgb(255, 255, 140)'
    };
    heatmapOverlay1.setOptions({ gradient: gradient });
    heatmapOverlay1.V.style.setProperty("position", 'absolute')
    
    return heatmapOverlay1;
  }

//添加控件和比例尺
export function addControl(BMap, map) {
  var top_left_control = new BMap.ScaleControl({
    anchor: 'BMAP_ANCHOR_TOP_LEFT'
  }); // 左上角，添加比例尺
  var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
  var top_right_navigation = new BMap.NavigationControl({
    anchor: 'BMAP_ANCHOR_TOP_RIGHT',
    type: 'BMAP_NAVIGATION_CONTROL_SMALL'
  }); //右上角，仅包含平移和缩放按钮
  /*缩放控件type有四种类型:
    BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/
  map.addControl(top_left_control);
  map.addControl(top_left_navigation);
  map.addControl(top_right_navigation);
}

//移除控件和比例尺
export function deleteControl(BMap, map) {
  var top_left_control = new BMap.ScaleControl({
    anchor: 'BMAP_ANCHOR_TOP_LEFT'
  }); // 左上角，添加比例尺
  var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
  var top_right_navigation = new BMap.NavigationControl({
    anchor: 'BMAP_ANCHOR_TOP_RIGHT',
    type: 'BMAP_NAVIGATION_CONTROL_SMALL'
  }); //右上角，仅包含平移和缩放按钮
  map.removeControl(top_left_control);
  map.removeControl(top_left_navigation);
  map.removeControl(top_right_navigation);
}

//计算重叠的摄像头
export function cacuPointsTolist(BMap, map, pointObj, point) {
  var pointList = [];
  var _point = new BMap.Point(point['lng'], point['lat']);
  var currentPoint = map.pointToOverlayPixel(_point);
  for (var i in pointObj) {
    var p = new BMap.Point(pointObj[i]['lng'], pointObj[i]['lat']);
    var pobj = map.pointToOverlayPixel(p);
    if (
      Math.abs(pobj.x - currentPoint.x) < 12 &&
      Math.abs(pobj.y - currentPoint.y) < 12
    ) {
      pointList.push(pointObj[i]);
    }
  }
  return pointList;
}

//数组排序
export function renderSortArr(arr) {
  return arr.sort(function(a, b) {
    return a - b; // 逆序return b-a
  });
}
/**
 *获取prvePoint和newPoint之间的num个点
 *@param BMap BMap对象
 *@param prvePoint 起点
 *@param newPoint 终点
 *@param num 取两中间的点个数
 *@return points 两点之间的num个点的数组
 */
export function getBetweenPoins(BMap, prvePoint, newPoint, num) {
  var lat;
  var lng;
  var points = [];
  if (prvePoint.lng > newPoint.lng && prvePoint.lat > newPoint.lat) {
    lat = Math.abs(prvePoint.lat - newPoint.lat) / num;
    lng = Math.abs(prvePoint.lng - newPoint.lng) / num;
    points[0] = prvePoint;
    for (var i = 1; i < num - 1; i++) {
      points[i] = new BMap.Point(
        prvePoint.lng - lng * (i + 1),
        prvePoint.lat - lat * (i + 1)
      );
    }
    points[num - 1] = newPoint;
  }
  if (prvePoint.lng > newPoint.lng && prvePoint.lat < newPoint.lat) {
    lat = Math.abs(prvePoint.lat - newPoint.lat) / num;
    lng = Math.abs(prvePoint.lng - newPoint.lng) / num;
    points[0] = prvePoint;
    for (var i = 1; i < num - 1; i++) {
      points[i] = new BMap.Point(
        prvePoint.lng - lng * (i + 1),
        prvePoint.lat + lat * (i + 1)
      );
    }
    points[num - 1] = newPoint;
  }
  if (prvePoint.lng < newPoint.lng && prvePoint.lat > newPoint.lat) {
    lat = Math.abs(prvePoint.lat - newPoint.lat) / num;
    lng = Math.abs(prvePoint.lng - newPoint.lng) / num;
    points[0] = prvePoint;
    for (var i = 1; i < num - 1; i++) {
      points[i] = new BMap.Point(
        prvePoint.lng + lng * (i + 1),
        prvePoint.lat - lat * (i + 1)
      );
    }
    points[num - 1] = newPoint;
  }
  if (prvePoint.lng < newPoint.lng && prvePoint.lat < newPoint.lat) {
    lat = Math.abs(prvePoint.lat - newPoint.lat) / num;
    lng = Math.abs(prvePoint.lng - newPoint.lng) / num;
    points[0] = prvePoint;
    for (var i = 1; i < num - 1; i++) {
      points[i] = new BMap.Point(
        prvePoint.lng + lng * (i + 1),
        prvePoint.lat + lat * (i + 1)
      );
    }
    points[num - 1] = newPoint;
  }

  return points;
}
