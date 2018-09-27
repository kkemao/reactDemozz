import PropTypes from 'prop-types';
import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import CountDownLogoutWorker from '../../../utils/CountDownLogoutWorker';
import request from '../../../utils/request';
import { api } from '../../../constants/Api';

import ErrorBoundary from '../../Error/ErrorBoundary';
import Header from '../../Commons/Header/Header';
import HomePageMenu from './HomePageMenu';
import HomePageRight from './HomePageRight';
import HomeAlarm from './HomeAlarm';

import PrincipalPageContainer from '../../PrincipalPage/PrincipalPageContainer.js';
import FileStoreContainer from '../../FileStore/FileStoreContainer';
import CheckVideoContainer from '../../CheckVideo/CheckVideoContainer';
import ReviewPictureContainer from '../../ReviewPicture/ReviewPictureContainer';
import ShootingRecordContainer from '../../ShootingRecord/ShootingRecordContainer';
import ExportDataContainer from '../../ExportData/ExportDataContainer';
import UserSetting from '../../UserSetting/OutputModule';

import EchartLine from '../../Commons/EchartLine';
import MapContainer from '../../Commons/Map/MapContainer';
import BigPicture from '../../Commons/BigPicture';
import { captureImage } from '../../../utils/global';

import '../../../styles/animate.css';
import {
    HomePage,
    ShootingRecord,
    FileStore,
    ReviewPicture,
    ExportData
  } from '../../../utils/config';
import './HomePage.less';

// 引入mqtt
import MqttClient from '../../../constants/mqttAlarm';



class HomePageContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: 1,
            topScale:100,        //top5的横条倍数
            mqttClient: null,
            alarmEvents:[],
            activeMenuTab:'HomePage',
            showVideo:false,         //查看视频
            showModule:'HomePage',
            showUserSetting:false,  //用户和设置是否显示
            userModule:null,    //用户和设置当前要显示的模块
            reviewIndex:{       //zml 模拟记录当前操作的抓拍审阅索引
                car:0,
                person:0
            },
            recordToReviewActNow:'car',      //拍摄记录跳往抓拍审阅时的选项 car或者person
            showAlarm:false,     //告警弹窗
            cropArr:'',     //视频截图的
            activeUnckecked:false,
            showBigImgs:false,       //是否显示大图
            bigSrc:''
        }
    }
    componentWillMount() {
        // const { initAuth, logout } = this.props;
        // CountDownLogoutWorker.start(this.props);
        // initAuth(this.props);   //ZML模拟8月8日输出demo不需要登录
        // this.getTopFive();
    }
    componentDidMount() {
        this.resizeFun();
        window.addEventListener('resize', this.resizeFun);
        //连接mqtt 
        // var client = MqttClient.connect();
        // this.setState({
        //     mqttClient: client
        // });
        // MqttClient.listen(client, res => {
        //     console.log('zml mqtt消息', res);
        //     this.openNotification(res);
        // });
        //ZMLTODO 模拟 top5第一个数量
        let mockNum=103; 
        let num = 1;
        this.recTopOne(mockNum,num);
        //zml 模拟mqtt
        setTimeout(this.mqttTest, 1000);    //模拟mqtt
        setTimeout(this.mqttTest1, 4000);    //模拟mqtt
        setTimeout(this.mqttTest2, 8000);    //模拟mqtt
        setTimeout(this.mqttTest3, 9000);    //模拟mqtt
    }
    //模拟mqtt数据
    mqttTest = () => {
        let timestamp = (new Date()).getTime();
        this.openNotification({
            id:'0',
            Time:timestamp,
            imgUrl:'/fakeData/9-1.jpg',
            imgUrlBack:'/fakeData/9-2.jpg',
            card:'粤A152435',
            type:'车辆违法',
            location:'向阳路口',threshold:'0.83',personUrl:'/mockdata/zhuapai/h002.jpg',simUrl:"/mockdata/zhuapai/h003.jpg"
        });
    }
    mqttTest1 = () => {
        let timestamp = (new Date()).getTime();
        this.openNotification({id:'1',Time:timestamp, imgUrl:'/fakeData/10-1.jpg',imgUrlBack:'/fakeData/10-2.jpg',card:'粤C152435',type:'车辆违法',location:'三叉路口-东出口',threshold:'0.92',personUrl:'/mockdata/zhuapai/h002.jpg',simUrl:"/mockdata/zhuapai/h003.jpg"});
    }
    mqttTest2 = () => {
        let timestamp = (new Date()).getTime();
        this.openNotification({id:'2',Time:timestamp, imgUrl:'/fakeData/13-1.jpg',imgUrlBack:'/fakeData/13-2.jpg',card:'海C152435',type:'车辆违法',location:'胜利东路路口',threshold:'0.94',personUrl:'/mockdata/zhuapai/h005.jpg',simUrl:"/mockdata/zhuapai/h004.jpg"});
    }
    mqttTest3 = () => {
        let timestamp = (new Date()).getTime();
        this.openNotification({id:'3',Time:timestamp, imgUrl:'/fakeData/1-1.jpg',imgUrlBack:'/fakeData/1-2.jpg',card:'粤C152435',type:'车辆违法',location:'茂业百货西出口',threshold:'0.92',personUrl:'/mockdata/zhuapai/houxuan7.jpg',simUrl:"/mockdata/zhuapai/houxuan6.jpg"});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeFun);
      }
    resizeFun = () => {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        // 计算适配问题
        var scale = 1;
        if (windowHeight > windowWidth * 1080 / 1920) {
            scale = windowWidth / 1920;
        } else {
            scale = windowHeight / 1080;
        }
        var top = (windowHeight - 1080) / 2;
        var left = (windowWidth - 1920) / 2;
        this.setState({
            top: top,
            left: left,
            scale: scale
        });
    };
    //mqtt
    openNotification = res => {
        if (res.PersonId <= 0) return;
        // 获取告警详情
        this.alarmRes(res);
    };
    alarmRes = data => {
        this.setState({
            alarmEvents: [data].concat(this.state.alarmEvents),
            showAlarm:true
        },()=>{
            this.state.showAlarm && setTimeout(()=>{
                this.setState({showAlarm:false}); 
            },2000)
        });
        //ZMLTODO查询接口
    };
    //告警弹窗
    alarmDivStatus=(boolean)=>{
        this.setState({ showAlarm:boolean });
    }
    //左侧top5
    recTopOne = (mockNum,num)=>{
        let mockCeil=mockNum/10;
        if(mockCeil<1){
            this.setState({
                topScale:Math.ceil(mockCeil)*Math.pow(10,num-1)+Math.pow(10,num-1)
            })
        }else{
            num++;
            this.recTopOne(mockCeil,num);
        }
    }
    getTopFive = ()=>{
        request({
            url: api.getTopFiveData,
            method: 'get'
        }).then(res => {
            console.log('zml 模拟数据',res);
            if (res && res.errCode == 0) {

            }else {
            }
            
        });
    }
    //左侧菜单change
    changeRoute = (url,activeBtn)=>{
        let exportStatus = this.state.showExport;
        const{cameraInfo, onChangeCameraFilterFromMap} = this.props;
        if(cameraInfo.length){
            this.setState({showVideo:false},()=>{
                onChangeCameraFilterFromMap([]);
            });
        }
        if(url == 'ExportData') {
            this.setState({
                activeMenuTab:url
            });
        }else{
            if(activeBtn){
                console.log('zml activeBtn',activeBtn);
            }
            this.setState({
                showModule:url,
                activeMenuTab:url,
                recordToReviewActNow:activeBtn||'car',
                activeUnckecked:false
            });
            
        };
    }
    JumpReviewPic = ()=>{
        this.setState({activeMenuTab:'ShootingRecord',showModule:'ShootingRecord',activeUnckecked:true})
    }
    //查看视频隐显 
    showCheckVideo = (boolean)=>{
        this.setState({showVideo:boolean});
    }
    //数据导出隐藏
    showExportModule = ()=>{
        this.setState({
            activeMenuTab:this.state.showModule
        });
    }
    //查看视频隐显
    changeSettingStatus = (boolean,data)=>{
        setTimeout(()=>{
            this.setState({
                showUserSetting:boolean,
                userModule:data
            });
        },300)
    }
    //视频截图--ZML模拟
    cropImg=(thisVideo)=>{
        let cropSrc = captureImage(thisVideo,1);
        this.setState({
            cropArr: cropSrc.src
        });
        //videoMP4
        // console.log('zml 截图实验',html2canvas);
        // html2canvas(document.querySelector("#cameraVideo")).then(canvas => {
        //     document.body.appendChild(canvas);
        //     let dataUrl = canvas.toDataURL();
        //     console.log('zml 截图后的canvas',canvas,dataUrl);
        //     this.setState({
        //         cropArr: dataUrl
        //     });
        // })
       
    }
    //zml模拟后台改变抓拍审阅的索引
    changereviewIndex =(data,len)=>{
        let reviewIndex = this.state.reviewIndex;
        let newIndex = data =='car'?reviewIndex.car+1:reviewIndex.person+1;
        if(newIndex >= len) newIndex = 0;
        this.setState({
            reviewIndex:{
                car: data =='car'?newIndex:reviewIndex.car,
                person: data =='person'?newIndex:reviewIndex.person
            }
        })
    }
    //查看大图
    showBigPicture=(boolean,src)=>{
        console.log('zml 查看大图',boolean,src);
        this.setState({
            showBigImgs:boolean,
            bigSrc:src
        })
        console.log(this.state.bigSrc,'|||')
    }

    render() {
        const { top, left, scale,showModule , activeMenuTab, showVideo, showUserSetting, userModule, reviewIndex, recordToReviewActNow, alarmEvents, showAlarm, activeUnckecked, showBigImgs,bigSrc} = this.state;
        const { history,logout, cameraInfo} = this.props;
        const objStyle = {
            top: top,
            left: left,
            transform: `scale(${scale})`
        }
        var alarmArr = [];
        alarmEvents.forEach((item, i) => {
            alarmArr.push(
                <div className="inner-right-li moveDown" key={item.id}>
                    <HomePageRight
                        alarmRes={item}
                        showBigPicture={this.showBigPicture}
                    />
                </div>
            );
        });
        return(
            <ErrorBoundary>
                <div id="homePage_Wrap">
                    <div className="home-page pr ofh" style={objStyle}>
                        <Header
                            changeSettingStatus={this.changeSettingStatus} 
                            logout={logout} 
                            history={history}
                            showUserSetting={showUserSetting}
                        />
                        <div className="main-content">
                            <div className="inner-left">
                                <HomePageMenu
                                    history={history}
                                    menuObj={{
                                        HomePage,
                                        ShootingRecord,
                                        ReviewPicture,
                                        FileStore,
                                        ExportData
                                    }}
                                    activeMenuTab={activeMenuTab}
                                    changeRoute={this.changeRoute}
                                />
                                <div className="inner-left-bot">
                                    <div className="tops-div">
                                        <div className="tops">TOP5</div>
                                        <ul className="top-ul">
                                            <li className="top-list">
                                                <span className="top-name">劳动街路</span>
                                                <p className="top-line">
                                                    <span className="top-line-span" style={{width:'85%'}}></span>
                                                    <span className="top-count">667</span>
                                                </p>
                                            </li>
                                            <li className="top-list">
                                                <span className="top-name">解放南路</span>
                                                <p className="top-line">
                                                    <span className="top-line-span" style={{width:'70%'}}></span>
                                                    <span className="top-count">605</span>
                                                </p>
                                            </li>
                                            <li className="top-list">
                                                <span className="top-name">城西路</span>
                                                <p className="top-line">
                                                    <span className="top-line-span"></span>
                                                    <span className="top-count">500</span>
                                                </p>
                                            </li>
                                            <li className="top-list">
                                                <span className="top-name">向阳路</span>
                                                <p className="top-line">
                                                    <span className="top-line-span"></span>
                                                    <span className="top-count">500</span>
                                                </p>
                                            </li>
                                            <li className="top-list">
                                                <span className="top-name">前进二路</span>
                                                <p className="top-line">
                                                    <span className="top-line-span"></span>
                                                    <span className="top-count">500</span>
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {showModule == 'HomePage' && (
                                <div className="inner-center">
                                    <PrincipalPageContainer
                                        cameraInfo={cameraInfo}
                                        showCheckVideo={this.showCheckVideo}
                                    />
                                </div>
                            )}
                            {showModule == 'FileStore' && (
                                <div className="inner-center-file">
                                    <FileStoreContainer/>
                                </div>
                            )}

                            {showModule == 'HomePage' && showAlarm && <HomeAlarm
                                data={alarmEvents[0]}
                            />}
                          
                            {showModule != 'ReviewPicture' && showModule != 'ShootingRecord' && (
                                <div className="inner-right">
                                    <div className='right-div'>
                                        <div className='right-lists'>
                                            {alarmArr}
                                            {/* <HomePageRight/> */}
                                        </div>
                                        <div className='item-showmore'
                                            onClick={this.JumpReviewPic}
                                        >
                                            查看更多
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showModule == 'ReviewPicture' && (
                                <ReviewPictureContainer 
                                    reviewIndex={reviewIndex}
                                    changeRoute={this.changeRoute}
                                    changereviewIndex={this.changereviewIndex}  //zml模拟改变
                                    recordToReviewActNow={recordToReviewActNow}
                                />
                            )}
                            {showModule == 'ShootingRecord' && (
                                <ShootingRecordContainer
                                    changeRoute={this.changeRoute}
                                    activeUnckecked={activeUnckecked}
                                />
                            )}
                            {showModule == 'HomePage' && showVideo && (
                                <CheckVideoContainer
                                    showCheckVideo={this.showCheckVideo}
                                    cropImg={this.cropImg}
                                    cropArr={this.state.cropArr}

                                />
                            )}
                            {activeMenuTab == 'ExportData' && (
                                <ExportDataContainer
                                    showExportModule={this.showExportModule}
                                />
                            )}
                            {showUserSetting && (
                                <UserSetting
                                    changeSettingStatus={this.changeSettingStatus}
                                    userModule={userModule}
                                />
                            )}
                           
                        </div>
                    </div>
                </div>
                { showBigImgs && (
                    <BigPicture
                        showBigPicture={this.showBigPicture} 
                        bigSrc={bigSrc}
                    />
                )} 
            </ErrorBoundary>
        )
    }
}

export default HomePageContainer;