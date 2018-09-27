import React, { Component } from 'react';
import { Input, Checkbox, Select } from 'antd';

const Option = Select.Option;
class ChoiceTabs extends Component {
    constructor(props){
        super(props)
        this.state = {
            changeValue:{},
            errorId:'',
            isPhoneNumber:true,
            judgmentBtn:{}
        };
    }
    componentWillReceiveProps(nextPorps){
        let notPassArr = nextPorps.notPassArr;
        let reviewingId = nextPorps.reviewingId;
        this.setState({
            phoneNumber: notPassArr.indexOf(reviewingId)!=-1 ?false:true
        })
    }
    changePhone=(e,id)=>{
        e.stopPropagation();
        let reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        let testReg = reg.test(e.target.value);
        if(!testReg){
            this.setState({
                isPhoneNumber:false,
                judgmentBtn:{
                    id:id,
                    btnOk:false
                }
            })
        } else {
            this.setState({
                isPhoneNumber:true,
                judgmentBtn:{
                    id:id,
                    btnOk:true
                }
            })
        }
        const { saveNotPassPhone} =this.props;
        !testReg?saveNotPassPhone(id,'save'):saveNotPassPhone(id,'remove');
        this.setState({
            changeValue:{
                id:id,
                value:e.target.value
            },
            errorId:!testReg?id:''
        })
    }
    changeItem(id){
        this.setState({isPhoneNumber:true})
        if(id == this.state.judgmentBtn.id && !this.state.judgmentBtn.btnOk){
            this.setState({isPhoneNumber:false})
        }
    }
    render(){
        const{changeRoute, dataSource, btnSkip, btnReset, reviewingChoosen, reviewingId, btnOk, btnRemove, savePhoneChange } =this.props;
        const{changeValue, errorId,isPhoneNumber} = this.state;
        let choiceDivs = [];
        dataSource.forEach((d,i)=>{
            choiceDivs.push(
                <div key={d.id} data-id={d.id} className="tabs-div" onClick={this.changeItem.bind(this,d.id)}>
                    <div className={d.id==reviewingId?"tabs-card acive-tabs":"tabs-card"} onClick={reviewingChoosen.bind(this,d.id)}>
                        <div className="tabs-card-img img-borders">
                            <img className="hasborder" src={d.imageUrl} alt='相似人员'/>
                        </div>
                        {d.id==reviewingId && (<span className="icon_choosen"></span>)}
                        <div className="tabs-data">
                            <p className="tabs-card-threshold">相似度：<span>{d.threhold.toFixed(2)*100+'%'}</span>
                            </p>
                            <p className="tabs-card-name">
                                <span className="tabs-left">姓名:</span>
                                <span className="colorf tabs-right">{d.name}</span>
                            </p>
                            <p className="tabs-card-times">
                                <span className="tabs-left">违规次数:</span>
                                <span className="colorf tabs-right">{d.times}次</span>
                            </p>
                            <p className="tabs-card-times">
                                <span className="tabs-left">联系方式:</span>
                                <span className="colorf tabs-right">
                                    <Input className={errorId ==d.id?"tabs-phone tabs-phone-err":"tabs-phone"}
                                         value={changeValue.id==d.id?changeValue.value:d.phone} 
                                         onChange={(e)=>{
                                            this.changePhone(e,d.id)
                                        }}
                                        maxLength="11"
                                    />
                                    <span className="tabs-phone-icon"
                                        onClick={savePhoneChange.bind(this,changeValue)}
                                     ></span>
                                </span>
                            </p>
                            <p className="tabs-card-times">
                                <span className="tabs-left">电话确认:</span>
                                <span className="colorf tabs-right">
                                    已确认 <Checkbox defaultChecked={false} />
                                </span>
                            </p>
                            <div className="tabs-card-times tabs-types">
                                <span className="tabs-left">违法类型:</span>
                                <span className="colorf tabs-right">
                                    <Select 
                                        className="filter-select" 
                                        defaultValue="--请选择--"
                                    >
                                        <Option value="0">行人闯红灯</Option>
                                        <Option value="1">非机动车违法上道路行驶</Option>
                                        <Option value="2">摩托车占道行驶</Option>
                                    </Select>
                                </span>
                            </div>
                        </div>
                    </div>
                    {i != dataSource.length-1 && (
                        <div className="tabs-spea">
                            {/* <div className="tabs-line"></div>
                            <div className="tabs-line"></div> */}
                        </div>
                    )}
                </div>
            )
        })

        return(
            <div className="review-tabs">
                <div className="tabs-card-lists">
                    {choiceDivs}
                </div>

                <div className="tabs-btns">
                    {reviewingId ==-1?(
                        <div className="tabs-btns-skipt tabs-normal"
                            onClick={btnSkip}
                        ><span className="tabs-icon icon-skip"></span>下一个</div>
                    ):(
                        // <div className="tabs-btns-ok tabs-normal"
                        <div className={isPhoneNumber?"tabs-btns-ok tabs-normal":"tabs-btn-notOk tabs-normal"}
                            onClick={btnOk}
                        ><span className="tabs-icon icon-ok"></span>确定</div>
                    )}
                    {reviewingId ==-1?(
                        <div className="tabs-btns-remove tabs-normal" onClick={btnRemove}><span className="tabs-icon icon-remove"></span>删除</div>
                    ):(
                        <div className="tabs-btns-reset tabs-normal" onClick={btnReset}><span className="tabs-icon icon-reset"></span>重置</div>
                    )}
                    <div className="tabs-btns-close tabs-normal" onClick={changeRoute.bind(this,'HomePage')}><span className="tabs-icon icon-close"></span>返回首页</div>
                </div>
            </div>
        )
    }
}

export default ChoiceTabs;