import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider,Switch} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './Picture.less'
@connect(state => ({
  configSetting:state.configSetting
}))
export default class Picture extends PureComponent {

  handleSwitchImageLevel = () => {
    this.props.dispatch({type:'configSetting/switchPicture',payload:this.props.configSetting.itemImageLevel == 'item' ? 'sku' : 'item'}).then(()=>{
      this.props.dispatch({type:'configSetting/getConfigSetting'})
    })
  }

  render() {
    const {itemImageLevel} = this.props.configSetting;

    return (
      <PageHeaderLayout >
        <Card bordered={false} className={styles.barcodePosition}>
          <div><span className={styles.spanTitle}>图片属于货号</span><Switch onClick={this.handleSwitchImageLevel} checked={itemImageLevel == 'item'} className={styles.switchPosition} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/></div>
        </Card>
        <Divider style={{margin:0,width:0}}/>
        <Card bordered={false} className={styles.barcodePosition}>
          <div><span className={styles.spanTitle}>图片属于颜色</span><Switch onClick={this.handleSwitchImageLevel} checked={itemImageLevel == 'sku'} className={styles.switchPosition} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/></div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
