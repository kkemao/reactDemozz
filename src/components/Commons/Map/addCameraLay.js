// 复杂的自定义覆盖物
/**
 *
 * @param {*} obj
 * @param BMap,百度地图的BMap对象
 * @param map,百度地图的map对象
 * @param point,百度地图的point对象
 * @param text,要传入显示的文本
 */
export default function addCameraLay(obj) {
  var self;
  function ComplexCustomOverlay(point, text) {
    self = this;
    this._point = new obj.BMap.Point(point['lng'], point['lat']);
    this._text = point.count;
    this._selected = point.selected || false;
    this._isAreaA = point.isAreaA || false;
    this._isAreaB = point.isAreaB || false;
  }

  ComplexCustomOverlay.prototype = new obj.BMap.Overlay();
  ComplexCustomOverlay.prototype.initialize = function(map) {
    this._map = map;
    var div = (this._div = document.createElement('div'));
    div.className = 'camera-container-inmap cameraBox-' + obj.point.id;
    div.style.zIndex = obj.BMap.Overlay.getZIndex(this._point.lat);
    div.title = obj.point.name;

    // 检索时人脸头像 添加人脸头像
    // "http://192.168.2.15/store1_94/FaceWareHouse/src_0_24/20180104/20180104T174620_17550_23620.jpg"
    var imgdiv = (this._imgdiv = document.createElement('div'));
    imgdiv.className = 'faceBoxInMap dn';
    if (this._selected == true) {
      imgdiv.className = 'faceBoxInMap active dn';
    } else {
      imgdiv.className = 'faceBoxInMap dn';
    }
    imgdiv.id = 'faceCameraBox-' + obj.point.id;
    var imgDom = (this._imgDom = document.createElement('img'));
    imgDom.className = 'faceImgBoxInMap'; // + obj.isSearchState ? '' : 'dn';
    imgDom.id = 'faceImgCameraBox-' + obj.point.id;
    imgDom.src = '';
    var arrow = (this._arrow = document.createElement('span'));
    arrow.className = 'faceBoxInMap-sjx';
    imgdiv.appendChild(arrow);
    var countNum = (this._countNum = document.createElement('span'));
    countNum.className = 'faceBoxInMap-count';
    countNum.id = 'faceBoxInMap-count-' + obj.point.id;
    imgdiv.appendChild(countNum);
    imgdiv.appendChild(imgDom);
    div.appendChild(imgdiv);

    // 添加摄像头背景
    if (!obj.isSearchState) {
      var cameradiv = (this._cameradiv = document.createElement('div'));
      if (this._selected == true) {
        if (this._isAreaA && this._isAreaB) {
          cameradiv.className = 'camerabg-inmap active';
        } else if (this._isAreaA && !this._isAreaB) {
          cameradiv.className = 'camerabg-inmap activeA';
        } else if (!this._isAreaA && this._isAreaB) {
          cameradiv.className = 'camerabg-inmap activeB';
        } else {
          cameradiv.className = 'camerabg-inmap selected';
        }
      } else {
        cameradiv.className = 'camerabg-inmap';
      }

      div.appendChild(cameradiv);
    }

    var span = (this._span = document.createElement('span'));
    obj.showCount && div.appendChild(span);
    span.className = 'cameratext-inmap';
    span.appendChild(document.createTextNode(this._text));
    div.onclick = e => {
      e.stopPropagation();
      obj.mouseClick(obj.point);
    };
    div.onmouseenter = e => {
      e.stopPropagation();
      obj.mouseEnter(obj.point, e);
    };
    // div.onmouseleave = () => {
    // };
    map.getPanes().labelPane.appendChild(div);
    return div;
  };

  ComplexCustomOverlay.prototype.draw = function() {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - 14 + 'px';
    this._div.style.top = pixel.y - 14 + 'px';
  };

  var myCompOverlay = new ComplexCustomOverlay(obj.point, obj.text);
  obj.map.addOverlay(myCompOverlay);

  return { containerdiv: self._div, cameradiv: self._cameradiv };
}
