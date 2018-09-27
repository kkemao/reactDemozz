import React, { Component } from 'react';
import { Row, Col, message } from 'antd';
import ErrorBoundary from '../../Error/ErrorBoundary';
import CarsReviewCard from './CarsReviewCard';
import ChoiceTabs from './ChoiceTabs';
import InputYituInfo from './InputYituInfo';
import MouseImg from './MouseImg';


//zml模拟数据
// import carCenterCard from '../Mock/carCenterCard.json';
import ShootingRecordItem_Car_unchecked from '../../ShootingRecord/Mock/ShootingRecordItem_Car_unchecked.json';     //中间卡片替换为拍摄记录的mock数据
import ShootingRecordItem_Person_unchecked from '../../ShootingRecord/Mock/ShootingRecordItem_Person_unchecked.json';     //ZML模拟
import ShootingRecordItem_Car_checked from '../../ShootingRecord/Mock/ShootingRecordItem_Car_checked.json';     //
import ShootingRecordItem_Person_checked from '../../ShootingRecord/Mock/ShootingRecordItem_Person_checked.json';     //ZML模拟
import FileStoreItem from '../../FileStore/Mock/FileStoreItem.json';                       //候选的和档案库联动

import './ReviewPicture.less';


class ReviewPicture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeBtn:this.props.recordToReviewActNow||'car',
            centerCard:{},       //ZML模拟中间卡片mock
            houxuanList:[],      //下列候选cards
            reviewingId:-1,      //当前审核选中的id
            doseEdit:false,
            unCheckedInfo:{        //ZML模拟未识别个数和src
                num:ShootingRecordItem_Car_unchecked.length-1,    //ZML模拟初始的是机动车未识别
                imgUrl:ShootingRecordItem_Car_unchecked[1].imageUrl
            },
            CheckedInfo:{        //ZML模拟未识别个数和src
                num:ShootingRecordItem_Car_checked.length,    //ZML模拟初始的是机动车未识别
                imgUrl:ShootingRecordItem_Car_checked[ShootingRecordItem_Car_checked.length-1].imageUrl
            },
            closePop: true,  //输入依图信息框显示
            mouseImg:false,  //鼠标移入要显示的放大图
            mouseImgClientX:0,
            mouseImgClientY:0, 
            mouseSrc:'',
            notPassArr:[]    //电话号码不通过的不允许确定
        }
    }
    componentWillMount() {
        let reviewIndex = this.props.reviewIndex;
        let houxuanArr=[];
        for(let i=0;i<5;i++){
            houxuanArr.push(FileStoreItem[i])
        };
        this.setState({
            centerCard:this.state.activeBtn ==='car'?ShootingRecordItem_Car_unchecked[reviewIndex.car]:ShootingRecordItem_Person_unchecked[reviewIndex.person],
            houxuanList:houxuanArr
        });
    }
  
    componentDidMount() {
    //   console.log('zml mockdata',ShootingRecordItem_Car_unchecked); 
    }
    componentWillReceiveProps(nextProps){
        // if(JSON.stringify(this.props.reviewIndex) != JSON.stringify(nextProps.reviewIndex)){ 
            let activeBtn = this.state.activeBtn;
            let nextObj = nextProps.reviewIndex;
            let houxuanArr=[];
            let indexNow = activeBtn ==='car'?nextObj.car:nextObj.person;
            for(let i=indexNow;i<indexNow+5;i++){
                houxuanArr.push(FileStoreItem[i])
            };
            this.setState({
                centerCard:activeBtn ==='car'?ShootingRecordItem_Car_unchecked[nextObj.car]:ShootingRecordItem_Person_unchecked[nextObj.person],
                houxuanList:houxuanArr
            })
        // }
        
    }
    toggleModule = (data)=>{
        const { activeBtn }=this.state;
        if(data == activeBtn)return;
        let reviewIndex = this.props.reviewIndex;
        //ZML模拟交互变换已辨识和未辨识等模拟信息
        let unCheckedInfoObj={
            num: data ==='car'? ShootingRecordItem_Car_unchecked.length:ShootingRecordItem_Person_unchecked.length,
            imgUrl:data ==='car'? ShootingRecordItem_Car_unchecked[1].imageUrl:ShootingRecordItem_Person_unchecked[1].imageUrl
        }
        let CheckedInfoObj={        //ZML模拟未识别个数和src
            num:data ==='car'? ShootingRecordItem_Car_checked.length:ShootingRecordItem_Person_checked.length,    //ZML模拟初始的是机动车未识别
            imgUrl:data ==='car'? ShootingRecordItem_Car_checked[ShootingRecordItem_Car_checked.length-1].imageUrl:ShootingRecordItem_Person_checked[ShootingRecordItem_Person_checked.length-1].imageUrl
        }
        let houxuanArr = [];
        let indexNow = data ==='car'?reviewIndex.car:reviewIndex.person;
        for(let i=indexNow;i<indexNow+5;i++){
            houxuanArr.push(FileStoreItem[i])
        };
        this.setState({
            doseEdit:false,
            activeBtn:data,
            centerCard:data ==='car'?ShootingRecordItem_Car_unchecked[reviewIndex.car]:ShootingRecordItem_Person_unchecked[reviewIndex.person],
            houxuanList:houxuanArr,
            unCheckedInfo:unCheckedInfoObj,
            CheckedInfo:CheckedInfoObj
        });
    }
    //点击跳过
    btnSkip = ()=>{
        this.setState({reviewingId:-1});
        let activeBtn = this.state.activeBtn;
        let activeDataLen = activeBtn == 'car'?ShootingRecordItem_Car_unchecked.length:FileStoreItem.length;
        this.props.changereviewIndex(activeBtn,activeDataLen);  //模拟后台抓拍审阅的索引值
    }
    //点击确定
    btnOk=()=>{
        this.setState({reviewingId:-1});
        let activeBtn = this.state.activeBtn;
        if(activeBtn == 'car'){
            this.okFun( ShootingRecordItem_Car_checked,ShootingRecordItem_Car_unchecked );
        }else if(activeBtn == 'person'){
            this.okFun( ShootingRecordItem_Person_checked,ShootingRecordItem_Person_unchecked );
        }
    }
    okFun = (checkMock, unCheckMock)=>{
        const { reviewIndex } =this.props;
        let nowIndex;   //新索引
        nowIndex = reviewIndex.car;
        this.props.changereviewIndex('car',nowIndex);
        checkMock.push(unCheckMock[nowIndex]);
        unCheckMock.splice(0,1);
        let newUnCheckedInfo = {
            num:unCheckMock.length-1,
            imgUrl:unCheckMock[1].imageUrl
        }
        let newCheckedInfo = {
            num:checkMock.length,
            imgUrl:checkMock[checkMock.length-1].imageUrl
        }
        this.setState({
            unCheckedInfo:newUnCheckedInfo,
            CheckedInfo:newCheckedInfo
        })
    }
    btnRemove=()=>{
        this.setState({reviewingId:-1});
        let activeBtn = this.state.activeBtn;
        if(activeBtn == 'car'){
            this.removeFun(ShootingRecordItem_Car_unchecked);
        }else if(activeBtn == 'person'){
            this.removeFun(ShootingRecordItem_Person_unchecked);
        }
    }
    removeFun=(unCheckMock)=>{
        let nowIndex;   //新索引
        const { reviewIndex } =this.props;
        nowIndex = reviewIndex.car;
        this.props.changereviewIndex('car',nowIndex)
        unCheckMock.splice(0,1);
        let newUnCheckedInfo = {
            num:unCheckMock.length,
            imgUrl:unCheckMock[1].imageUrl
        }
        this.setState({
            unCheckedInfo:newUnCheckedInfo
        })
    }
    btnReset = ()=>{
        this.setState({reviewingId:-1});
    }
    savePhoneChange=(phoneValue)=>{
        if(!phoneValue.value) return;
        FileStoreItem.forEach((d,i)=>{
            if(d.id == phoneValue.id){
                d.phone=phoneValue.value;
                message.success('保存成功');
                return;
            }
        })
    }
    //修改电话号码不通过
    saveNotPassPhone=(id,type)=>{
        let notPass= this.state.notPassArr;
            this.setState({
                notPassArr:type=='save'?[id]:[]
            })
    }
    editingInfo=()=>{
        this.setState({
            doseEdit:true
        })
    }
    //编辑后保存按钮，ZML模拟更改本地数据
    saveInfo = (obj)=>{
        let reviewIndex = this.props.reviewIndex;
        let activeBtn = this.state.activeBtn;
        if(activeBtn == 'car'){
            ShootingRecordItem_Car_unchecked[reviewIndex.car].carId = obj.carId;
            ShootingRecordItem_Car_unchecked[reviewIndex.car].time = obj.time;
            ShootingRecordItem_Car_unchecked[reviewIndex.car].location = obj.location;
        }else if (activeBtn == 'person'){
            ShootingRecordItem_Person_unchecked[reviewIndex.person].time = obj.time;
            ShootingRecordItem_Person_unchecked[reviewIndex.person].location = obj.location;
        }
        this.setState({
            doseEdit:false,
        });
    }
    //审核过程中第一次选中
    reviewingChoosen=(id)=>{
        this.setState({reviewingId:id});
    }
    handleClosePop = (e)=>{
        let state = this.state.closePop;
        if (state) {
            this.setState({
                closePop:  false
            })
            return false;
        };
        setTimeout(()=>{
            this.setState({
                closePop: true
            })
        },100);
        
    }
    caculateMouse=(e,src)=>{
        let moveLeft=((e.clientX+700)>=window.screen.width)?window.screen.width-700:e.clientX;
        this.setState({
            mouseImg:true,
            mouseImgClientX:moveLeft,
            mouseImgClientY:e.clientY,
            mouseSrc:src
        })
    }
    caculateMouseHide=(e,src)=>{
        this.setState({
            mouseImg:false,
            mouseImgClientX:0,
            mouseImgClientY:0,
            mouseSrc:''
        });
    }
    render() {
        const { history, changeRoute} = this.props;
        const { activeBtn, centerCard, houxuanList, reviewingId, doseEdit, unCheckedInfo, CheckedInfo,closePop, mouseImg,mouseImgClientX , mouseImgClientY, mouseSrc, notPassArr} = this.state;
        return(
            <ErrorBoundary>
                <div className="content-div">
                    <div className="check-btn">
                        <span className={activeBtn ==='car'?'active-btn span-to-btn':'span-to-btn'} onClick={this.toggleModule.bind(this,'car')}>车辆违法</span>
                        <span className={activeBtn ==='person'?'active-btn span-to-btn':'span-to-btn'} onClick={this.toggleModule.bind(this,'person')}>行人闯红灯</span>
                    </div>
                    <div className="check-content review-bg">
                        <div className="content-head">
                            <div className='content-check-left'>
                                <div className="content-check-card">
                                    <span className="content-bg"></span>
                                    <div className="img-borders content-check-img">
                                        <img style={{width:'100px'}} src={CheckedInfo.imgUrl} alt='' />
                                    </div>
                                    <div className="content-check-num">
                                        <p className="num-name">已辨识</p>
                                        <p className="num-qty">{CheckedInfo.num}</p>
                                    </div>
                                </div>
                                <div className="content-check-card">
                                    <span className="content-bg"></span>
                                    <div className="img-borders content-check-img">
                                        <img width='100px' src={unCheckedInfo.imgUrl} alt='' />
                                    </div>
                                    <div className="content-check-num">
                                        <p className="num-name unchecked">未辨识</p>
                                        <p className="num-qty">{unCheckedInfo.num}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='content-check-right'>

                           
                            <CarsReviewCard 
                                activeBtn={activeBtn}
                                dataSource={centerCard}
                                saveInfo={this.saveInfo}
                                doseEdit={doseEdit}
                                editingInfo={this.editingInfo}
                                handleClosePop = {this.handleClosePop}
                                caculateMouse={this.caculateMouse}
                                caculateMouseHide={this.caculateMouseHide}
                            />
                             </div>
                            {/* <div className="content-check-card">
                                <span className="content-bg"></span>
                                <div className="img-borders content-check-img ">
                                    <img src={unCheckedInfo.imgUrl} alt='' />
                                </div>
                                <div className="content-check-num">
                                    <p className="num-name">未辨识</p>
                                    <p className="num-qty">{unCheckedInfo.num}</p>
                                </div>
                            </div> */}
                        </div>
                        <div className="content-bottom">
                            <ChoiceTabs 
                                reviewingId={reviewingId}
                                changeRoute={changeRoute}
                                dataSource={houxuanList}
                                btnSkip={this.btnSkip}
                                btnReset={this.btnReset}
                                btnRemove={this.btnRemove}
                                reviewingChoosen={this.reviewingChoosen}
                                btnOk={this.btnOk}
                                savePhoneChange={this.savePhoneChange}
                                saveNotPassPhone={this.saveNotPassPhone}
                                notPassArr={notPassArr}
                            />
                        </div>
                        <div className='input-info' >
                            {!closePop && (
                                <InputYituInfo
                                    handleClosePop = {this.handleClosePop}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {mouseImg && 
                    
                    <MouseImg
                        mouseImgClientX={mouseImgClientX}
                        mouseImgClientY={mouseImgClientY}
                        mouseSrc={mouseSrc}
                    />
                }
            </ErrorBoundary>
        )
    }
}

export default ReviewPicture;