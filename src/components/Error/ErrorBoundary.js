import React, { Component } from 'react';
import { Button } from 'antd';

import './ErrorBoundary.less';
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log error messages to an error reporting service here
  }

  onGoBack = () => {
    // const { history } = this.props;
    // history.replace({
    //   pathname: '/'
    // });
    window.location.reload();
  };

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div id="error-boundary">
          <div className="error-content">
            <div className="error-content-title">
              <span> 出错了!</span>
            </div>
            <p style={{ marginBottom: 15 }}>页面错误,请截图告知管理员!</p>
            <details style={{ whiteSpace: 'pre-wrap', overflow: 'hidden' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          </div>
          <div className="error-handle">
            <Button
              size="large"
              className="error-handle-button"
              onClick={this.onGoBack}
            >
              返回首页
            </Button>
          </div>
          <footer className="error-copyright">
            <p>©2018 intellifusion 立足AI，助力安全与智慧生活</p>
          </footer>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
