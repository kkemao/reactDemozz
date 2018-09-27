import React, { Component } from 'react';
import { Icon } from 'antd';
class ChangePass extends Component {
    
    render(){
        return(
            <div className="replacement">
                <Icon className="close-icon" type="close-circle-o" onClick={this.props.handleClick}/>
                <h1 className='header'>切换用户模块</h1>
                
            </div>
        )
    }
}

export default ChangePass;