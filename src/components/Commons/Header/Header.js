import PropTypes from 'prop-types';
import React, { Component } from 'react';

import HeaderUserInfo from './HeaderUserInfo';
import HeaderSetting from './HeaderSetting';
import './Header.less';

class Header extends Component {
    render(){
        const { userInfo, history, logout, showUserSetting, changeSettingStatus } = this.props;

        return(
            <header>
                <div className="common_header">
                    <span className="head_logo"></span>
                    <span className="head_text">漳州市AI+交通管理系统</span>
                    <HeaderSetting
                        history={history}
                        userInfo={userInfo}
                        showUserSetting={showUserSetting}
                        changeSettingStatus={changeSettingStatus}
                    />
                    <HeaderUserInfo 
                        history={history}
                        logout={logout}
                        userInfo={userInfo}
                        showUserSetting={showUserSetting}
                        changeSettingStatus={changeSettingStatus}
                    />
                </div>
            </header>
        )
    }

}

export default Header;