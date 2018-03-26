import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Divider, Modal } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './GoodsAttribute.less';
import breadCrumbList from '../../../../common/breadCrumbList';
import DuokeSwitch from '../../../../components/DuokeSwitch';
@connect(state => ({
  configSetting: state.configSetting,
}))
export default class GoodsAttribute extends PureComponent {

  // 更改商品属性配置
  handleSwitchItemAttribute = (key) => {
    const current = [...this.props.configSetting.itemAttribute];
    if (key == 0) {
      this.props.configSetting.itemAttribute.some(n => n == 'name') ? current.splice(current.findIndex(n => n == 'name'), 1) : current.push('name');
    } else if (key == 1) {
      this.props.configSetting.itemAttribute.some(n => n == 'unit') ? current.splice(current.findIndex(n => n == 'unit'), 1) : current.push('unit');
    } else if (key == 2) {
      this.props.configSetting.itemAttribute.some(n => n == 'skuattributetype_1') ? current.splice(current.findIndex(n => n == 'skuattributetype_1'), 1) : current.push('skuattributetype_1');
    } else if (key == 3) {
      this.props.configSetting.itemAttribute.some(n => n == 'skuattributetype_2') ? current.splice(current.findIndex(n => n == 'skuattributetype_2'), 1) : current.push('skuattributetype_2');
    } else if (key == 4) {
      this.props.configSetting.itemAttribute.some(n => n == 'purchase_price') ? current.splice(current.findIndex(n => n == 'purchase_price'), 1) : current.push('purchase_price');
    }
    this.props.dispatch({ type: 'configSetting/switchItemAttrite', payload: current }).then(() => {
      this.props.dispatch({ type: 'configSetting/getConfigSetting' });
    });
  }

  // 弹出框
  handleConfirm = (key) => {
    Modal.confirm({
      title: '确认更改商品属性策略？',
      onOk: () => {
        this.handleSwitchItemAttribute(key);
      },
    });
  }

  render() {
    const { itemAttribute } = this.props.configSetting;

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)} >
        <Card bordered={false}>
          <DuokeSwitch title="货号" disabled defaultChecked />
        </Card>
        <Divider className={styles.dividerStyle} />
        <Card bordered={false}>
          <DuokeSwitch title="标准价" disabled defaultChecked />
        </Card>
        <Divider className={styles.dividerStyle} />
        <Card bordered={false}>
          <DuokeSwitch title="价格等级 + 价格组成" disabled defaultChecked />
        </Card>
        <Divider className={styles.dividerStyle} />
        <Card bordered={false}>
          <DuokeSwitch title="名称" onClick={this.handleConfirm.bind(null, 0)} checked={itemAttribute.some(n => n == 'name')} />
        </Card>
        <Divider className={styles.dividerStyle} />
        <Card bordered={false}>
          <DuokeSwitch title="单位" onClick={this.handleConfirm.bind(null, 1)} checked={itemAttribute.some(n => n == 'unit')} />
        </Card>
        <Divider className={styles.dividerStyle} />
        <Card bordered={false}>
          <DuokeSwitch title="匹号" onClick={this.handleConfirm.bind(null, 2)} checked={itemAttribute.some(n => n == 'skuattributetype_1')} />
        </Card>
        <Divider className={styles.dividerStyle} />
        <Card bordered={false}>
          <DuokeSwitch title="规格" onClick={this.handleConfirm.bind(null, 4)} checked={itemAttribute.some(n => n == 'skuattributetype_2')} />
        </Card>
        <Divider className={styles.dividerStyle} />
        <Card bordered={false}>
          <DuokeSwitch title="进货价" onClick={this.handleConfirm.bind(null, 4)} checked={itemAttribute.some(n => n == 'purchase_price')} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
