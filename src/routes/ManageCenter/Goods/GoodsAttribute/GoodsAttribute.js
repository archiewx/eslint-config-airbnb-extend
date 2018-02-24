import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider,Switch} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './GoodsAttribute.less'
@connect(state => ({
  configSetting:state.configSetting
}))
export default class GoodsAttribute extends PureComponent {

  handleSwitchItemAttribute = (key) => {
    let current = this.props.configSetting.itemAttribute;
    if(key == 0) {
      this.props.configSetting.itemAttribute.some( n => n == 'name') ? current.splice(current.findIndex( n => n == 'name'),1) : current.push('name')
    }else if(key == 1) {
      this.props.configSetting.itemAttribute.some( n => n == 'unit') ? current.splice(current.findIndex( n => n == 'unit'),1) : current.push('unit')
    }else if(key == 2) {
      this.props.configSetting.itemAttribute.some( n => n == 'skuattributetype_1') ? current.splice(current.findIndex( n => n =='skuattributetype_1'),1) : current.push('skuattributetype_1')
    }else if(key == 3) {
      this.props.configSetting.itemAttribute.some( n => n == 'skuattributetype_2') ? current.splice(current.findIndex( n => n == 'skuattributetype_2'),1) : current.push('skuattributetype_2')
    }else if(key == 4) {
      this.props.configSetting.itemAttribute.some( n => n == 'purchase_price') ? current.splice(current.findIndex( n => n == 'purchase_price'),1) : current.push('purchase_price')
    }
    this.props.dispatch({type:'configSetting/switchItemAttrite',payload:current}).then(()=>{
      this.props.dispatch({type:'configSetting/getConfigSetting'})
    })

  }

  render() {
    const {itemAttribute} = this.props.configSetting;

    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <div><span className={styles.spanTitle}>货号</span><Switch disabled defaultChecked={true} className={styles.switchPosition} checkedChildren="开" unCheckedChildren="关" /></div>
        </Card>
        <Divider style={{margin:0,width:0}}/>
        <Card bordered={false}>
          <div><span className={styles.spanTitle}>标准价</span><Switch disabled defaultChecked={true} className={styles.switchPosition} checkedChildren="开" unCheckedChildren="关" /></div>
        </Card>
        <Divider style={{margin:0,width:0}}/>
        <Card bordered={false}>
          <div><span className={styles.spanTitle}>{'价格等级 + 价格组成'}</span><Switch disabled defaultChecked={true} className={styles.switchPosition} checkedChildren="开" unCheckedChildren="关" /></div>
        </Card>
        <Divider style={{margin:0,width:0}}/>
        <Card bordered={false} className={styles.barcodePosition}>
          <div><span className={styles.spanTitle}>名称</span><Switch onClick={this.handleSwitchItemAttribute.bind(null,0)} checked={itemAttribute.some( n => n == 'name')} className={styles.switchPosition} checkedChildren="开" unCheckedChildren="关"/></div>
        </Card>
        <Divider style={{margin:0,width:0}}/>
        <Card bordered={false} className={styles.barcodePosition}>
          <div><span className={styles.spanTitle}>单位</span><Switch onClick={this.handleSwitchItemAttribute.bind(null,1)} checked={itemAttribute.some( n => n == 'unit')} className={styles.switchPosition} checkedChildren="开" unCheckedChildren="关"/></div>
        </Card>
        <Divider style={{margin:0,width:0}}/>
        <Card bordered={false} className={styles.barcodePosition}>
          <div><span className={styles.spanTitle}>颜色</span><Switch onClick={this.handleSwitchItemAttribute.bind(null,2)} checked={itemAttribute.some( n => n == 'skuattributetype_1')} className={styles.switchPosition} checkedChildren="开" unCheckedChildren="关"/></div>
        </Card>
        <Divider style={{margin:0,width:0}}/>
        <Card bordered={false} className={styles.barcodePosition}>
          <div><span className={styles.spanTitle}>尺码</span><Switch onClick={this.handleSwitchItemAttribute.bind(null,3)} checked={itemAttribute.some( n => n == 'skuattributetype_2')} className={styles.switchPosition} checkedChildren="开" unCheckedChildren="关"/></div>
        </Card>
        <Divider style={{margin:0,width:0}}/>
        <Card bordered={false} className={styles.barcodePosition}>
          <div><span className={styles.spanTitle}>进货价</span><Switch onClick={this.handleSwitchItemAttribute.bind(null,4)} checked={itemAttribute.some( n => n == 'purchase_price')} className={styles.switchPosition} checkedChildren="开" unCheckedChildren="关"/></div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
