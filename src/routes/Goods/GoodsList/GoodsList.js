import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Button, message, Table} from 'antd';
import StandardTable from '../../../components/antd-pro/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@connect(state => ({
  goodsList:state.goodsList
}))
export default class TableList extends PureComponent {

  state = {
    activeTabKey: 'sale'
  }

  // componentDidMount() {
  //   this.props.dispatch({type:'goodsList/getGoodsList'})
  // }
  
  handleTabChange = (key) => {
    this.setState({activeTabKey: key})
  }

  handleToGoodsCreate = () => {
    this.props.dispatch(routerRedux.push('/goods-create'))
  }

  render() {
    const {activeTabKey} = this.state
    const {goodsListSales,goodsListPurchases} = this.props.goodsList

    const tabList = [{
      key: 'sale',
      tab: '销售'
    },{
      key: 'purchase',
      tab: '进货'
    }]

    const salesColumns = [{
      title: ' ',
      dataIndex:'image',
    }, {
      title: '货号',
      dataIndex: 'item_ref',
    }, {
      title: '标准价',
      dataIndex: 'standard_price',
    }, {
      title: '销售量',
      dataIndex: 'sales_quantity',
    }, {
      title: '销售额',
      dataIndex: 'sales_amount',
    }, {
      title: '库存量',
      dataIndex: 'stock_quantity',
    }, {
      title: '状态',
      dataIndex: 'not_sale',
      render: (text,record) => (
        record.not_sale == 0 ? (
          <div>
            <span>•</span>
            <span>在售</span>
          </div>
        ) : (
          <div>
            <span>•</span>
            <span>停售</span>
          </div>
        )
      )
    }]

    const purchaseColumns = [{
      title: ' ',
      dataIndex:'image',
    },{
      title: '货号',
      dataIndex: 'item_ref',
    }, {
      title: '标准价',
      dataIndex: 'standard_price',
    }, {
      title: '进货量',
      dataIndex: 'purchase_quantity',
    }, {
      title: '进货额',
      dataIndex: 'purchase_amount',
    }, {
      title: '库存量',
      dataIndex: 'stock_quantity',
    }, {
      title: '状态',
      dataIndex: 'not_sale',
      render: (text,record) => (
        record.not_sale == 0 ? (
          <div>
            <span>•</span>
            <span>在售</span>
          </div>
        ) : (
          <div>
            <span>•</span>
            <span>停售</span>
          </div>
        )
      )
    }];

    return (
      <PageHeaderLayout
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={this.handleTabChange}
      >
        <Card bordered={false}>
          <div style={{display: activeTabKey == 'sale' ? 'block' : 'none'}}>
            <div>
              <Button type='primary' onClick={this.handleToGoodsCreate}>新建商品</Button>
            </div>
            <Table 
              rowKey='id'
              columns={salesColumns} 
              dataSource={goodsListSales} 
            >
            </Table>
          </div>
          <div style={{display: activeTabKey == 'purchase' ? 'block' : 'none'}}>
            <div>
              <Button type='primary' onClick={this.handleToGoodsCreate}>新建商品</Button>
            </div>
            <Table 
              rowKey='id'
              columns={purchaseColumns} 
              dataSource={goodsListPurchases} 
            >
            </Table>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
