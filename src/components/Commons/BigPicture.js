import React, { Component } from 'react';
import { Icon } from 'antd';

class BigPicture extends Component {
    shutRect = () => {
        this.props.showBigPicture(false,'');
    };
    render() {
        const { bigSrc } = this.props;
        return (
            <div className="wp">
                <div className="pf" id="bigimgs_mask" onClick={this.shutRect} >
                </div>
                <div id="bigimgs_wrap" className="alarm-pic-animation">
                    <div id="bigimgs_header"><Icon className="closeIcon" type="close-circle-o" onClick={(e)=>
                        {this.shutRect(e,false)}}  />
                    </div>
                    <img className="bigsrc" src={bigSrc} />
                </div>
            </div>
        )
    }
}

export default BigPicture;