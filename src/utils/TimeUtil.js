export default class TimeUtil {
  static timeLeaveNow(timeStamp) {
    var now = new Date().getTime();
    var timeLeaveNow = now - timeStamp;
    var returnText = '';
    if (timeLeaveNow > 1000 * 60 * 60 * 24 * 31) {
      returnText =
        Math.floor(timeLeaveNow / (1000 * 60 * 60 * 24 * 31)) + '个月';
    } else if (timeLeaveNow > 1000 * 60 * 60 * 24 * 7) {
      returnText = Math.floor(timeLeaveNow / (1000 * 60 * 60 * 24 * 7)) + '周';
    } else if (timeLeaveNow > 1000 * 60 * 60 * 24) {
      returnText = Math.floor(timeLeaveNow / (1000 * 60 * 60 * 24)) + '天';
    } else if (timeLeaveNow > 1000 * 60 * 60) {
      returnText = Math.floor(timeLeaveNow / (1000 * 60 * 60)) + '小时';
    } else if (timeLeaveNow > 1000 * 60) {
      returnText = Math.floor(timeLeaveNow / (1000 * 60)) + '分钟';
    } else if (timeLeaveNow > 30000) {
      returnText = '1分钟';
    } else {
      returnText = '0分钟';
    }
    return returnText;
  }
}
