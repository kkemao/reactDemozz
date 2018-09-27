import React, { Component } from 'react';
import { Button } from 'antd';
import moment from 'moment';

class ShootingRecordItem extends Component {
    // shouldComponentUpdate(nextProps, nextState){
    //     if(JSON.stringify(nextProps.alarmRes)!=JSON.stringify(this.props.alarmRes)){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }
    showBigImg=(e)=>{
        this.props.showBigPicture(true,e.target.src);
    }
    render() {
        const{ dataSource, activeBtn, activeImgType } =this.props;
        const itemTime = moment(dataSource.time).format('YYYY-MM-DD hh:mm:ss');
        let processImg = [];
        dataSource.processImg.forEach((item, i) => {
            processImg.push(
                <div className={activeBtn == 'car'?"bottom-div width-200":"bottom-div width-140"} key={i}>
                    <div className="img-borders info-img">
                        <img src={item} onClick={this.showBigImg.bind(this)}/>
                    </div>
                </div>
            );
        });
        return(
            <div className="record-item">
                <div className="item-top">
                    <div className="record-img-group">
                        <div className="record-img-div">
                            <div className="img-borders info-img">
                                <img src={dataSource.imageUrl} />
                            </div>
                        </div>
                        { activeBtn == 'car' && ( 
                            <div className="record-img-card">
                                <div className="img-borders info-img">
                                    <img src={dataSource.carUrl} onClick={this.showBigImg.bind(this)}/>
                                </div>
                            </div>
                        ) }
                    </div>
                    <div className="item-text">
                        {activeImgType == 'checked' && (<p className="info-name">{dataSource.name}</p>)}
                        {activeImgType == 'checked' ? (
                            <p>身份证：{dataSource.cid} {activeBtn == 'person' && <span className="info-type">{dataSource.type}</span>}
                            </p>
                        ):(
                            <p>已设定阈值：88%</p>
                        )}
                        {activeImgType !== 'checked' && <p>符合条件人数：<span>{dataSource.number || 0} 人</span></p>}
                        { activeBtn == 'car' && ( 
                            <p>车牌号：{dataSource.carId} {
                                activeImgType == 'unchecked' && 
                                '(待确认)'
                                }
                                <span className="info-type">{dataSource.type}</span>
                            </p>
                        ) }
                        <p className="marginTop">抓拍时间：{itemTime}{ activeImgType == 'checked' && ( <span className="info-times">{dataSource.times||0} 次</span>)}</p>
                        {/* <p>抓拍时间：{itemTime}{ activeBtn == 'person' && activeImgType == 'checked' && ( <span className="info-times">{dataSource.times||0} 次</span>)}</p> */}
                        <p>抓拍地点：{dataSource.location}</p>
                        {activeImgType == 'checked'?(<Button className="btnNormal btnPrint">打印罚单</Button>):null}
                    </div>
                </div>
                <div className="item-bottom">
                    {processImg}
                </div>
            </div>
        )
    }
}

export default ShootingRecordItem;