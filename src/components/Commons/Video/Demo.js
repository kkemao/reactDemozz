import React, { Component } from 'react';
import request from '../../utils/request';
import { api } from '../../constants/Api';
import cache from '../../utils/cache';
let cameraId = 1;
export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: ''
    };
  }

  componentWillMount() {
    // then later..
    this.getData();
  }
  getData = () => {
    cache
      .get('forefather', cameraId)
      .then(res => {
        console.log('res', res);
        let placeName = '';
        res.map(function(data) {
          if (data.nodeType !== 'camera') {
            placeName = data[data.nodeType + 'Name'] + '      ' + placeName;
          } else {
            placeName = data['name'] + '      ' + placeName;
          }
        });
        this.setState({
          result: placeName
        });
      })
      .catch(e => {
        console.error(e);
      });
    cameraId++;
  };
  render() {
    const { result } = this.state;
    return (
      <div>
        {result}
        <button onClick={this.getData}>确认</button>
      </div>
    );
  }
}
