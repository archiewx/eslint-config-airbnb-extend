import React from 'react';
import { Link } from 'dva/router';
import {Button,Icon} from 'antd';
import DocumentTitle from 'react-document-title';
import Exception from '../components/antd-pro/Exception';
import GlobalFooter from '../components/antd-pro/GlobalFooter';
import styles from './NoTokenLayout.less'

const copyright = <div>Copyright <Icon type="copyright" /> 2018 </div>;

class NoTokenLayout extends React.PureComponent {
  getPageTitle() {
    let title = '多客';
    return title;
  }

  handleClick = () => {
    sessionStorage.clear()
  }

  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div>
          <Exception title='401' style={{ minHeight: 500, height: 600 }} desc={<div>抱歉，你无权访问该页面</div>}  actions = {<Button type='primary' onClick={this.handleClick}><Link to='/user/login' >返回扫码</Link></Button>} />
          <GlobalFooter className={styles.footer} copyright={copyright} />
        </div>
      </DocumentTitle>
    )
  }
}


export default NoTokenLayout;