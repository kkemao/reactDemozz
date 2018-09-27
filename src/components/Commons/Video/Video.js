import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import ReactSWF from './ReactSWF.js';
import request from '../../../utils/request';
import {
  streamMediaConfig,
  faceRectConfig,
  hasStreamService
} from '../../../utils/config';
import { api } from '../../../constants/Api';
import swf_file from './player-quick.swf';
import './Video.less';

const { mediaType, playStartGap, playEndGap } = streamMediaConfig;

const defaultProps = {
  cameraId: null,
  id: 'rtmp'
};

class Video extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    noVideo: false,
    loaded: false,
    cameraId: null,
    rtmpurl: '',
    width: '100%',
    height: '100%',
    rtmpurlReplacer: '' 
  };
  componentWillMount() {
    this.props.onLoad && this.props.onLoad();
    this.getData();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.state, nextState);
  }

  componentWillUnmount() {}

  getData = () => {
    const { rtmpurl, cameraId, dingDian } = this.props;
    console.log('zml hasStreamService', hasStreamService);
    console.log('zml---rtmpurl', rtmpurl);
    if (hasStreamService) {
        if (cameraId) {
            return request({
                url: api.streamMediaInfo,
                method: 'get',
                data: {
                    urlParams: {
                    id: cameraId
                    }
                }
            }).then(res => {
            if (res && res.errCode == 0) {
                let data = null;
                try {
                data = JSON.parse(res.data);
                console.log('视频地址---', data);
                if (data.errorCode == 0) {
                    this.setState({
                    loaded: true,
                    rtmpurl: data.url
                    });
                } else {
                    this.setState({
                    loaded: true,
                    noVideo: true
                    });
                    console.error('Video 组件，流媒体服务器返回异常', res.data);
                }
                } catch (e) {
                this.setState({
                    loaded: true,
                    noVideo: true
                });
                console.error('Video 组件，解析JSON异常', res.data);
                }
            } else {
                this.setState({
                    loaded: true,
                    noVideo: true
                });
            }
            });
        } else {
            this.setState({
                loaded: true,
                noVideo: true
            });
        }
    } else {
        if (rtmpurl) {
            this.setState({
                rtmpurl: rtmpurl,
                loaded: true
            });
        } else {
            this.setState({
                loaded: true,
                noVideo: true
            });
        }
    }
  };
  render() {
    const { cameraId, id, allowFullScreen, ...other } = this.props;
    const {
      rtmpurl,
      width,
      height,
      loaded,
      noVideo,
      rtmpurlReplacer
    } = this.state;
    let content = '';
    if (loaded && !noVideo) {
      content = (
        <ReactSWF
            src={swf_file}
            id={id}
            width={width}
            height={height}
            wmode="transparent"
            bgcolor="transparent"
            allowFullScreen={allowFullScreen}
            allowScriptAccess="sameDomain"
            flashVars={{
                playerID: id,
                rtmp: rtmpurl || rtmpurlReplacer,
                autoplay: true,
                showErrorInPlayer: false,
                showMetadata: false,
                showLiveCaption: false,
                livelabelshowbg: false
            }}
            {...other}
        />
      );
    } else if (loaded && noVideo) {
      content = <div className="no-video wp">无视频</div>;
    } else if (!loaded && !noVideo) {
      content = <div className="no-video wp">加载中...</div>;
    }

    return content;
  }
}

Video.defaultProps = defaultProps;

export default Video;
