import React, { Component } from 'react';
import moment from 'moment';
import { Input, DatePicker  } from 'antd';
class CarsReviewCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            savingArr:[],
            violationTime:''
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { form } =this.props;
        form.validateFields((err, values) => {
            console.log('zml values',values);
        })
    }
    onChange = (date, dateString) =>{
        console.log(date, dateString);
        this.setState({
            violationTime: dateString
        })
      }
    savingInfo=(e)=>{
        e.persist();
        let obj={
            carId:(this.refs.carId && this.refs.carId.value)||'',
            time:this.refs.time.value,
            location:this.refs.location.value
        }
        this.props.saveInfo(obj);   
    }
    mouseOverPoint=(e,src)=>{
        this.props.caculateMouse(e,src);
    }
    mouseOutPoint=(e,src)=>{
        this.props.caculateMouseHide(e,src);
    }
    render(){
        const{ dataSource, activeBtn, saveInfo, doseEdit, editingInfo } = this.props;
        const {editInfo} =this.state;
        let imgArr = [];
        let imgs = dataSource ?dataSource.processImg : [];
        imgs.length && imgs.forEach((d,i)=>{
            imgArr.push(
                <div key={i} className="img-borders info-img-det">
                    <img className="hasborder" src={d} alt=''
                        onMouseMove={(e)=>{
                            this.mouseOverPoint(e,d)
                        }}
                        onMouseOut={(e)=>{
                            this.mouseOutPoint(e,d)
                        }}
                    />
                </div>
            )
        });
        activeBtn == 'car' && imgArr.push(
            <div key={imgs.length} className="img-borders info-img-det">
                <img className="hasborder" src={dataSource.carUrl} alt=''
                    onMouseMove={(e)=>{
                        this.mouseOverPoint(e,dataSource.carUrl)
                    }}
                    onMouseOut={(e)=>{
                        this.mouseOutPoint(e,'')
                    }}
                />
            </div>
        )
        const normalTime = dataSource? moment(dataSource.time).format('YYYY-MM-DD hh:mm:ss'):'';
        const handleClosePop = this.props.handleClosePop;
        return(
            <div className="content-check-info">
                <div className='check-info-top'>
                    <div className="info-text">
                        <div className="img-borders info-person">
                            <img className="hasborder" src={dataSource.imageUrl} alt='' />
                        </div>
                    </div>
                    <div className="info-img">
                        {imgArr}
                    </div>
                 </div>
                <div className='check-info-bottom'>
                   {!doseEdit?(
                            <div className="info-infos">
                                <h5 className="colorf base-bg">基本信息</h5>
                                <div className="edit-info">
                                    {activeBtn == 'car' && (
                                        <p>车牌号：<span className="infos-text">{dataSource.carId}</span></p>
                                    )} 
                                    <p>违规时间：<span className="infos-text">{normalTime}</span></p>
                                    <p>违规地点：<span className="infos-text">{dataSource.location}</span></p>
                                    <p className="edit-btn">
                                        <span  className="span-to-btn btn-card active-btn"
                                            onClick={editingInfo}
                                        >编辑</span>
                                        <span onClick={handleClosePop} className="span-to-btn btn-card">手工录入</span>
                                    </p>
                                </div>
                            </div>
                        ):(
                            <div className="info-infos">
                                <h5 className="colorf base-bg">基本信息</h5>
                                <div className="edit-info">
                                    {activeBtn == 'car' && (
                                        <p>车牌号：
                                            <input className="inpu-normal"
                                                defaultValue={dataSource.carId}
                                                ref="carId" 
                                            /></p>
                                    )}
                                    <div className='violation-time'>违规时间：
                                         <DatePicker 
                                            onChange={this.onChange} 
                                            defaultValue={moment(normalTime, 'YYYY-MM-DD HH:mm:ss')}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            showTime
                                        />
                                    </div>
                                    <p>违规地点：<input className="inpu-normal"            
                                        defaultValue={dataSource.location} 
                                        ref="location"
                                    /> </p>
                                    <p className="edit-btn">
                                        <span className="span-to-btn btn-card active-btn"
                                            onClick={(e)=>{
                                                this.savingInfo(e)
                                            }}
                                        >保存</span>
                                        <span onClick={handleClosePop} className="span-to-btn btn-card">手工录入</span>
                                    </p>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        )
    }
}

export default CarsReviewCard;
