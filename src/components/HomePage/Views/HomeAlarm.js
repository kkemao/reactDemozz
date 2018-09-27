import React, { Component } from 'react';

class HomeAlarm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }  
    componentWillReceiveProps(nextProps){
        let oldData = JSON.stringify(nextProps.data);
        let newData = JSON.stringify(this.props.data);
        if(oldData!=newData){
            this.setState({
                data:nextProps.data
            })
        }
    }
    render() {
        const { data } = this.state;
        return (
            <div className='alarm-div'>
                <div className='alarm-head'>
                    <div className='alarm-head-img'>违规告警</div>
                </div>
                <div className='alarm-top'>
                    <div className='alarm-top-left'>
                        <div className='alarm-img-div'>
                            <img className='alarm-img' src={data.personUrl} alt='抓拍图片'/>
                            <img className='alarm-img' src={data.simUrl} alt='对比图片'/>
                            <div className='alarm-sim'>
                            {Math.floor(data.threshold*100)+'%'}</div>
                        </div>
                    </div>
                    <div className='alarm-top-right'>
                        <p>车牌号：{data.card}</p>
                        <p>地点：{data.location}</p>
                    </div>
                </div>
                <div className='alarm-footdiv'>
                    <img className='alarm-big' src={data.imgUrl} alt='抓拍图片'/>
                </div>
            </div>
        );
    }
}
export default HomeAlarm;