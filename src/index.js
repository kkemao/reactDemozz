import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/zh-cn';      //全局设置时间、日期插件为中文模式
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import './styles/index.css';
import rootStore from './constants/rootStore';

import LoginContainer from './components/Login/LoginContainer';
import HomePageSecContainer from './components/HomePage/HomePageSecContainer';


import $IF from './utils/config';
import { getEnviroment } from './utils/global';
window.$IF = $IF;
window.$IF.env = getEnviroment($IF);

//react 缓存池
// import registerServiceWorker from './registerServiceWorker';
//全局设置moment中文模式
moment.locale('zh-cn');
console.log('rootStore', rootStore);
console.log('config', $IF);
console.log('process.env', process.env);
let baseName = '';
if (process && process.env && process.env.NODE_ENV === 'production') {
  console.log('生产环境 Router basename: ', process.env.PUBLIC_URL);
  baseName = process.env.PUBLIC_URL;
}

ReactDOM.render(
    <LocaleProvider locale={zh_CN}>
        <Provider store={rootStore}>
            <Router basename={baseName}>
                <div id="wrap">
                    <Route exact path="/" component={HomePageSecContainer} />
                    <Route exact path="/login" component={LoginContainer} />
                </div> 
            </Router>
        </Provider>
    </LocaleProvider>,
    document.getElementById('root')
);


// registerServiceWorker();