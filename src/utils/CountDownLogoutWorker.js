import { hasCountDownLogout, countDownLogoutTime } from './config';
import $ from 'jquery';

const workerUrl = `${process.env.PUBLIC_URL}/countDownShareWorker.js`;

let countDownWorker = null;
let hasSendToCountDownWorker = false;
let start = false;
let recountTimeout;

export default class CountDownLogoutWorker {
  static start(props) {
    const { logout } = props;
    if (start == true) return;
    start = true;
    if (!!window.SharedWorker && hasCountDownLogout) {
      if (!countDownWorker) countDownWorker = new SharedWorker(workerUrl);
      this.listenPage();
      countDownWorker.port.onmessage = function(e) {
        console.log(
          'Message received from worker',
          e.data,
          new Date().getTime()
        );
        if (e.data == 'timeout' && hasCountDownLogout) {
          logout({
            ...props,
            logoutTxt: '超过30分钟未操作,您已自动退出! '
          });
          start = false;
          countDownWorker = null;
          hasSendToCountDownWorker = false;
          $('body').unbind('click', this.listenPage);
          clearTimeout(recountTimeout);
        }
      };
      $('body').unbind('click', this.listenPage);
      $('body').bind('click', this.listenPage);
    }
  }

  static listenPage() {
    if (hasSendToCountDownWorker !== true) {
      console.log('recount countDownWorker');
      countDownWorker.port.postMessage(countDownLogoutTime);
      hasSendToCountDownWorker = true;
      clearTimeout(recountTimeout);
      recountTimeout = setTimeout(function() {
        hasSendToCountDownWorker = false;
      }, 10000);
    }
  }
}
