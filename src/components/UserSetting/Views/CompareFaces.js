import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';



function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
class CompareFaces extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            result:false
        }
        this.handleReferenceResult = this.handleReferenceResult.bind(this)
    }
    handleChange1 = (info) => {
        getBase64(info.file.originFileObj, imageUrl1 => this.setState({
            imageUrl1,
            loading: false,
        }))
    }
    handleChange2 = (info) => {
        getBase64(info.file.originFileObj, imageUrl2 => this.setState({
            imageUrl2,
            loading: false,
        }))
    }
    
    handleReferenceResult(){
        this.setState({result:true})
    }
    render(){
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传照片</div>
            </div>
        );
        const {imageUrl1,imageUrl2,result} = this.state;

        return(
            <div className="comparefaces">
                <Icon className="close-icon" type="close-circle-o" onClick={this.props.handleClick}/>
                <h1 className='header'>人脸对比</h1>
                <div className="clearfix">
                    <div className="contentLeft">
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            onChange={this.handleChange1}
                            >
                            {imageUrl1 ? <img src={imageUrl1} alt="avatar" /> : uploadButton}
                        </Upload>
                    </div>
                    <div className="contentRight">
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            onChange={this.handleChange2}
                            >
                            {imageUrl2 ? <img src={imageUrl2} alt="avatar" /> : uploadButton}
                        </Upload>
                    </div>
                </div>
                <p>
                    {result ?  (<span>相似度{'xx.x%'}，同一个人的概率为{'xx.x%'}</span> ) : null}
                </p>
                <div className="footerBtn">
                    <button className="cancel" onClick={this.props.handleClick} >取消</button>
                    <button className="sure" onClick={this.handleReferenceResult}>对比</button>
                </div>
            </div>
        )
    }
}

export default CompareFaces;