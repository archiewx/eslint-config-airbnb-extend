import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider, Switch, Modal } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import breadCrumbList from '../../../../common/breadCrumbList';
import DuokeSwitch from '../../../../components/DuokeSwitch';
import styles from './CustomerManage.less';
@connect(state => ({
  configSetting: state.configSetting,
}))
export default class CustomerManage extends PureComponent {
  handleSwitchShopShareCustomer = () => {
    this.props.dispatch({ type: 'configSetting/switchShopShareCustomer', payload: this.props.configSetting.shopShareCustomer == 1 ? 0 : 1 }).then(() => {
      this.props.dispatch({ type: 'configSetting/getConfigSetting' });
    }).catch(()=>{
      message.error('更改失败')
    });
  }

  handleConfirm = () => {
    Modal.confirm({
      title: '确认更改店铺共享客户策略',
      onOk: () => {
        this.handleSwitchShopShareCustomer();
      },
    });
  }

  render() {
    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)}>
        <Card bordered={false}>
          <DuokeSwitch title="店铺共享客户" onClick={this.handleConfirm} checked={!!this.props.configSetting.shopShareCustomer} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
