import React, { Component } from 'react';
import {Form, Row, Col, Input, Button, Icon} from 'antd';


const FormItem = Form.Item;
const { TextArea } = Input;

class PunishSetting extends Component {
    constructor (props){
        super(props);
        this.state = {
            ticketNumber:'80/1000'
        }
    }
    render(){
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
        };
        return(
            <div className='setting punish-setting'>
                <Icon className="close-icon" type="close-circle-o" onClick={this.props.handleClick}/>
                <h4 className="setting-title">处罚相关设置</h4>
                <div className='punish-wrapper'>
                    <Row gutter={8}>
                        <Col span={11} >
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem
                                    {...formItemLayout}
                                    label="处罚机构:"
                                    >
                                    <Input />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="处罚编号使用情况:"
                                    >
                                    <Row gutter={8}>
                                        <Col span={8}>
                                            <Input value='80/1000' className='number-situation' />
                                        </Col>
                                        <Col span={12} offset={4} >
                                            <Button style={{width:'80px'}} className='btn-normal' >导入</Button>
                                            <Button className='btn-normal' style={{width:'80px',marginLeft:'34px'}} >更新</Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="车辆类型显示方式:"
                                    >
                                    <Input />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="抓拍违法行为:"
                                    >
                                    <Input />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="处罚方式描述:"
                                    >
                                    <Input />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="处罚执行限定期限:"
                                    >
                                    <Input />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="处罚执行机构:"
                                    >
                                    <Input />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="法律依据:"
                                    >
                                    <TextArea placeholder="" autosize={{ minRows: 2, maxRows: 6 }} />
                                </FormItem>
                            </Form>
                        </Col>
                        <Col span={4} >
                            <div className='btn-wrapper'>
                                <Button className='btn-normal preview-ticket-btn' >预览罚单</Button>
                                <br />
                                <Button className='btn important-info-btn' style={{marginTop:'68px'}} >重置信息</Button>
                                <br />
                                <Button className='btn-normal save-change-btn' >保存修改</Button>
                            </div>
                        </Col>
                        <Col span={8} >
                           <div className='preview-ticket'>
                           </div>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default PunishSetting;