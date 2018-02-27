import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider,Switch} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './CustomerManage.less'
@connect(state => ({
  configSetting:state.configSetting
}))
export default class CustomerManage extends PureComponent {

  handleSwitchShopShareCustomer = () => {
    this.props.dispatch({type:'configSetting/switchShopShareCustomer',payload:this.props.configSetting.shopShareCustomer == 1 ? 0 : 1}).then(()=>{
      this.props.dispatch({type:'configSetting/getConfigSetting'})
    })
  }

  render() {
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <div><span className={styles.spanTitle}>店铺共享客户</span><Switch onClick={this.handleSwitchShopShareCustomer} checked={!!this.props.configSetting.shopShareCustomer} className={styles.switchPosition} checkedChildren="开" unCheckedChildren="关" /></div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
