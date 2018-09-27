// 复杂的自定义覆盖物
/**
 *
 * @param {*} obj
 * @param BMap,百度地图的BMap对象
 * @param map,百度地图的map对象
 * @param point,百度地图的point对象
 * @param text,要传入显示的文本
 */
export default function addCameraListBox(obj) {
  var cameraListClose;
  function ComplexCustomOverlay(point, text) {
    this._point = new obj.BMap.Point(point['lng'], point['lat']);
    cameraListClose = this.removeCameraListBox = function(e) {
        e && e.stopPropagation();
        var elements = document.getElementsByClassName('camera-list-box');
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
        obj.onChangeCameraFilterFromMap([]);      //取消传入的camera值
       
        let allPointsArr = obj.allPoints;
        for (let i in allPointsArr) {
            if (allPointsArr[i]['cameraBgDom']) {
                allPointsArr[i]['selected'] == false
                allPointsArr[i]['cameraBgDom'].className = 'camerabg-inmap';
            }
        }

    };

    // 加载组件时检测是否已经存在。
    this.removeCameraListBox();
  }

  ComplexCustomOverlay.prototype = new obj.BMap.Overlay();
  ComplexCustomOverlay.prototype.initialize = function(map) {
    this._map = map;

    var div = (this._div = document.createElement('div'));
    div.className = 'camera-list-box';
    var tempLi = '';
    var opl = obj.pointList.length;
    for (var i = 0; i < opl; i++) {
      var countSpan = '';
      if (obj.pointList[i].searchResult > 0 && obj.isSearchState) {
        countSpan =
          '<span class="listbox-cameracount">' +
          obj.pointList[i].searchResult +
          '</span>';
      }
      tempLi +=
        "<li class='listbox-li'>" +
        "  <h5 class='listbox-h5'><span class='listbox-camerabg' type='photo' index='" +
        i +
        "'></span><span class='listbox-cameraname' type='name' index='" +
        i +
        "' title='" +
        obj.pointList[i].name +
        "'>" +
        obj.pointList[i].name +
        '</span>' +
        countSpan +
        '</h5>' +
        '</li>';
    }
    // div.style.zIndex = obj.BMap.Overlay.getZIndex(this._point.lat);
    var span = (this._span = document.createElement('span'));
    span.className = 'listbox-close';
    span.title = '点击关闭';
    span.onclick = this.removeCameraListBox;
    div.appendChild(span);

    var title_h5 = (this._title_h5 = document.createElement('h5'));
    title_h5.innerHTML = '请选择';
    title_h5.className = 'camera-box-title';
    div.appendChild(title_h5);

    var ul = (this._ul = document.createElement('ul'));
    ul.className = 'listbox-ul';
    ul.innerHTML = tempLi;
    div.appendChild(ul);
    var arrow = (this._arrow = document.createElement('span'));
    arrow.className = 'listbox-sjx';
    div.appendChild(arrow);
    // div.onclick = () => {
    //   obj.mouseClick(this._point);
    // };
    ul.onmousewheel = function(e) {
      e.stopPropagation();
    };
    ul.onclick = function(e) {
      e.stopPropagation();
      // 监听回调函数传值
      if (
        e.target.className == 'listbox-camerabg' ||
        e.target.className == 'listbox-cameraname'
      ) {
        obj.cb({
          type: e.target.getAttribute('type'),
          point: obj.pointList[e.target.getAttribute('index')]
        });
      }
    };
    div.onmouseenter = e => {
      e.preventDefault();
      e.stopPropagation();
    };
    // div.onmouseleave = () => {
    //   obj.mouseLeave(this._point);
    // };
    map.getPanes().labelPane.appendChild(div);
    return div;
  };

  ComplexCustomOverlay.prototype.draw = function() {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - 140 + 'px';
    this._div.style.top = pixel.y - 215 + 'px';
  };
  var myCompOverlay = new ComplexCustomOverlay(obj.point, obj.text);
  obj.map.addOverlay(myCompOverlay);
  return cameraListClose;
}
