import { centerProxyServerPrefix, IPMapList } from './config';

const PicTypes = ['jpg', 'png', 'jpeg'];

export default class Url {
  static restore(url) {
    if (String(url).indexOf('http://') == -1) {
      url = centerProxyServerPrefix + url;
    }
    return url;
  }
  static restoreAll(str) {
    return String(str)
      .split('"')
      .map(function(data) {
        if (data) {
          var lastPointIndex = data.lastIndexOf('.');

          if (lastPointIndex > -1 && data.indexOf('http://') == -1) {
            var type = data.slice(lastPointIndex + 1).toLowerCase();

            if (PicTypes.indexOf(type) !== -1) {
              // console.log('fileType', type);
              data =
                data.slice(1) == '/'
                  ? centerProxyServerPrefix + data
                  : centerProxyServerPrefix + '/' + data;
            }
          }
        }

        // data = this.MapIP(data);

        return data;
      })
      .join('"');
  }
  static MapIP(str) {
    if (IPMapList && Object.keys(IPMapList).length > 0) {
      Object.keys(IPMapList).forEach(function(key) {
        if (str.indexOf(key) !== -1) {
          str = str.replace(new RegExp(key, 'gm'), IPMapList[key]);
        }
      });
    }
    return str;
  }
}
