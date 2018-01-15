import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Menu,Dropdown,Popconfirm,Divider} from 'antd';
import StandardTable from '../../../components/antd-pro/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './GoodsList.less'
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

  handleSelectGoodStatus = (item) => {
    this.props.dispatch({type:'goodsList/changeGoodsStatus',payload:{
      id: item.id,
      not_sale: item.not_sale === '1' ? 0 : 1
    }})
  }

  handleDeleteGoods = (item) => {
    console.log(item)
  }

  handleMoreOperation = (item) => {
    return (
      <div>
        <Link to={`/goods-detail/${item.id}`}>查看</Link>
        <Divider type='vertical' />
        <Link to={`/goods-edit/${item.id}`}>编辑</Link>
        <Divider  type='vertical' />
        <Dropdown overlay={    
          <Menu>
            { item.not_sale === 0 ? (
              <Menu.Item key="1"><Popconfirm title="确认停售此商品?" onConfirm={this.handleSelectGoodStatus.bind(null,item)}>停售</Popconfirm></Menu.Item>
              ) : (
                <Menu.Item key="2"><Popconfirm title="确认解除停售此商品?" onConfirm={this.handleSelectGoodStatus.bind(null,item)}>解除停售</Popconfirm></Menu.Item>
              )}
            <Menu.Item key="3"><Popconfirm title="确认删除此商品?" onConfirm={this.handleDeleteGoods.bind(null,item)}>删除</Popconfirm></Menu.Item>
          </Menu>
        }>
        <a className="ant-dropdown-link">更多<Icon type="down" /></a>
        </Dropdown>
      </div>
    )
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

    const extra = (
      <Button type='primary' onClick={this.handleToGoodsCreate}>新建商品</Button>
    )

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
            <span className={styles.onSaleStatus}>• </span>
            <span>在售</span>
          </div>
        ) : (
          <div>
            <span className={styles.stopSaleStatus}>• </span>
            <span>停售</span>
          </div>
        )
      )
    }, {
      title: '操作',
      dataIndex: 'operation',
      width:'162px',  
      render: (text,record,index) =>( this.handleMoreOperation(record) )
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
            <span className={styles.onSaleStatus}>• </span>
            <span>在售</span>
          </div>
        ) : (
          <div>
            <span className={styles.stopSaleStatus}>• </span>
            <span>停售</span>
          </div>
        )
      )
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text,record,index) =>( this.handleMoreOperation(record) )
    }];

    return (
      <PageHeaderLayout
        className={styles.goodsListExtra}
        tabList={tabList}
        activeTabKey={activeTabKey}
        extraContent={extra}
        onTabChange={this.handleTabChange}
      >
        <Card bordered={false}>
          <div style={{display: activeTabKey == 'sale' ? 'block' : 'none'}}>
            <Table 
              rowKey='id'
              columns={salesColumns} 
              dataSource={goodsListSales} 
            >
            </Table>
          </div>
          <div style={{display: activeTabKey == 'purchase' ? 'block' : 'none'}}>
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
