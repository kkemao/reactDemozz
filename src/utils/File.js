export default class File {
  static download(url, customFileName) {
    let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    let isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
      alert(
        'Your device does not support files downloading. Please try again in desktop browser.'
      );
      return false;
    }

    //If in Chrome or Safari - download via virtual link click
    if (isChrome || isSafari) {
      //Creating new link node.
      var link = document.createElement('a');
      link.href = url;

      if (link.download !== undefined) {
        //Set HTML5 download attribute. This will prevent file from opening if supported.
        var fileName =
          customFileName || url.substring(url.lastIndexOf('/') + 1, url.length);
        link.download = fileName;
      }

      //Dispatching click event.
      if (document.createEvent) {
        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        link.dispatchEvent(e);
        return true;
      }
    }

    // Force file download (whether supported by server).
    if (url.indexOf('?') == -1) {
      url += '?download';
    }

    window.open(url, '_self');
    return true;
  }
  static getHumanFileSize(size) {
    let i = Math.floor(Math.log(size) / Math.log(1024));
    return (
      (size / Math.pow(1024, i)).toFixed(2) * 1 +
      ' ' +
      ['B', 'KB', 'MB', 'GB', 'TB'][i]
    );
  }
}
