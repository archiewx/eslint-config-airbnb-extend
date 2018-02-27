import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import ShopModal from './Modal'
import styles from './Shop.less'
@connect(state => ({
  shop:state.shop,
  goodsGroup:state.goodsGroup,
  warehouse:state.warehouse,
}))
export default class Shop extends PureComponent {

  state = {
    modalVisibel: false,
    formValue: {},
  }

  componentDidMount(){
    this.props.dispatch({type:'shop/getList'})
    this.props.dispatch({type:'goodsGroup/getList'})
    this.props.dispatch({type:'warehouse/getList'})
  }

  handleModalOpen = (item) => {
    this.setState({
      modalVisibel: true,
      formValue: item
    })
  }

  handleModalCancel = () => {
    this.setState({
      modalVisibel: false
    })
  }

  handleModalOk = (value) => {
    console.log(value)
  }

  render() {
    const {shops} = this.props.shop;
    const {goodsGroups} = this.props.goodsGroup;
    const {warehouses} = this.props.warehouse;
    const {modalVisibel,formValue} = this.state;

    return (
      <PageHeaderLayout >
        {
          shops.map( n => {
            return (
              <Card key={n.id} title={n.name} bordered={false} style={{marginBottom:24}} extra = { <Button type='primary' onClick={this.handleModalOpen.bind(null,n)}>编辑</Button> }>
                <div style={{marginBottom:30}}><label className={styles.labelTitle}>关联的仓库:</label><span>{`${n.warehouses.data[0].name}`}</span></div>
                <div>
                  <div className={styles.relationGoodsGroup}>关联的商品分组</div>
                  <div>
                    
                  </div>
                </div>
              </Card>
            )
          })
        }
        <ShopModal visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} warehouses={warehouses} goodsGroups={goodsGroups} onCancel={this.handleModalCancel}/>
      </PageHeaderLayout>
    );
  }
}
