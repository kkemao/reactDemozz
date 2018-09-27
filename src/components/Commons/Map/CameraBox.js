import React, { Component } from 'react';
import './Map.css';
class CameraBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      points: this.props.points,
      activeH5:-1
    };
  }
  componentWillReceiveProps() {
    // console.log('123123123');
  }
  uploadFun = () => {
    const { changeTipModalState, ids } = this.props;
    console.log('changeTipModalState', this.props);
    if (ids && ids.indexOf(',') !== -1 && ids.split(',').length >= 5) {
      changeTipModalState({ visible: true, msg: '最多支持5张图片同时比对' });
    } else {
      document.getElementById('uploadFile').click();
    }
  };
  removeFun(index) {
    let points = this.state.points;
    if (index == -1) {
      for (let i in points) {
        points[i].selected = false;
      }
    } else {
      points[index].selected = false;
    }
    this.setState({
      points: points
    });

    // 执行父组件方法并且传入参数
    this.props.changeFun(this.state.points, index);
  }
  //ZML 选中摄像头
  choosenCam (index) {
        let points = this.state.points;
        console.log('zml 点击摄像头',points[index]);
        this.setState({
            activeH5:index
        });
        this.props.choosenSinglePoint(index);
  }
  //  onClick = {this.removeFun.bind(this, i)}
  render() {
    var liTemp = [];
    var length = 0;
    const { activeH5 } = this.state;
    // for (var i in this.props.points) {
    this.props.points.forEach((d, i) => {
      d['selected'] &&
        liTemp.push(
          <li key={i}>
            <h5 className={activeH5 ==i?"camera-box-h5 active-h5":"camera-box-h5"}>
              <span className="" />
              <span className="camera-box-name" title={d['name']} onClick={this.choosenCam.bind(this, i)}>
                {d['name']}
              </span>
              <span
                className="camera-box-li-close"
                onClick={this.removeFun.bind(this, i)}
                title="点击取消选中"
              />
            </h5>
          </li>
        ) &&
        length++;
    });
    return (
      <div className="camera-box leftIn-on">
        <h5 className="camera-box-title">选中{length}个摄像头</h5>
        <ul className="camera-box-ul">{liTemp}</ul>
        <h5 className="btn-box-h5">
          <span
            className="span-half-btn cancel"
            onClick={this.removeFun.bind(this, -1)}
          >
            取消
          </span>
          {/* <span className="span-half-btn confirm" onClick={this.uploadFun}>
            传图检索
          </span> */}
        </h5>
      </div>
    );
  }
}
export default CameraBox;
