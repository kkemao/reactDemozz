import React, { Component } from 'react';
import { Form, Row, Col, Input, Button,Icon } from 'antd';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
class ChangePass extends Component {
    constructor(props){
        super(props)
        this.state = {
            isVerification : false,
            modify : false
        }
        this.handleChangeStutas = this.handleChangeStutas.bind(this)
        this.handleModifyMessage = this.handleModifyMessage.bind(this)
        this.handleCancle = this.handleCancle.bind(this)
        this.handleConfirmBlur = this.handleConfirmBlur.bind(this)
        this.handlePassword = this.handlePassword.bind(this)
    }
    handleChangeStutas(){
        this.setState({
            isVerification:true
        })
    }
    handleModifyMessage(){
        this.setState({modify:true})
    }
    handleAdd () {
        console.log("提交")
    }
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('您输入的两个密码不一致!');
        } else {
          callback();
        }
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    handleCancle(e){
        // e.preventDefault();
         console.log("取消")
    }
    handlePassword(e){
        console.log(e.target.value)
    }
    render(){
        const { isVerification,modify } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
                labelCol: {
                xs: { span: 15 },
                sm: { span: 7 },
                color: 'red',
                },
                wrapperCol: {
                xs: { span: 10 },
                sm: { span: 8 },
                },
        };
        return(
            <div className="changepass">
                <Icon className="close-icon" type="close-circle-o" onClick={this.props.handleClick}/>
                <h1 className='header'>修改账户</h1>
                {!modify?(
                    <div className="peopleData">
                        <p><span className="DataName">当前账户：</span><span className="Datas">Daa</span></p>
                        <p><span className="DataName">昵称：</span><span className="Datas">巡警</span></p>
                        {isVerification?(
                        <div>
                            <p className="prompt">请输入密码</p>
                            <p className="iptBox"><input type="text" onChange={this.handlePassword}/></p>
                            <p className="verification"><span className="span-to-btn btn-card active-btn" onClick={this.handleModifyMessage}>验证</span></p>
                        </div>
                        ):(<p className="peopleDataBtn"><span className="span-to-btn btn-card active-btn" onClick={this.handleChangeStutas}>修改信息</span></p>)}
                    </div>
                ):(
                    <div className="peopleData">
                        <p><span className="DataName">当前账户：</span><span className="Datas">Daa</span></p>
                        <Form autoComplete="off" layout='horizontal' className="ant-advanced-search-form" onSubmit={this.handleAdd}>
                        <FormItem 
                        {...formItemLayout}
                        label='昵称'
                    >
                        {getFieldDecorator('account', {
                            rules: [{ required: true }],
                        })(
                            <Input type="text"  className="setting-input" />
                        )}
                        </FormItem> 
                        <FormItem
                            {...formItemLayout}
                            label="密码"
                            >
                            {getFieldDecorator('password', {
                                rules: [{
                                required: true, message: '请输入您的密码！',
                                }, {
                                validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input type="password" />
                            )}
                            </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="再次输入新密码"
                            >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                required: true, message: '请再次输入您的密码！',
                                }, {
                                validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                            </FormItem>
                        <Row>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button onClick={this.handleCancle}>取消</Button>
                            <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">确认</Button>
                        </Col>
                        </Row>
                        </Form>
                    </div>
                )}
            </div>
        )
    }
}
const ModifyAccount = Form.create()(ChangePass)
export default ModifyAccount;