import React, { Component } from 'react';
import { Select, DatePicker, Button, Table, Icon} from 'antd';
import moment from 'moment';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

function onChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
}

const columns = [{
    title: '修改路径',
    dataIndex: 'path',
    key: 'path',
    width: '30%',
  }, {
    title: '修改内容',
    dataIndex: 'content',
    key: 'content',
    width: '36%',
  }, {
    title: '修改人',
    dataIndex: 'people',
    key: 'people',
  }, {
    title: '修改时间',
    dataIndex: 'time',
    key: 'time',
  }];

const data = [];
for (let i = 0; i < 26; i++) {
    data.push({
        key: i,
        path: `个人设置--人员管理 ${i}`,
        content: '修改账户权限',
        people: '高天浩',
        time: '2018-08-02 12:21:54'
    });
}


class OperationRecord extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            data: [],
            pagination: {pageSize:5}
        }
    }
    handleSelectChange = (value) => {
        console.log('选择',value);
    }

    render(){
        const state = this.state;
        return(
            <div className='setting operation-record'>
                <Icon className="close-icon" type="close-circle-o" onClick={this.props.handleClick}/>
                <h4 className="setting-title">操作记录</h4>
                <div className='filter-wrapper'>
                    <span className='filter-item'>选择账户:</span>
                    <Select defaultValue="1" className="account"  onChange={this.handleSelectChange}>
                        <Option value="1">全部账户</Option>
                        <Option value="2">一级账户</Option>
                        <Option value="3">二级账户</Option>
                    </Select>
                    <span className='filter-item time-choses'>选择时间:</span>
                    <RangePicker
                        ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
                        showTime
                        format="YYYY/MM/DD HH:mm:ss"
                        onChange={onChange}
                    />
                    <Button className="btnNormal seearch-btn">查询</Button>
                </div>
                <div>
                    <Table  
                        columns={columns}
                        loading={state.loading}
                        dataSource={data}
                        pagination={state.pagination}
                        onChange={this.handleTableChange}
                    />
                </div>
                
            </div>
        )
    }
}

export default OperationRecord;