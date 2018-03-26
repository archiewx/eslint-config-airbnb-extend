import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Modal } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import breadCrumbList from '../../../../common/breadCrumbList';
import DuokeSwitch from '../../../../components/DuokeSwitch';
import styles from './Barcode.less';
@connect(state => ({
  configSetting: state.configSetting,
}))
export default class Barcode extends PureComponent {
  handleSwitchUseBarcode = (useBarcode) => {
    this.props.dispatch({ type: 'configSetting/switchBarcode', payload: useBarcode ? -1 : 0 }).then(() => {
      this.props.dispatch({ type: 'configSetting/getConfigSetting' });
    });
  }

  handleSwitchBarcodeLevel = () => {
    this.props.dispatch({ type: 'configSetting/switchBarcode', payload: this.props.configSetting.itemBarcodeLevel == 0 ? 1 : 0 }).then(() => {
      this.props.dispatch({ type: 'configSetting/getConfigSetting' });
    });
  }

  handleUseBarcodeConfirm = (useBarcode) => {
    Modal.confirm({
      title: '确认更改条码策略',
      onOk: () => {
        this.handleSwitchUseBarcode(useBarcode);
      },
    });
  }

  handleConfirm = () => {
    Modal.confirm({
      title: '确认更改条码策略',
      onOk: () => {
        this.handleSwitchBarcodeLevel();
      },
    });
  }

  render() {
    const useBarcode = this.props.configSetting.itemBarcodeLevel != -1;
    const itemBarcodeLevel = this.props.configSetting.itemBarcodeLevel;
    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)}>
        <Card bordered={false} style={{ marginBottom: 18 }}>
          <DuokeSwitch title="使用条码" onClick={this.handleUseBarcodeConfirm.bind(null, useBarcode)} checked={useBarcode} />
        </Card>
        <Card bordered={false} className={styles.barcodePosition}>
          <DuokeSwitch.Option title="货号条码" onClick={this.handleConfirm} checked={itemBarcodeLevel == 0} />
        </Card>
        <Card bordered={false} className={styles.barcodePosition}>
          <DuokeSwitch.Option title="SKU条码" onClick={this.handleConfirm} checked={itemBarcodeLevel == 1} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
