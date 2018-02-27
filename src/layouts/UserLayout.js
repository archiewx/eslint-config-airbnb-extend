import React from 'react';
import { Link, Route,Redirect,Switch } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/antd-pro/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import duokeLogo from '../assets/duoke_logo.png'
import { getRoutes } from '../utils/utils';

const links = [{
  title: '帮助',
  href: '',
}, {
  title: '隐私',
  href: '',
}, {
  title: '条款',
  href: '',
}];

const copyright = <div>Copyright <Icon type="copyright" /> 2018</div>;

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '多客';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Ant Design Pro`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={duokeLogo} />
              </Link>
            </div>
            <div className={styles.desc}></div>
          </div>
          <Switch>
            {
              getRoutes(match.path, routerData).map(item =>
                (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                )
              )
            }
            <Redirect exact from="/user" to="/user/login" />
          </Switch>
          <GlobalFooter className={styles.footer} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
