import React, { Component } from 'react';
import TimeUtil from '../../../utils/TimeUtil';

class HomePageRight extends Component {
    shouldComponentUpdate(nextProps, nextState){
        if(JSON.stringify(nextProps.alarmRes)!=JSON.stringify(this.props.alarmRes)){
            return true;
        }else{
            return false;
        }
    }
    showBigImg=()=>{
        const { alarmRes } = this.props;
        console.log(alarmRes.imgUrl,'|||')
        this.props.showBigPicture(true,alarmRes.imgUrl);
    }
    render() {
        const { alarmRes } = this.props;
        const fromNowTime = TimeUtil.timeLeaveNow(alarmRes.Time);
        return (
            <div className='right-item'>
                <div className='item-head'>
                    <div className='item-head-img'>信息抓拍成功</div>
                    <div className='item-head-time'>{fromNowTime}</div>
                </div>
                <div className='item-imgdiv'>
                    <img 
                        className='item-img' 
                        src={alarmRes.imgUrl} 
                        alt='抓拍图片'
                        onClick={this.showBigImg}
                    />
                </div>
                <div className='item-footdiv'>
                    <p className='item-footcard'>车牌号：{alarmRes.card}
                        <span className='item-foottext'>{alarmRes.type}</span>
                    </p>
                    <p>地点：{alarmRes.location}</p>
                </div>
            </div>
        );
    }
}
export default HomePageRight;