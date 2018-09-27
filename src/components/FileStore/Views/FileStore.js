import React, { Component } from 'react';
import { Button, Icon, Select, Pagination } from 'antd';
import ErrorBoundary from '../../Error/ErrorBoundary';
import FileStoreItem from './FileStoreItem';
import FileStoreItemInfo from './FileStoreItemInfo';

import { chunk, compareArr } from '../../../utils/global';

//zml模拟数据
import FileStoreItemMock from '../Mock/FileStoreItem.json';

import './FileStore.less';

const Option = Select.Option;

class FileStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bankId:0,      //过滤项-库
            gender:0,       //过滤项-性别
            age:0,         //过滤项-年龄
            userRole:0,     //过滤项-创建者
            page:1,
            pageLength:FileStoreItemMock.length,
            fileItemData:[],     //循环渲染的data
            choosenItemId:-1,   //当前要查看的item的id
            doseEdit:false,
            mockChoosenItem:{},    //ZML模拟选中查看的数据
            mockDataChunk:chunk(FileStoreItemMock,9),     //ZML模拟切分模拟data数据
            filterAct:'time'
        }
    }
    componentWillMount(){
        this.setState({
            fileItemData:this.state.mockDataChunk[0]
        })
    }
    choosenItemInfo = (thisId)=>{
        this.setState({
            choosenItemId:thisId,
            doseEdit:false      //ZML模拟
        });
        //ZML模拟凭借id查询信息
        FileStoreItemMock.forEach((d,i)=>{
            if(d.id == thisId){
                this.setState({
                    mockChoosenItem:d
                })
            }
        })
    }
    pageChange=(page)=>{
        this.setState({
            page:page,
            fileItemData:this.state.mockDataChunk[page-1]       //ZML模拟分页的请求
        })
    }
    prePage =()=>{
        let page=this.state.page;
        if(page==1) return;
        console.log(this.state.mockDataChunk)
        this.setState({
            page:page-1,
            fileItemData:this.state.mockDataChunk[page-2]       //ZML模拟分页的请求
        });
    }
    nextPage =()=>{
        let page=this.state.page;
        let limitLen = this.state.mockDataChunk.length;
        if(page == limitLen) return;
        this.setState({
            page:page+1,
            fileItemData:this.state.mockDataChunk[page]       //ZML模拟分页的请求
        });
    }
    editingInfo=()=>{
        this.setState({
            doseEdit:true
        })
    }
    cancelEditingInfo=()=>{
        this.setState({
            doseEdit:false
        })
    }
    //过滤项变更--库
    changeLibrary=(value)=>{
        this.setState({bankId:value});
    }
    //过滤项变更--性别
    changeGender=(value)=>{
        this.setState({gender:value});
    }
    //过滤项变更--性别
    changeAge=(value)=>{
        this.setState({age:value});
    }
    //过滤项变更--性别
    changeUser=(value)=>{
        this.setState({userRole:value});
    }
    fileSort=(type)=>{
        let mockData = [];
        let mockDataChunk = this.state.mockDataChunk;
        if(mockDataChunk.length>1){
            for(let i =0;i<mockDataChunk.length;i++){
                mockData=mockData.concat(mockDataChunk[i])
            }
        }else if(mockDataChunk.length == 1){
            mockData=mockData.concat(...mockDataChunk)
        }
        this.setState({
            choosenItemId:-1,
            doseEdit:false,
            mockChoosenItem:{},
            page:1,
            pageLength:mockData.length
        })
        switch(type){
            case 'time':
                this.setState({
                    mockDataChunk:chunk(mockData,9),
                    fileItemData:chunk(mockData,9)[0],
                    filterAct:'time'
                })
                break;
            case 'bankId':
                let temArr=[];
                mockData.forEach((d,i)=>{
                    temArr.push(d);
                });
                temArr.sort(compareArr(['bankId']));
                this.setState({
                    mockDataChunk:chunk(temArr,9),
                    fileItemData:chunk(temArr,9)[0],
                    filterAct:'bankId'
                })
                break;
            case 'letter':
                let temArrName=[];
                mockData.forEach((d,i)=>{
                    temArrName.push(d);
                });
                temArrName.sort(compareArr(['name']));
                this.setState({
                    mockDataChunk:chunk(temArrName,9),
                    fileItemData:chunk(temArrName,9)[0],
                    filterAct:'letter'
                })
                break;
            default:
                this.setState({
                    mockDataChunk:chunk(FileStoreItemMock,9),
                    fileItemData:chunk(FileStoreItemMock,9)[0],
                    filterAct:'time'
                })
            break;
        }
    }
    //过滤项查询
    queryList=()=>{
        const{ bankId, gender, age, userRole } = this.state;
        let recArr=[];
        FileStoreItemMock.forEach((d,i)=>{
            if((bankId!=0  ? d.bankId == bankId:true)&&(gender!=0  ? d.gender==gender : true)&&(userRole!=0 ? userRole==d.userRole:true)){
                recArr.push(d);
            }
            
        });
        //如果所有都没有
        if(bankId==0 && gender==0 && age==0 && userRole==0){
            recArr=FileStoreItemMock
        }
        this.setState({
            mockDataChunk:chunk(recArr,9),
            fileItemData:recArr.length ?chunk(recArr,9)[0]:[],
            pageLength:recArr.length,       //分页的总数目 ZML模拟长度
            page:1,
            filterAct:'time'
        });
    }
    //编辑后保存按钮，ZML模拟更改本地数据
    saveThisInfo = (id,obj)=>{
        //ZML模拟凭借id保存信息
        FileStoreItemMock.forEach((d,i)=>{
            if(d.id == id){
                d.note = obj.note;
            }
        });
       this.setState({
            doseEdit:false,
        });
    }
    render() {
        const{ page, choosenItemId, mockChoosenItem, doseEdit, pageLength, filterAct } =this.state;
        let fileArr = [];let bankName='';
        this.state.fileItemData.forEach((item, i) => {

            switch(item.bankId){
                case 1:
                    item.bankName='已罚库';
                    break;
                case 2:
                    item.bankName='常住人口库';
                    break;
                case 3:
                    item.bankName='白名单库';
                    break;
                default:
                    item.bankName=item.bankId
            }
            fileArr.push(
                <FileStoreItem
                    key={item.id}
                    dataSource={item}
                    choosenItemInfo={this.choosenItemInfo}
                    choosenItemId={choosenItemId}
                />
            );
        });
        return(
            <ErrorBoundary>
                <div className="center-div">
                    <div className="file-filter">
                        <Button className="btnNormal" disabled><Icon type="plus" />新增库</Button>
                        <span>选择库：</span>
                        <Select 
                            className="filter-select mr10" 
                            defaultValue="0"
                            onChange={this.changeLibrary}
                        >
                            <Option value="0">所有库</Option>
                            <Option value="1">已罚库</Option>
                            <Option value="2">常住人口库</Option>
                            <Option value="3">白名单库</Option>
                        </Select>
                        <span>筛选条件：</span>
                        <Select 
                            className="filter-select mr10" 
                            defaultValue="0"
                            onChange={this.changeGender}
                        >
                            <Option value='0'>性别不限</Option>
                            <Option value="1">男</Option>
                            <Option value="2">女</Option>
                        </Select>
                        <Select 
                            className="filter-select mr10" 
                            defaultValue="0"
                            onChange={this.changeAge}
                            disabled
                        >
                            <Option value="0">年龄不限</Option>
                            <Option value="1">青年</Option>
                            <Option value="2">中年</Option>
                            <Option value="3">老年</Option>
                        </Select>
                        <Select 
                            className="filter-select mr10" 
                            defaultValue="0"
                            onChange={this.changeUser}
                        >
                            <Option value="0">创建者不限</Option>
                            <Option value="1">超级管理员</Option>
                            <Option value="2">中级管理员</Option>
                        </Select>
                        <Button className="btnNormal" onClick={this.queryList}>查询</Button>
                        <div className="sort-span">
                            <span className={filterAct == 'time'?"sort-text sort-act":"sort-text"} onClick={this.fileSort.bind(this,'time')}>最近录入</span>
                            <span className="sort-sp"></span>
                            <span className={filterAct == 'bankId'?"sort-text sort-act":"sort-text"} onClick={this.fileSort.bind(this,'bankId')}>库顺序</span>
                            <span className="sort-sp"></span>
                            <span className={filterAct == 'letter'?"sort-text sort-act":"sort-text"} onClick={this.fileSort.bind(this,'letter')}>姓名首字母</span>
                        </div>
                    </div>
                    <div className="item-lists">
                        <div className="item-arrow arrow-left">
                            <Icon type="left-circle-o" onClick={this.prePage}/>
                        </div>
                        <div className="item-content">
                            {fileArr}
                        </div>
                        <div className="item-arrow arrow-right">
                            <Icon type="right-circle-o" onClick={this.nextPage} />
                        </div>
                        <div className="items-pagination">
                            <Pagination 
                                defaultCurrent={1} 
                                current={page}
                                pageSize={9}
                                total={pageLength} 
                                onChange={this.pageChange}
                            />
                        </div>
                    </div>
                    <div className="file-bottom">
                        {choosenItemId != -1 && (
                            <FileStoreItemInfo
                                itemInfo={mockChoosenItem}
                                doseEdit={doseEdit}
                                editingInfo={this.editingInfo}
                                saveThisInfo={this.saveThisInfo}
                                cancelEditingInfo={this.cancelEditingInfo}
                            />
                        )}
                    </div>
                </div>
            </ErrorBoundary>
        )
    }
}

export default FileStore;