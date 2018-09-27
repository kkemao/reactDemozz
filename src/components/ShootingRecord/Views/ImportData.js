import React, { Component } from 'react';
import {Upload, Icon,Form, Row, Col, Input, Button, Select } from 'antd';
import './ImportData.less'

class ImportData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: '',
            loading: false,
            inputType: 'text',
            confirmDirty: false,
        };
    }

    handleCancle(e){
       // e.preventDefault();
        console.log("取消")
    }
    handlePermissionChange () {
        console.log("权限改变")
    }
    handleAdd () {
        console.log("提交")
    }

    handleUpload = (info) => {
        this.setState({
            fileName:info.fileList[0].name
        })
    
        console.log(info.fileList[0].name)
    }

    render(){
        const handleClosePop = this.props.handleClosePop;
        const state = this.state;
        return(
            <div>
            <div className="setting input-wrap ">
                <Icon className="close-icon" type="close-circle-o" onClick={handleClosePop}/>
                <h4 className="title">添加照片</h4>
                <Row>
                    <Col span={20} offset={4}  style={{ textAlign: 'left' }}>
                        <div style={{marginTop:'20px',color:' #BFBFBF' }}>
                            <span>1、点击</span><a href='javascript:;'>下载Excel模板</a>
                        </div>
                        <div style={{marginTop:'20px',color:' #BFBFBF' }}> 
                            <span>2、按照模板的格式把人员照片压缩成zip压缩包，上传zip压缩包</span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={14} offset={4} style={{ textAlign: 'left',marginTop:'40px' }}>
                        <Input value={state.fileName} readOnly className="setting-input" /> 
                    </Col>
                    <Col span={5} style={{ textAlign: 'center',marginTop:'40px',marginLeft:'-28px' }}>
                        <Upload  
                            showUploadList={false}
                            onChange={this.handleUpload}
                        >
                            <Button className='btn-normal'>
                                    浏览
                            </Button>
                        </Upload>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'center',marginTop:'80px' }}>
                        <Button onClick={handleClosePop}>取消</Button>
                        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                            确认
                        </Button>
                    </Col>
                </Row>
            </div>
            <div className="layerPop"></div>
            </div>
        )
    }
}

export default ImportData;  
