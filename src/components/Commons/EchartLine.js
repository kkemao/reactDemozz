import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入K线图
import  'echarts/lib/chart/line';
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
class Echartsline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {}
        }
    }    
    componentDidMount() {
        setTimeout(()=>{
            this.renderEchart(this.props.option, this.props.id);
        },100);
        window.addEventListener('resize', this.resizeEchart);
    }
    componentWillReceiveProps(nextProps) {
        setTimeout(()=>{
            this.renderEchart(nextProps.option, nextProps.id);
        },100);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeEchart);
    }
    renderEchart = (option, id) => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(id));
        // 绘制图表
        myChart.setOption(option);
    }
    resizeEchart = ()=>{
        var myChart = echarts.init(document.getElementById(this.props.id));
        myChart.resize();
    }
    render() {
        return (
            <div id={this.props.id} style={{ width: '100%', height:200}}></div>
        );
    }
}
export default Echartsline;