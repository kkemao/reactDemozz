import React, { Component } from 'react';
import { Col, Input, Button, Table, Icon, Popconfirm, message} from 'antd';
import PropTypes from 'prop-types'

const InputGroup = Input.Group;
const msg = '你确定删除吗？';

function confirm() {
  message.info('删除成功！');
}

const columns = [{
    title: '警官姓名',
    dataIndex: 'name',
    key: 'name',
    width: '37%',
  }, {
    title: '账户级别',
    dataIndex: 'permission',
    key: 'permission',
    width: '36%',
    // render: (text, record) => (
    //     <span>
    //         <a href="javascript:;" className="ant-dropdown-link">
    //             More actions <Icon type="down" />
    //         </a>
    //     </span>
    // ),
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    
    render: (text, record) => (
        <span>
          <a className='manage-action' href="javascript:;">编辑</a>
          <i className='iStyle'>|</i>
          <Popconfirm placement="topLeft" title={msg} onConfirm={confirm} okText="确认" cancelText="取消">
            <a className='manage-action' href="javascript:;" >删除</a>
          </Popconfirm>
        </span>
    ),
   
  }];

const data = [];
for (let i = 0; i < 26; i++) {
    data.push({
        key: i,
        name: `吕思思 ${i}`,
        permission: '一级权限',
    });
}

class PersonalManage extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchText:'',
            loading: false,
            data: [],
            pagination: {pageSize:5}
        }
    }
    handleTableChange () {

    }
    render(){
        const state = this.state;
        return(
            <div className='setting person-manage'>
                <Icon className="close-icon" type="close-circle-o" onClick={this.props.handleClick}/>
                <h4 className="setting-title">人员管理</h4>
                <div>
                    <InputGroup size="large">
                        <Col span={12} offset={2}>
                            <Input placeholder='输入姓名查询人员' className="setting-input" />
                        </Col>
                        <Col span={8}>
                            <Button size='large' style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                                查询
                            </Button>
                        </Col>
                    </InputGroup>
                </div>
                <Table   
                    columns={columns}
                    loading={state.loading}
                    dataSource={data}
                    size="middle"
                    pagination={state.pagination}
                    onChange={this.handleTableChange}
                />
            </div>
        )
    }
}

export default PersonalManage;