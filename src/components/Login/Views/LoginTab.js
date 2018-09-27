import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Row, Col } from 'antd';

const propTypes = {
  loginType: PropTypes.string.isRequired
};

class LoginTab extends Component {
  handleClick = () => {
    const { loginType, changeLoginType } = this.props;
    let type = loginType == 'form' ? 'qrcode' : 'form';
    changeLoginType(type);
  };

  render() {
    const { loginType } = this.props;
    return (
      <Row type="flex" justify="center">
        <Col span={12} id="login_tab" onClick={this.handleClick}>
          {loginType == 'form' ? '【扫描二维码登录】' : '【用户名密码登录】'}
        </Col>
      </Row>
    );
  }
}

LoginTab.propTypes = propTypes;

export default LoginTab;
