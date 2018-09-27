import React, { Component } from 'react';
import { Select, Form, Row, Col,Icon,Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class VideoSavetime extends Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: 1,
        }
    }
    handleSelectChange = (value) => {
        console.log('选择',value);
    }

    render(){
       
        return(
            <div className='setting video-savetime'>
                 <Icon className="close-icon" type="close-circle-o" onClick={this.props.handleClick}/>
                <h4 className="setting-title">视频储存时间</h4>
                <div className='video-wrapper'>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            label="选择时长"
                            labelCol={{ span: 5,offset:2 }}
                            wrapperCol={{ span: 12 }}
                        >
                            <Select
                                defaultValue="1"
                                onChange={this.handleSelectChange}
                            >
                                <Option value="1">24小时</Option>
                                <Option value="2">12小时</Option>
                                <Option value="3">6小时</Option>
                            </Select>
                    </FormItem>
                    </Form>
                    <Row>
                        <Col span={24} style={{ textAlign: 'center',marginTop:'50px' }}>
                            <Button >取消</Button>
                            <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                                确认
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default VideoSavetime;