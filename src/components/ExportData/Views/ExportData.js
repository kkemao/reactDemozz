import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Icon,DatePicker,Button,Checkbox    } from 'antd';
import ExportItem from './ExportItem'
import './ExportData.less';
class ExportData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hideNotice: true,
            data:[
                {name:'internet',checked:false,text:'将违法数据更新到互联网平台'},
                {name:'SMS',checked:false,text:'将违法数据更新到短信分发系统'},
                {name:'platform',checked:false,text:'将违法数据更新到邮政平台'}
            ],
            checkedAll: false,
            btnStyle:true,
            disabled:true,
            startDay:null,      //过滤项 开始时间
            endDay:null ,
            noTime:true
        };
        this.handleAllChange = this.handleAllChange.bind(this);
        this.handleItemChange = this.handleItemChange.bind(this);
    }
    componentWillMount(){
       
    }
    handleAllChange(params) {
        const { checkedAll,data } = this.state;
        data.map((item) => item.checked = !checkedAll)
        const filtered = data.every((item) => item.checked )
        if(filtered){
            this.setState({
                disabled:false,
                btnStyle:false
            })
        } else {
            this.setState({
                disabled:true,
                btnStyle:true
            })
        }
        this.setState({
            checkedAll: !checkedAll,
            data: data
        });
        console.log(this.state)
    }
    handleItemChange(ckitem){
        const data = this.state.data;
        console.log(ckitem)
        data.map((item,index) => {
          if(item.name === ckitem.name){
            return item.checked = ckitem.checked
          }
        })
        const checkedAll = data.every((item,index) => item.checked )
        const btnStyle = data.some((item) => item.checked)
        if(btnStyle){
            this.setState({
                btnStyle:false,
                disabled:false
            })
        } else {
            this.setState({
                btnStyle:true,
                disabled:true
            })
        }
        
        this.setState({ 
          data: data,
          checkedAll: checkedAll
        })
      }
      renderList(){
        return this.state.data.map((item,index) => {
          return <ExportItem {...item} key={index} handleItemChange={this.handleItemChange}/>
        })
      }
    onTimeChange=(date, dateString)=>{
        console.log(date,dateString)
        this.setState({
            startDay:dateString[0],      
            endDay:dateString[1] ,
            noTime:dateString.length?false:true
        });
    }
    
    render(){
        const {showFlag,showDownBtn,btnStyle, noTime} = this.state;
        const {showExportModule } = this.props;
        const {RangePicker} = DatePicker
        return(
            <div>
                <div className='export-bg' ></div>
                <div className="export-box">
                    <Icon className="close-icon" type="close-circle-o" onClick={showExportModule}/>
                    <h1 className="dataTitle">数据分发</h1>
                    <div className="timeSeletcBox"> 
                        <span className="promptMessage">将违法数据表下载到本地</span>
                        <div>
                            <RangePicker className="borders timeMargin" size="large" onChange={this.onTimeChange}/>
                        </div>
                        <div className="btnBox">
                            <Button className="btnSelectColor" disabled={noTime}>下载表格</Button>
                            <Button className="btnSelectColor" disabled={noTime}>打印罚单</Button>
                        </div>
                    </div>  
                    <div className="dataSelectItem">
                        {this.renderList()}
                    </div>
                    <div className="formFoorter">
                        <Checkbox className="footerBtn" checked={this.state.checkedAll} onChange={this.handleAllChange.bind(this)} disabled>全选</Checkbox>
                        <Button className={btnStyle ? 'btnDefaultColor':'btnSelectColor'} disabled={this.state.disabled} >执行</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ExportData;