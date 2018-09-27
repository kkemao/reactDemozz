import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import { Checkbox } from 'antd';

import ErrorBoundary from '../../Error/ErrorBoundary';

import EchartLine from '../../Commons/EchartLine';
import MapContainer from '../../Commons/Map/MapContainer';
import mapToechartMock from '../Mock/mapToechart';   //ZML模拟点击点位时间折线图

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['车辆违法', '行人闯红灯'];
class PrincipalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataOptions: {
                grid:{
                    top: '3%',
                    left: '0%',
                    right: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis', 
                    padding: [-10,-20,-10,-25], 
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    data:[],
                    axisLine:{
                        show:true,
                        lineStyle:{
                            color:'#BFBFBF'
                        }
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        // onGap: null,
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: ['#00EAFF'],
                            opacity:0.4,
                            width: 1,
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        show:true,
                        lineStyle:{
                            color:'#BFBFBF'
                        }
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: ['#00EAFF'],
                            opacity:0.4,
                            width: 1,
                            type: 'dashed'
                        }
                    }
                },
                series: [{
                    data:[],
                    type: 'line',
                    itemStyle : {
                        normal : {
                            color:'#00EAFF',
                            lineStyle:{
                                color:'#00EAFF'
                            }
                        }
                    }
                }],
                
            },
            mockData:mapToechartMock[0],     //ZML模拟点击点位时间折线图
            mockIndex:0,
            mockMapPoint:['车辆违法', '行人闯红灯'] //控制地图的双色点位
        }
    }
    componentDidMount() {
        this.renderEcharts()
    }
    renderEcharts = ()=>{
        //ZMLTODO 模拟 图表
        let dataOptions = this.state.dataOptions;
        let temXArr = [];
        for(let i =1;i<25;i++){
            temXArr.push(i+'时');
        }
        dataOptions.xAxis.data =  temXArr;
        dataOptions.series[0].data = this.state.mockData;  
                    
        this.setState({
            dataOptions
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.cameraInfo.length == 1){
            const{ mockIndex } = this.state;
            let newMockIndex = (mockIndex+1>=mapToechartMock.length)?0:mockIndex+1;
            this.setState({
                mockData:mapToechartMock[newMockIndex],
                mockIndex:newMockIndex
            },()=>{
                this.renderEcharts();
            })
        }
    }
    mapCheckBoxChange=(checkedValues)=>{
        console.log('checked = ', checkedValues);
        this.setState({
            mockMapPoint:checkedValues
        })
    }
    toggleEchart = ()=>{
        let dataType = this.state.dataOptions.series[0].type;
        // dataType == 'bar'?'line':'bar';
        if(dataType == 'bar'){
            dataType='line';
        }else{
            dataType='bar';
        }
        this.setState({
            dataOptions:{
                grid:{
                    top: '3%',
                    left: '0%',
                    right: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis', 
                    padding: [-10,-20,-10,-25], 
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    data:[],
                    axisLine:{
                        show:true,
                        lineStyle:{
                            color:'#BFBFBF'
                        }
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        // onGap: null,
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: ['#00EAFF'],
                            opacity:0.4,
                            width: 1,
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        show:true,
                        lineStyle:{
                            color:'#BFBFBF'
                        }
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: ['#00EAFF'],
                            opacity:0.4,
                            width: 1,
                            type: 'dashed'
                        }
                    }
                },
                series: [{
                    data:[],
                    type: dataType,
                    barWidth :16,
                    itemStyle : {
                        normal : {
                            color:'#00EAFF',
                            lineStyle:{
                                color:'#00EAFF'
                            }
                        }
                    }
                }]
            }
        },()=>{
            let dataOptions = this.state.dataOptions;
            let temXArr = [];
            for(let i =1;i<25;i++){
                temXArr.push(i+'时');
            }
            dataOptions.xAxis.data =  temXArr;
            dataOptions.series[0].data = this.state.mockData; 
            this.setState({
                dataOptions
            }) 
        })
    }
    showVideo = ()=>{
        console.log('zml 当前要展示的视频是',this.props.cameraIds);

    }
    render() {
        const { history, cameraInfo, showCheckVideo} = this.props;
        const {mockMapPoint} =this.state;
        return(
            <ErrorBoundary>
                <div className="center-div">
                    <div className="center-map">
                        <CheckboxGroup className="center-check" options={plainOptions} defaultValue={['车辆违法', '行人闯红灯']} onChange={this.mapCheckBoxChange} />
                        <MapContainer
                            history={this.props.history}
                            mockMapPoint={mockMapPoint}
                            // {...this.state}
                        />
                        <div className="map-car">机动车违规 <p><span className="mapBarLeft">1</span><span className="mapBarRight">1000</span></p></div>
                        <div className="map-person">闯红灯违规 <p><span className="mapBarLeft">1</span><span className="mapBarRight">1000</span></p></div>
                    </div>
                    <div className="center-echart">
                        <div className="echart-btn">
                            <span className="btn-change" onClick={this.toggleEchart}>切换图表</span>
                            {cameraInfo.length==1 ? (
                                <span className='btn-check activeBtn' onClick={showCheckVideo.bind(this,true)}>查看视频</span>
                            ):(
                                <span className='btn-check'>查看视频</span>
                            )}
                        </div>
                        <div className="echart-canv">
                            <EchartLine
                                id={'main'}
                                option={this.state.dataOptions}
                            />
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        )
    }
}

export default PrincipalPage;