import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Row } from 'antd';

const actStyle = {
    background: 'rgba(0,234,255,0.2)'
}
class HomePageMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
          hideNotice: true,
          menuArr: [
              'HomePage',
              'ReviewPicture',
              'ShootingRecord',
              'FileStore',
              'ExportData'
          ],
          activeTab: 'HomePage'
        };
    }
    componentWillMount(){
       
    }
    menuClickFun(data) {
        console.log(data)
        const { history ,activeMenuTab, changeRoute} = this.props;
        if(data.id == activeMenuTab) return;
        changeRoute(data.id);
    }
    render(){
        const { menuObj, activeMenuTab } = this.props;
        
        // 菜单栏-tab
        var menuTab = [];
        this.state.menuArr.forEach((d, i) => {
            if (menuObj[d].visibility == true) {
                let thisData = menuObj[d];
                menuTab.push(
                    <Row span={6} key={d}>
                        <div className='hpmt-div fl big-menu-icon'
                            key={d}
                            onClick={this.menuClickFun.bind(this, thisData)}
                            style={d == activeMenuTab? actStyle:{}}
                        >
                            <img src={d == activeMenuTab?menuObj[d].iconAct: menuObj[d].icon} alt='demo' />
                        </div>
                    </Row>
                );
            }
        });
        return(
            <div className="homepage-menu-box">
                {menuTab}
            </div>
        )
    }
}

export default HomePageMenu;