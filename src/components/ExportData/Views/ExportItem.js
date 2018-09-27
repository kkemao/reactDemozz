import React,{Component} from 'react';

class ExportItem extends Component {
    constructor(props){
        super(props)
        this.state = {
            checked: props.checked,
            name: props.name,
            text:props.text
        }
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps,prevProps){
        if(nextProps.checked != prevProps.checked){
            this.setState({
                checked: nextProps.checked
            })
        }
    }
    handleChange(){
        const { checked,name } = this.state
        this.setState({
          checked: !checked
        },function(){
          this.props.handleItemChange({ name: name, checked: !checked });
        })
    }
    // handleClick(){
    //     console.log('Q1')
    // }
    render(){
        const {checked,name,text} = this.state
        return(
            <label className="checkbox-item">
                <input type="checkbox" name={name} checked={checked} onChange={this.handleChange} disabled/>
                <span>{text}</span>
            </label>
        )
    }
}
export default ExportItem