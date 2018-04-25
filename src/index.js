import 'babel-polyfill';
import dva from 'dva';
// import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import { message } from 'antd';
import FastClick from 'fastclick';
// import './g2';
import './rollbar';
// import browserHistory from 'history/createBrowserHistory';
import './index.less';
// 1. Initialize
const app = dva({
  // history: browserHistory(),
  onError(e) {
    if (e.type !== 'page') {
      message.error(e.message);
    }
  },
});

// 2. Plugins
// app.use({});
// app.use(createLoading())
// 3. Register global model
app.model(require('./models/global'));
app.model(require('./models/configSetting'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

window.onbeforeunload = function() {
  sessionStorage.setItem('oncefetch', true);
};

FastClick.attach(document.body);
