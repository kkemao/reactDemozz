import React, { Component } from 'react';
import {Cascader, Icon,Form, Row, Col, Input, Button, Select, message } from 'antd';
import PropTypes from 'prop-types'

// import './UserSetting.less'
const FormItem = Form.Item;
const Option = Select.Option;

const defaultProps = {
    account: '',
    password: '',
    permission: '',
    phone:'',
    mechanism: ''
  };
  const propTypes = {
    account: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    permission: PropTypes.string.isRequired,
    mechanism:PropTypes.string.isRequired
  }

  const options = [{
    value: 'oneLevel',
    label: '一级用户',
    children: [{
      value: 'zhangshan',
      label: '张三',
    },{
        value: '李四',
        label: '李四',
    }],
  }, {
    value: '超级用户',
    label: '超级用户',
    children: [{
      value: '戴局长',
      label: '戴局长',
    },{
        value: '李队长',
        label: '李队长',
    }],
  }];

  function onChange(value) {
    console.log(value);
  }
  const success = () => {
    message.success('添加人员成功！', 10);
  };

class AddAccount extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            inputType: 'text',
            confirmDirty: false,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            // callback()
            success();
          }
        });
    }


    handlePermissionChange () {
        console.log("权限改变")
    }
    handleFocus (e){
        e.target.type = 'password'
  
    }
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render(){
       const close =  this.props.handleClick;
       const { getFieldDecorator } = this.props.form;
       const formItemLayout = {
            labelCol: {
            xs: { span: 24 },
            sm: { span: 7 },
            color: 'red',
            },
            wrapperCol: {
            xs: { span: 24 },
            sm: { span: 11 },
            },
       };
        return(
            <div className="setting add-account ">
                <Icon className="close-icon" type="close-circle-o" onClick={close}/>
                <h4 className="setting-title">添加人员</h4>
                <Form autoComplete="off" layout='horizontal' className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                    <FormItem 
                        {...formItemLayout}
                        label='账号'
                    >
                        {getFieldDecorator('account', {
                            rules: [{ required: true,  message: '请输入账号' }],
                        })(
                            <Input type="text"  className="setting-input" placeholder="请输入账号" />
                        )}
                    </FormItem>   
                    <FormItem 
                        {...formItemLayout}
                        label='密码'
                    >
                         {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }],
                        })(
                            <Input type={this.state.inputType}  onFocus={this.handleFocus.bind(this)}  className="setting-input" placeholder="请输入密码" />
                        )}
                    </FormItem>               
                    <FormItem
                         {...formItemLayout}
                        label="权限"
                        >
                        {getFieldDecorator('permission', {
                            rules: [{ required: true, message: '请选择用户权限' }],
                        })(
                            <Cascader options={options} onChange={onChange} placeholder="请选择用户权限" />,
                        )}
                    </FormItem>
                    <FormItem
                         {...formItemLayout}
                            label="所属机构"
                        >
                        {getFieldDecorator('mechanism', {
                            rules: [{ required: true, message: '请选择所属机构'  }],
                        })(
                            <Select
                                placeholder="请选择所属机构"
                                onChange={this.handleMechanismChange}
                                >
                                <Option value="1">漳州市某某一大队</Option>
                                <Option value="2">漳州市某某二大队</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label='绑定手机'
                    >
                        <Input maxLength={11} className="setting-input"/>
                    </FormItem>
                    <Row className="top24">
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button  onClick={close}>取消</Button>
                            <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                                确认
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

AddAccount.defaultProps = defaultProps;
AddAccount.propTypes = propTypes;

const Account = Form.create()(AddAccount)

export default Account;  
