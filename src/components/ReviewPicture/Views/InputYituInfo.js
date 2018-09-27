import React, { Component } from 'react';
import {Upload, Icon,Form, Row, Col, Input, Button, Select, message } from 'antd';
import PropTypes from 'prop-types'
import './InputYituInfo.less'
const FormItem = Form.Item;

const defaultProps = {
    name: '',
    ID: '',
    phone: '',
    address:''
  };
const propTypes = {
    name: PropTypes.string.isRequired,
    ID: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
}
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
// const success = () => {
//     message.success('输入依图信息成功！', 10);
// };


class InputYituInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            inputType: 'text',
            confirmDirty: false,
        };
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            this.success();
          }
        });
    }
    handleUploadImg = (info) => {
        getBase64(info.file.originFileObj, imageUrl1 => this.setState({
            imageUrl1,
            loading: false,
        }))
    }
    success = () => {
        message.success('输入依图信息成功！', 10);
        this.props.handleClosePop()
    };

    render(){
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
        const handleClosePop = this.props.handleClosePop;
        const {imageUrl1} = this.state;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传照片</div>
            </div>
        );
        return(
            <div>
                <div className='bg'></div>
                <div className="setting input-wrap ">
                    <Icon className="close-icon" type="close-circle-o" onClick={handleClosePop}/>
                    <h4 className="title">输入依图信息</h4>
                    <Form autoComplete="off" layout='horizontal'   onSubmit={this.handleSubmit}>
                        <div className='upload-wrapper'>
                            <Upload 
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    onChange={this.handleUploadImg}
                            >
                                {imageUrl1 ? <img src={imageUrl1} alt="avatar" /> : uploadButton}
                            </Upload>
                        </div>
                        <FormItem 
                            {...formItemLayout}
                            label='姓名'
                        >
                            {getFieldDecorator('name', {
                                rules: [{ required: true,  message: '请输入姓名' }],
                            })(
                                <Input  className="setting-input" />
                            )}
                        </FormItem>   
                        <FormItem 
                            {...formItemLayout}
                            label='身份证号'
                        >
                            {getFieldDecorator('ID', {
                                rules: [{ required: true,  message: '请输入身份证号' }],
                            })(
                                <Input className="setting-input" />
                            )}
                        </FormItem>               
                        <FormItem
                            {...formItemLayout}
                            label="联系电话"
                        >
                            {getFieldDecorator('phone', {
                                rules: [{ required: true,  message: '请输入联系电话' }],
                            })(
                                <Input maxLength={11} className="setting-input" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="家庭住址"
                            >
                            {getFieldDecorator('address', {
                                rules: [{ required: true,  message: '请输入家庭住址' }],
                            })(
                                <Input maxLength={11} className="setting-input" />
                            )}
                        </FormItem>
                        <Row>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <Button  onClick={handleClosePop}>取消</Button>
                                <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit"
                                    onClick={this.handleSubmit}
                                >
                                    确认
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

InputYituInfo.defaultProps = defaultProps;
InputYituInfo.propTypes = propTypes;

const YituInfo = Form.create()(InputYituInfo)

export default YituInfo;  
