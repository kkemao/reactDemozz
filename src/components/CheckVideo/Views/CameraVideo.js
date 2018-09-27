import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Video from '../../Commons/Video/Video';
import { Icon } from 'antd';

class CameraVideo extends Component {
    render() {
        const { camerasData, clickToHideVideo }=this.props;
        return(
            <div id="cameraVideo">
                <div className="video_bottom">
                    {JSON.stringify(this.props.taskDetail) != '{}'? (
                        <Video
                            rtmpurl={camerasData[0].rtspuri || ''}
                            id={camerasData[0].id}
                            cameraId={camerasData[0].id}
                            allowFullScreen
                        /> 
                    ):(
                        <h5
                            style={{
                                color: '#979797',
                                textAlign: 'center',
                                position: 'absolute',
                                width: '100%',
                                top: '45%'
                            }}
                            >
                            未配置摄像头
                        </h5>
                    )}
                </div>
            </div>
        )
    }
}

export default CameraVideo;

