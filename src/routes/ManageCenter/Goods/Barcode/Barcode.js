import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider,Switch} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './Barcode.less'
@connect(state => ({
  configSetting:state.configSetting
}))
export default class Barcode extends PureComponent {

  handleSwitchUseBarcode = (useBarcode) => {
    this.props.dispatch({type:'configSetting/switchBarcode',payload:useBarcode ? -1 : 0}).then(()=>{
      this.props.dispatch({type:'configSetting/getConfigSetting'})
    })
  }

  handleSwitchBarcodeLevel = () => {
    this.props.dispatch({type:'configSetting/switchBarcode',payload:this.props.configSetting.itemBarcodeLevel == 0 ? 1 : 0}).then(()=>{
      this.props.dispatch({type:'configSetting/getConfigSetting'})
    })
  }

  render() {
    const useBarcode = this.props.configSetting.itemBarcodeLevel != -1 
    const itemBarcodeLevel = this.props.configSetting.itemBarcodeLevel
    return (
      <PageHeaderLayout >
        <Card bordered={false} style={{marginBottom: 18}}>
          <div><span className={styles.useBarcodeTitle}>使用条码</span><Switch onClick={this.handleSwitchUseBarcode.bind(null,useBarcode)} checked={useBarcode} className={styles.switchPosition} checkedChildren="开" unCheckedChildren="关" /></div>
        </Card>
        <Card bordered={false} className={styles.barcodePosition}>
          <div><span className={styles.spanTitle}>货号条码</span><Switch onClick={this.handleSwitchBarcodeLevel} checked={itemBarcodeLevel == 0} className={styles.switchPosition} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/></div>
        </Card>
        <Divider style={{margin:0,width:0}}/>
        <Card bordered={false} className={styles.barcodePosition}>
          <div><span className={styles.spanTitle}>SKU条码</span><Switch onClick={this.handleSwitchBarcodeLevel} checked={itemBarcodeLevel == 1} className={styles.switchPosition} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/></div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
