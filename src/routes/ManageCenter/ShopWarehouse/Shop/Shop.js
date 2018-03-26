import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import breadCrumbList from '../../../../common/breadCrumbList';
import ShopModal from './Modal';
import styles from './Shop.less';
@connect(state => ({
  shop: state.shop,
  goodsGroup: state.goodsGroup,
  warehouse: state.warehouse,
}))
export default class Shop extends PureComponent {
  state = {
    modalVisibel: false,
    formValue: {},
  }

  componentDidMount() {
    this.props.dispatch({ type: 'shop/getList' });
    this.props.dispatch({ type: 'goodsGroup/getList' });
    this.props.dispatch({ type: 'warehouse/getList' });
  }

  handleModalOpen = (item) => {
    this.setState({
      modalVisibel: true,
      formValue: item,
    });
  }

  handleModalCancel = () => {
    this.setState({
      modalVisibel: false,
    });
  }

  handleModalOk = (value) => {
    /*
      组装数据
      仓库 [{id}] 
      商品分组 [{id}]
    */
    let warehouseData,
      itemData,
      groupsId = [];
    warehouseData = {
      id: value.id,
      warehouse_id: [{
        id: value.warehouse_id,
      }],
    };
    itemData = {
      id: value.id,
      item_id: [],
    };
    for (const key in value) {
      if (key.indexOf('group_') > -1) {
        if (value[key]) {
          groupsId = groupsId.concat(value[key]);
        }
      }
    }
    itemData.item_id = groupsId.map((n) => {
      return {
        id: n,
      };
    });
    this.props.goodsGroup.goodsGroups.forEach((n) => {
      itemData.item_id.push({
        id: n.id,
      });
    });
    this.setState({
      modalVisibel: false,
    });
    this.props.dispatch({ type: 'shop/editBind',
      payload: {
        itemData,
        warehouseData,
      } }).then(() => {
      this.props.dispatch({ type: 'shop/getList' });
    });
  }

  render() {
    const { shops } = this.props.shop;
    const { goodsGroups } = this.props.goodsGroup;
    const { warehouses } = this.props.warehouse;
    const { modalVisibel, formValue } = this.state;

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)}>
        {
          shops.map((n) => {
            return (
              <Card key={n.id} title={n.name} bordered={false} style={{ marginBottom: 24 }} extra={<Button type="primary" onClick={this.handleModalOpen.bind(null, n)}>编辑</Button>}>
                <div style={{ marginBottom: 30 }}><label className={styles.labelTitle}>关联的仓库:</label><span>{`${n.warehouses.data[0].name}`}</span></div>
                <div>
                  <div className={styles.relationGoodsGroup}>关联的商品分组</div>
                  <div>
                    {
                      n.itemgroups.map((m) => {
                        return (
                          <div key={m.id} style={{ marginTop: 20 }}>
                            <label className={styles.labelTitle}>{`${m.name}:`}</label>
                            <span>{`${m.children.map(e => e.name).join('、')}`}</span>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </Card>
            );
          })
        }
        <ShopModal visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} warehouses={warehouses} goodsGroups={goodsGroups} onCancel={this.handleModalCancel} />
      </PageHeaderLayout>
    );
  }
}
