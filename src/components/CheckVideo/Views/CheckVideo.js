import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Row, Col, Icon } from 'antd';

import CameraVideo from './CameraVideo';
import './CheckVideo.less';
import { captureImage } from '../../../utils/global';

const testUrlObj={
    rtspuri:'rtmp://192.168.2.150:5119/live/ShangbuSouth',
    id:1
}
class CheckVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hideNotice: true,
            checkImgs:[]
        };
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.cropArr != this.props.cropArr){
            let checkImgs=this.state.checkImgs;
            let temArr=[{src:nextProps.cropArr,id:checkImgs.length}];
            this.setState({
                checkImgs:checkImgs.concat(temArr)
            })
        }
    }
    cropVideoImg=()=>{
        let thisVideo = document.getElementById('videoMP4');
        // let thisVideo = document.getElementById('videoRtmp');
        // console.log('zml 截图',thisVideo.offsetHeight,thisVideo.offsetWidth);
        this.props.cropImg(thisVideo);
    }
    removeCropImg=(ind)=>{
        let checkImgs=this.state.checkImgs;
        checkImgs.forEach((item,i)=>{
            if(item.id==ind){
                let temArr=checkImgs;
                temArr.splice(i,1);
                this.setState({checkImgs:temArr})
            }
        })
    }
    render(){
        const{ showCheckVideo, cameraInfo } = this.props;
        const{checkImgs}=this.state;
        let imgArr=[];
        checkImgs.forEach((element,i) => {
            imgArr.push(
                <div key={element.id} className="check-imgs-list">
                    <img src={element.src} />
                    <span className="check-del" onClick={this.removeCropImg.bind(this,element.id)}></span>
                </div>
            );
        });
        return(
            <div className="check-video">
                <Row>
                    <div className="check-header">
                        <h5 className="check-cam-name">{cameraInfo[0].name} <Icon className="close-icon" type="close-circle-o" onClick={showCheckVideo.bind(this,false)}/></h5>
                        <div className="check-cam-num">
                            <span className="cam-name">编号：xxx</span>
                            <span>两日内抓拍：xxxx 张</span>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div className="check-content">
                        <Col span={14}>
                            <div className="check-rtmp">
                                {/* <CameraVideo
                                    id="videoMP4"
                                    camerasData={cameraInfo}
                                />  */}
                                <video id="videoMP4" width="100%" height="100%" loop="loop" autoPlay="autoPlay" src='./chdshow.mp4'>
                                    Your browser does not support the video tag.
                                </video>
                                <div className="check-crop" onClick={this.cropVideoImg}>截图</div>
                            </div>
                        </Col>
                        <Col span={10}>
                            <div className="check-imgs">
                                <div className="check-imgs-head">
                                    <span>视频截图</span>
                                    <span className={checkImgs.length?"check-export check-active":"check-export"}>导出所有</span>
                                </div>
                                <div className="check-imgs-content">
                                    {imgArr}
                                </div>
                            </div>
                        </Col>
                    </div>
                </Row>
                
            </div>
        )
    }
}

export default CheckVideo;