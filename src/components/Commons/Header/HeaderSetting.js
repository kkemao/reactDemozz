import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dropdown } from 'antd';
import icon_setting from '../../../asset/icon/setting.png';
import { OtherSetting } from '../../../utils/config';

class HeaderSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
          menuArr: [
              'addAccount',
              'operationRecord',
              'personalManage',
              'thresholdSetting',
              'videoSavetime',
              'punishSetting'
          ]
        };
    }

    handleClick = data => {
        const{showUserSetting, changeSettingStatus } = this.props;
        if(showUserSetting){
            changeSettingStatus(false,null);
            setTimeout(()=>{
                changeSettingStatus(true,data);
            },300)
        }else{
            changeSettingStatus(true,data);  
        }        
    };
    render(){
        const { userInfo } = this.props;

        var menuTab = [];
        this.state.menuArr.forEach((d, i) => {
            if (OtherSetting[d].visibility) {
                let thisData = OtherSetting[d];
                if(!OtherSetting[d].disable){
                    menuTab.push(
                        <li
                            className="userBox_menu_item"
                            key={thisData.id}
                            onClick={this.handleClick.bind(this, thisData.id)}
                        >
                            <span>{thisData.name}</span>
                        </li>
                    );
                }else{
                    menuTab.push(
                        <li
                            className="userBox_menu_item disable_item"
                            key={thisData.id}
                        >
                            <span>{thisData.name}</span>
                        </li>
                    );
                }
            }
        });

        const menu = (
            <div className="userBox_menu" selectable="false" focusable="true">
                <div className="alarm-center-container">
                    <div className="userBox-menu-mainbox">
                        <ul className="act-ul">
                            {menuTab}
                        </ul>
                    </div>
                </div>
            </div>
        );
        return (
            <Dropdown overlay={menu} placement="bottomRight" size="260px">
                <div className="user_setting">
                    <img
                        className="header_avatar mr5"
                        src={ icon_setting}
                        alt="icon"
                    />
                </div>
            </Dropdown>
        )
    }
}

export default HeaderSetting;