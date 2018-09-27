import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dropdown } from 'antd';
import icon_userDefault from '../../../asset/icon/userDefault.png';
import { AccountSetting } from '../../../utils/config';

class HeaderUserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
          menuArr: [
              'bindingPhone',
              'compareFace',
              'focus',
              'changePass',
              'changeUser'
          ]
        };
    }
  
    handleClick = data => {
        const {logout,history, changeSettingStatus, showUserSetting } = this.props;
        if (data == 'changeUser') {
            logout(this.props);
            return;
        };
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
            if (AccountSetting[d].visibility) {
                let thisData = AccountSetting[d];
                if(!AccountSetting[d].disable){
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
                <div className="user_infos">
                    <img
                        className="header_avatar mr5"
                        src={
                            userInfo && userInfo.userAvatar
                            ? userInfo.userAvatar
                            : icon_userDefault
                        }
                        alt="icon"
                    />
                    <span>{userInfo ? userInfo.oauth_AIK_user_info.name : ''}</span>
                </div>
            </Dropdown>
        )
    }
}

export default HeaderUserInfo;