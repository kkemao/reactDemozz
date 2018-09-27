import React, { Component } from 'react';

import moment from 'moment';
import {Select, DatePicker, Input, Button, Pagination, Radio, Icon } from 'antd';

import ShootingRecordItem from './ShootingRecordItem';
import ImportData from './ImportData';
import BigPicture from '../../Commons/BigPicture';
//zml模拟数据
import ShootingRecordItem_Car_checked from '../Mock/ShootingRecordItem_Car_checked.json';  //机动车-已确认
import ShootingRecordItem_Car_unchecked from '../Mock/ShootingRecordItem_Car_unchecked.json';  //机动车-未确认
import ShootingRecordItem_Person_checked from '../Mock/ShootingRecordItem_Person_checked.json';  //机动车-已确认
import ShootingRecordItem_Person_unchecked from '../Mock/ShootingRecordItem_Person_unchecked.json';  //机动车-未确认


import { systemDateRange } from '../../../utils/config';
import { chunk } from '../../../utils/global';

import './ShootingRecord.less';

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class ShootingRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDay:null,      //过滤项 开始时间
            endDay:null,      //过滤项 结束时间
            recogCar:0,      //过滤项 是否识别车牌 ZML模拟 0不限 1是 2否
            keyWord:'',      //过滤项 关键词 姓名和身份证
            page:1,
            pageLength:ShootingRecordItem_Car_checked.length,       //分页的总数目 ZML模拟长度
            recordNum:ShootingRecordItem_Car_checked.length,    //ZML模拟已审核和未审核数组总数
            activeBtn:'car',
            activeImgType:'checked', //已确认未确认的btn
            mockDataChunk:chunk(ShootingRecordItem_Car_checked,6),     //ZML模拟切分模拟data数据
            closePop: true,
            isShowAddPic:false,  //显示隐藏添加图片按钮
            showBigImgs:false,
            bigSrc:'',
            showAlarm:false,
        }
    }
    componentWillMount(){
        if(this.props.activeUnckecked){
            this.setState({
                mockDataChunk:chunk(ShootingRecordItem_Car_unchecked,6),
                recordItemData:chunk(ShootingRecordItem_Car_unchecked,6)[0],
                pageLength:ShootingRecordItem_Car_unchecked.length,       //分页的总数目 ZML模拟长度
                page:1,
                activeImgType:this.props.activeUnckecked?'unchecked':'checked',
                recordNum:this.props.activeUnckecked?ShootingRecordItem_Car_unchecked.length:ShootingRecordItem_Car_checked.length,    //ZML模拟已审核和未审核数组总数
            })
        }else{
            this.setState({
                recordItemData:this.state.mockDataChunk[0]
            });
        }
        
    }
   
    pageChange=(page)=>{
        this.setState({
            page:page,
            recordItemData:this.state.mockDataChunk[page-1]       //ZML模拟分页的请求
        })
    }
    prePage =()=>{
        let page=this.state.page;
        if(page==1) return;
        this.setState({
            page:page-1,
            recordItemData:this.state.mockDataChunk[page-2]       //ZML模拟分页的请求
        });
    }
    nextPage =()=>{
        let page=this.state.page;
        let limitLen = this.state.mockDataChunk.length;
        if(page == limitLen) return;
        this.setState({
            page:page+1,
            recordItemData:this.state.mockDataChunk[page]       //ZML模拟分页的请求
        });
    }
    toggleModule = (data)=>{
        const { activeBtn }=this.state;
        if(data === activeBtn)return;
        this.setState({
            activeBtn:data,
            activeImgType:'checked'
        });
        //ZMLTODO下面的逻辑要分，闯红灯和机动车的已确认+未确认
        //ZML模拟切换请求数据
        if(data=='car'){
            this.setState({
                mockDataChunk:chunk(ShootingRecordItem_Car_checked,6),
                recordItemData:chunk(ShootingRecordItem_Car_checked,6)[0],
                pageLength:ShootingRecordItem_Car_checked.length,       //分页的总数目 ZML模拟长度
                page:1
            })
        }else if(data=='person'){
            this.setState({
                mockDataChunk:chunk(ShootingRecordItem_Person_checked,6),
                recordItemData:chunk(ShootingRecordItem_Person_checked,6)[0],
                pageLength:ShootingRecordItem_Person_checked.length,       //分页的总数目 ZML模拟长度
                page:1
            })
        }

    }
    toggleImgType = (data)=>{
        const { activeImgType, activeBtn }=this.state;
        if(data == activeImgType)return;
        this.setState({
            activeImgType:data,
            recordNum:data=='unchecked'?ShootingRecordItem_Car_unchecked.length:ShootingRecordItem_Car_checked.length,    //ZML模拟已审核和未审核数组总数
        });
        //ZML模拟切换请求数据
        if(activeBtn=='car'){
            if(data=='checked'){
                this.setState({
                    mockDataChunk:chunk(ShootingRecordItem_Car_checked,6),
                    recordItemData:chunk(ShootingRecordItem_Car_checked,6)[0],
                    pageLength:ShootingRecordItem_Car_checked.length,       //分页的总数目 ZML模拟长度
                    page:1
                })
            }else if(data=='unchecked'){
                this.setState({
                    mockDataChunk:chunk(ShootingRecordItem_Car_unchecked,6),
                    recordItemData:chunk(ShootingRecordItem_Car_unchecked,6)[0],
                    pageLength:ShootingRecordItem_Car_unchecked.length,       //分页的总数目 ZML模拟长度
                    page:1
                })
            }
        }else if(activeBtn=='person'){
            if(data=='checked'){
                this.setState({
                    mockDataChunk:chunk(ShootingRecordItem_Person_checked,6),
                    recordItemData:chunk(ShootingRecordItem_Person_checked,6)[0],
                    pageLength:ShootingRecordItem_Person_checked.length,       //分页的总数目 ZML模拟长度
                    page:1
                })
            }else if(data=='unchecked'){
                this.setState({
                    mockDataChunk:chunk(ShootingRecordItem_Person_unchecked,6),
                    recordItemData:chunk(ShootingRecordItem_Person_unchecked,6)[0],
                    pageLength:ShootingRecordItem_Person_unchecked.length,       //分页的总数目 ZML模拟长度
                    page:1
                })
            }
        }
    }
    //过滤条件-时间范围改变
    onRangeChange=(date, dateString)=>{
        this.setState({
            startDay:dateString[0],      
            endDay:dateString[1] 
        })
    }
    //过滤条件-是否识别车牌改变
    onRecogCarIdChange=(value)=>{
        this.setState({
            recogCar:value
        })
    }
    //过滤条件-关键词输入
    onKeyWordChange=(e)=>{
        this.setState({
            keyWord:e.target.value
        })
    }

    //回车查询
    handleKeydown = (e) => {
        if (e.keyCode === 13) {
            this.queryInfo()
        }
    }
    //过滤条件-查询
    queryInfo=()=>{
        const{ activeBtn, activeImgType, startDay, endDay, recogCar, keyWord} = this.state;
        //ZML模拟过滤项请求数据
        if(activeBtn=='car'){
            if(activeImgType=='checked'){
                this.queryFun(ShootingRecordItem_Car_checked);
            }else if(activeImgType=='unchecked'){
                this.queryFun(ShootingRecordItem_Car_unchecked);
            }
        }else if(activeBtn=='person'){
            if(activeImgType=='checked'){
                this.queryFun(ShootingRecordItem_Person_checked);
            }else if(activeImgType=='unchecked'){
                this.queryFun(ShootingRecordItem_Person_unchecked);
            }
        }
    }
    queryFun=(mockData)=>{
        const{ startDay, endDay, recogCar, keyWord } = this.state;
        let recArr = [];
        let oldArr = mockData;
        mockData.forEach((d,i)=>{
            let _startDay=  startDay && new Date(startDay+' 00:00:00').getTime();
            let _endDay =endDay&& new Date(endDay+' 23:59:59').getTime();
            if((_startDay && _endDay ? d.time>=_startDay && d.time<_endDay:true)&&(recogCar!=0  ? d.clear==recogCar : true)&&(keyWord ? (d.name.indexOf(keyWord)!=-1||d.cid.toString().indexOf(keyWord)!=-1):true)){
                recArr.push(d);
            }
        });
        //如果所有都没有
        if(!keyWord && !startDay && !endDay){
            recArr=mockData
        }
        console.log('zml 新的',recArr);
        this.setState({
            mockDataChunk:chunk(recArr,6),
            recordItemData:recArr.length ?chunk(recArr,6)[0]:[],
            pageLength:recArr.length,       //分页的总数目 ZML模拟长度
            page:1
        });
    }
    changeInputType=(e)=>{
        console.log(`radio checked:${e.target.value}`);
        const { isShowAddPic,activeImgType, activeBtn }=this.state;
        //ZML模拟更换自动手动输入
        if(e.target.value === '0') {
            this.setState({isShowAddPic:false})
        } else if(e.target.value === '1'){
            this.setState({isShowAddPic:true})
        }
        let mockData;
        // if(activeBtn=='car'){
        //     if(activeImgType == 'checked'){

        //     }else if(activeImgType == 'unchecked'){

        //     }
        // }else if(activeBtn=='person'){
        //     if(activeImgType == 'checked'){

        //     }else if(activeImgType == 'unchecked'){
                
        //     }
        // }
        // FileStoreItemMock.forEach((d,i)=>{
        //     if(d.id == id){
        //         d.note = obj.note;
        //     }
        // });
        // this.setState({
        //     mockDataChunk:chunk(ShootingRecordItem_Person_unchecked,6),
        //     recordItemData:chunk(ShootingRecordItem_Person_unchecked,6)[0],
        //     pageLength:ShootingRecordItem_Person_unchecked.length,       //分页的总数目 ZML模拟长度
        //     page:1
        // })
    }
    showBigPicture=(boolean,src)=>{
        this.setState({
            showBigImgs:boolean,
            bigSrc:src
        })
    }
    handleClosePop = (e)=>{
        let state = this.state.closePop;
        if (state) {
            this.setState({
                closePop:  false
            })
            return
        }
        this.setState({
            closePop: true
        })
    }
    render(){
        const{ isShowAddPic,page, pageLength, activeBtn, activeImgType, mockDataChunk, closePop, showBigImgs, bigSrc, recordNum} =this.state;
        const { changeRoute } = this.props;
        const {RangePicker} = DatePicker        //antD时间控件

        let recordArr = [];
        this.state.recordItemData.length && this.state.recordItemData.forEach((item, i) => {
            recordArr.push(
                <ShootingRecordItem
                    key={item.id}
                    dataSource={item}
                    activeBtn={activeBtn}
                    activeImgType={activeImgType}
                    showBigPicture={this.showBigPicture}
                />
            );
        });

        return(
            <div className="content-div">
                <div className="check-btn">
                    <span className={activeBtn ==='car'?'active-btn span-to-btn':'span-to-btn'} onClick={this.toggleModule.bind(this,'car')}>车辆违法</span>
                    <span className={activeBtn ==='person'?'active-btn span-to-btn':'span-to-btn'} onClick={this.toggleModule.bind(this,'person')}>行人闯红灯</span>
                </div>
                <div className="center-div review-bg">
                    <div className="imge-type">
                        <span
                            className={activeImgType=='checked'?'type-active type-checked':'type-checked'}
                            onClick={this.toggleImgType.bind(this,'checked')}
                         >
                            已确认照片
                         </span>
                        <span 
                            className={activeImgType=='unchecked'?'type-active type-checked':'type-checked'}
                            onClick={this.toggleImgType.bind(this,'unchecked')}
                        >
                            未确认照片
                        </span>
                    </div>
                    <div className="file-filter">
                        <span>选择时间： </span><RangePicker className="borders mr10" size="small" onChange={this.onRangeChange} />
                        {activeBtn=='car' && (<span>是否识别车牌： </span> )}
                        {activeBtn=='car' && (
                            <Select className="filter-select mr10" defaultValue="不限" onChange={this.onRecogCarIdChange}>
                                <Option value="0">不限</Option>
                                <Option value="1">是</Option>
                                <Option value="2">否</Option>
                            </Select>
                        )}
                        {activeBtn=='car' && (<span>车辆类型：</span> )}
                        {activeBtn=='car' && (
                            <Select className="filter-select mr10" defaultValue="不限">
                                <Option value="0">不限</Option>
                                <Option value="1">机动车</Option>
                                <Option value="2">非机动车</Option>
                            </Select>
                        )}
                        {activeImgType=='checked' && (
                            <span>关键字： <Input className="filter-input mr10" placeholder="输入姓名、身份证等信息" onChange={this.onKeyWordChange} onKeyDown={this.handleKeydown}  /></span>
                        )}
                        <Button className="btnNormal mr10" onClick={this.queryInfo}  >查询</Button>
                        {activeImgType=='checked'?(
                            <div className="filter-right">
                                <span>已审核<span className="filter-color">{recordNum}</span>张照片</span>
                                <Button className="btnNormal ml15">导出</Button>
                            </div>
                        ):(
                            <div className="filter-inline">
                                <RadioGroup 
                                    className="filter-radio addPicBox" 
                                    className="filter-radio mr10" 
                                    className="filter-radio addPicBox" 
                                    className="filter-radio mr10" 
                                    defaultValue="0" 
                                    size="small" 
                                    buttonStyle="solid"
                                    onChange={this.changeInputType}
                                >
                                    <RadioButton value="0">自动导入</RadioButton>
                                    <RadioButton className="borderRidio" value="1">手动导入</RadioButton>
                                    {!isShowAddPic?null:(<span className="addPic" onClick={this.handleClosePop}>添加照片</span>)}
                                </RadioGroup>
                                <div className="filter-right">
                                    <span>您还有<span className="filter-color">{recordNum}</span>张照片未辨别</span>
                                    <Button className="btnNormal ml15"  onClick={changeRoute.bind(this,'ReviewPicture',activeBtn)}>前往</Button>
                                </div>
                               
                            </div>
                        )}
                    </div>
                    <div className="record-items">
                        <div className="item-arrow arrow-left">
                            <Icon type="left-circle-o" onClick={this.prePage}/>
                        </div>
                        <div className="file-item-list">
                            {recordArr}
                            {/* <ShootingRecordItem/> */}
                        </div>
                        <div className="item-arrow arrow-right">
                            <Icon type="right-circle-o" onClick={this.nextPage} />
                        </div>
                    </div>
                    <div className='input-info' >
                        {!closePop && (
                            <ImportData
                                handleClosePop = {this.handleClosePop}
                            />
                        )}
                    </div>
                    <div className="record-pagination">
                        <Pagination 
                            defaultCurrent={1} 
                            current={page}
                            pageSize={6}
                            total={pageLength} 
                            onChange={this.pageChange}
                        />
                    </div>
                </div>
                { showBigImgs && (
                    <BigPicture
                        showBigPicture={this.showBigPicture} 
                        bigSrc={bigSrc}
                    />
                )} 
            </div>
            
        )
    }
}

export default ShootingRecord;