import React, { Component } from 'react';
import { Slider, InputNumber, Row, Col,Icon,Button } from 'antd';

class ThresholdSetting extends Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: 92,
        }
    }

    onChange = (value) => {
        this.setState({
          inputValue: value,
        });
    }
    render(){
        return(
            <div className='setting similarity-setting' >
                <Icon className="close-icon" type="close-circle-o" onClick={this.props.handleClick}/>
                <h4 className="setting-title">相似度阈值</h4>
                <div className='similarity-wrapper'>
                    <Row className='pannelStyle'>
                        <Col span={4} style={{textAlign:'right'}}>
                            <span className='percent'>相似度：</span>
                        </Col>
                        <Col span={10}>
                             <Slider min={80} max={100} onChange={this.onChange} value={this.state.inputValue} />
                        </Col>
                        <Col span={4}>
                            <InputNumber
                                min={80}
                                max={100}
                                style={{ marginLeft: 16 }}
                                value={this.state.inputValue}
                                onChange={this.onChange}
                            />
                        </Col>
                        <Col span={2}>
                            <span className='percent'>%</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'center',marginTop: '70px' }}>
                            <Button >取消</Button>
                            <Button style={{ marginLeft: 8 }} type="primary" >
                                确认
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default ThresholdSetting;