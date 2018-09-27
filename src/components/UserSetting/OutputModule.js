import React, { Component } from 'react';
import { Icon } from 'antd';

import CompareFaces from './Views/CompareFaces';
import ChangePass from './Views/ChangePass';
import ChangeUser from './Views/ChangeUser';
import AddAccount from './Views/AddAccount';
import OperationRecord from './Views/OperationRecord';
import PersonalManage from './Views/PersonalManage';
import ThresholdSetting from './Views/ThresholdSetting';
import VideoSavetime from './Views/VideoSavetime';
import PunishSetting from './Views/PunishSetting';


import './OutputModule.less';

class OutputModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModel:''    //当前显示的模块
        }
    }
    componentWillMount(){
        this.setState({
            showModel:this.props.userModule
        })
    }
    closeSetting=()=>{
        this.props.changeSettingStatus(false,null);
    }
    render(){
        const {showModel } = this.state;
        return(
            <div className="setting-box">
                <div className='bg' ></div>
                {/* <Icon className="close-icon" type="close-circle-o" onClick={this.closeSetting}/> */}
                {showModel=='compareFace' && (
                    <CompareFaces handleClick={this.closeSetting.bind(this)}/>
                )}
                {showModel=='changePass' && (
                    <ChangePass  handleClick={this.closeSetting.bind(this)}/>
                )}
                {showModel=='addAccount' && (
                    <AddAccount  handleClick={this.closeSetting.bind(this)}/>
                )}
                {showModel=='operationRecord' && (
                    <OperationRecord handleClick={this.closeSetting.bind(this)}/>
                )}
                {showModel=='personalManage' && (
                    <PersonalManage handleClick={this.closeSetting.bind(this)}/>
                )}
                {showModel=='thresholdSetting' && (
                    <ThresholdSetting handleClick={this.closeSetting.bind(this)}/>
                )}
                {showModel=='videoSavetime' && (
                    <VideoSavetime  handleClick={this.closeSetting.bind(this)}/>
                )}
                {showModel=='punishSetting' && (
                    <PunishSetting  handleClick={this.closeSetting.bind(this)}/>
                )}
                
            </div>
        )
    }
}

export default OutputModule;