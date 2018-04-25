import React from 'react';
import { Router, Route, Switch, Redirect, routerRedux } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import Authorized from './utils/Authorized';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';

import styles from './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/user" render={(props) => <UserLayout {...props} />} />
          <AuthorizedRoute
            path="/"
            render={(props) => <BasicLayout {...props} />}
            authority={['user']}
            redirectPath="/user"
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
