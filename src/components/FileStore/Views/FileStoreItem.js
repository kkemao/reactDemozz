import React, { Component } from 'react';
// import { Button, Icon, Select  } from 'antd';

class FileStoreItem extends Component {
    render() {
        const{ dataSource, choosenItemId, choosenItemInfo } = this.props;
        return(
            <div className={choosenItemId == dataSource.id?"file-item file-active":"file-item file-hover"} key={dataSource.id} onClick={choosenItemInfo.bind(this,dataSource.id)}>
                <div className="file-img-box">
                    <div className="img-borders file-img">
                        <img src={dataSource.imageUrl} />
                    </div>
                </div>
                <div className="file-info">
                    <p className="info-name">{dataSource.name}</p>
                    <p className="info-normal">电话：{dataSource.phone}</p>
                    <p className="info-normal">住址：{dataSource.location}</p>
                    <p className="info-normal">所在库：{dataSource.bankName}</p>
                </div>
            </div>
        )
    }
}

export default FileStoreItem;