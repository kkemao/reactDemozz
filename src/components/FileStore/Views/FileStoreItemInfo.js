import React, { Component } from 'react';
import { Button } from 'antd';

class FileStoreItemInfo extends Component {
    
    componentWillMount(){
        let itemInfo = this.props.itemInfo
        let tempObj={
            bankId:itemInfo.bankId,
            cid:itemInfo.cid,
            times:itemInfo.times,
            phone:itemInfo.phone,
            location:itemInfo.location,
            note:itemInfo.note,
        }
        this.setState({
            origObj:tempObj
        });
    }
    resetInfo=(id)=>{
        this.refs.note.value = this.refs.note.defaultValue;
    }
    savingInfo=(id)=>{
        let obj={
            note:this.refs.note.value,
            // location:this.refs.location.value,
        }
        this.props.saveThisInfo(id,obj);
    }

    render() {
        const { itemInfo, doseEdit, editingInfo, cancelEditingInfo } = this.props;
        
        return(
            <div className="bottom-content">
                <div className="file-check-btn">
                    <span className='active-btn span-to-btn'>查看信息</span>
                    <span className='span-to-btn disable-span-to-btn'>在当前库新增</span>
                </div>
                <div className="check-infos">
                    <div className="info-img-div">
                        <div className="img-borders info-img">
                            <img src={itemInfo.imageUrl} />
                        </div>
                    </div>
                    <div className="info-text">
                        <div className="info-name">{itemInfo.name}</div>
                        <div className="info-div">
                            <span className="info-line">所在库：<span className="infos-text">{itemInfo.bankId}</span></span>
                            <span className="info-line">身份证号：<span className="infos-text">{itemInfo.cid}</span></span>
                            <span className="info-line">违规次数：<span className="infos-text">{itemInfo.times}</span></span>
                        </div>
                        <div className="info-div">
                            <span className="info-line">电话：<span className="infos-text">{itemInfo.phone}</span></span>
                            <span className="info-line">住址：<span className="infos-text">{itemInfo.location}</span></span>
                            {!doseEdit?(
                                <span className="info-line">备注：<span className="infos-text">{itemInfo.note}</span></span>
                            ):(
                                <span className="info-line">备注：<input className="inpuNormal" 
                                    defaultValue={itemInfo.note}
                                    ref="note"
                                /></span>
                            )} 
                        </div>
                    </div>
                    {!doseEdit?(
                        <div className="info-button">
                            <Button className="btnNormal" onClick={editingInfo}>编辑</Button>
                        </div>
                    ):(
                        <div className="info-button">
                            <Button className="btnNormal" onClick={this.savingInfo.bind(this,itemInfo.id)}>保存</Button>
                            <Button className="borderBtn"  onClick={this.resetInfo.bind(this,itemInfo.id)}>重置</Button>
                            <Button className="borderBtn" onClick={cancelEditingInfo}>取消</Button>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default FileStoreItemInfo;