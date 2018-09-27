// import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import { Form, Icon, Input, Button, Checkbox, Row, Col } from 'antd';
import { api } from '../../constants/Api';
import request from '../../utils/request';
import { proxyLoginServerPrefix } from '../../utils/config';

import icon_qrcode from '../../asset/icon/qrcode.png';

const defaultProps = {};

const propTypes = {};
// 随机生成数字字符编码
function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
    ''
  );
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

class QrCode extends Component {
  state = {
    count: 30
  };
  componentWillMount() {
    this.countDown();
  }
  countDown = () => {
    this.timer = setInterval(
      function() {
        let currentCount = this.state.count;
        currentCount -= 1;
        if (currentCount < 0) {
          this.setState({ count: 30 });
        } else {
          this.setState({ count: currentCount });
        }
      }.bind(this),
      1000
    );
  };
  autoLogin = () => {};
  render() {
    return (
      <div className="login_qrcode">
        <div className="login_qrcode_img_wrap">
          <img className="login_qrcode_img" src={icon_qrcode} alt="qrcode" />
        </div>
        <div className="login_qrcode_time">{this.state.count}s</div>
      </div>
    );
  }
}

QrCode.defaultProps = defaultProps;
QrCode.propTypes = propTypes;

export default QrCode;
