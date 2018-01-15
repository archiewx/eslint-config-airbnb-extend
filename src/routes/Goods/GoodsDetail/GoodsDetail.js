import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Menu,Dropdown,Popconfirm,Divider} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/antd-pro/DescriptionList';
import styles from './GoodsDetail.less'
const ButtonGroup = Button.Group;
const {Description} = DescriptionList
@connect( state => ({
  goodsDetail: state.goodsDetail
}))
export default class GoodsDetail extends PureComponent {

  state = {
    activeTabKey : 'message'
  }

  handleTabChange = (key) => {
    this.setState({activeTabKey: key})
  }

  render() {

    const {activeTabKey} = this.state
    const {singleGoodsDetail,singleGoodsSales,singleGoodsPurchases,singleGoodsCustomers,singleGoodsSuppliers,singleGoodsStocks} = this.props.goodsDetail

    const tabList = [{
      key:'message',
      tab:'信息'
    },{
      key:'sale',
      tab:'销售',
    },{
      key:'purchase',
      tab:'进货'
    },{
      key:'customer',
      tab:'客户'
    },{
      key:'supplier',
      tab:'供应商'
    },{
      key:'stock',
      tab:'库存'
    }]

    const salesColumns = [{
      title:'名称',
      dataIndex:'id',
    },{
      title:'销售量',
      dataIndex:'sales_quantity',
    },{
      title:'销售额',
      dataIndex:'sales_amount',
    },{
      title:'利润',
      dataIndex:'profit',
    },{
      title:'库存',
      dataIndex:'stock_quantity',
    }]

    const purchasesColumns = [{
      title:'名称',
      dataIndex:'id',
    },{
      title:'进货量',
      dataIndex:'purchase_quantity',
    },{
      title:'进货额',
      dataIndex:'purchase_amount',
    },{
      title:'利润',
      dataIndex:'profit',
    },{
      title:'库存',
      dataIndex:'stock_quantity',
    }]

    const customersColumns = [{
      title:'名称',
      dataIndex:'id',
    },{
      title:'购买量',
      dataIndex:'sales_quantity',
    },{
      title:'购买额',
      dataIndex:'sales_amount',
    },{
      title:'退货量',
      dataIndex:'sales_return_quantity',
    },{
      title:'利润',
      dataIndex:'profit',
    }]

    const suppliersColumns = [{
      title:'名称',
      dataIndex:'id',
    },{
      title:'供应量',
      dataIndex:'purchase_quantity',
    },{
      title:'供应额',
      dataIndex:'purchase_amount',
    },{
      title:'返厂量',
      dataIndex:'purchase_return_quantity',
    },{
      title:'利润',
      dataIndex:'profit',
    }]

    const stocksColumns = [{
      title:'名称',
      dataIndex:'id',
    },{
      title:'销售量',
      dataIndex:'sales_quantity',
    },{
      title:'进货量',
      dataIndex:'purchase_quantity',
    },{
      title:'库存',
      dataIndex:'stock_quantity',
    }]

    const description = (
      <DescriptionList col='2' size="small" className={styles.descriptionPostion} >
        <Description term='进货价'>{`${singleGoodsDetail.purchase_price || ''}`}</Description>
        <Description term='标准价'>{`${singleGoodsDetail.standard_price || ''}`}</Description>
        <Description term='名称'>{`${singleGoodsDetail.name || ''}`}</Description>
        <Description term='备注'>{`${singleGoodsDetail.desc || ''}`}</Description>
      </DescriptionList>
    )

    const menu = (
      <Menu>
        <Menu.Item key="1">删除</Menu.Item>
      </Menu>
    );

    const action = (
      <div>
        <ButtonGroup>
          <Button>{singleGoodsDetail.not_sale === '1' ? '在售' : '停售'}</Button>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
        <Button type="primary">编辑</Button>
      </div>
    )

    const status = (
      <div>
        {
          singleGoodsDetail.not_sale == 0 ? (
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
        }
      </div>
    )

    const singleGoodsTab = {
      message: (
        <div>
          <DescriptionList title='价格等级&价格组成'>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList title='属性' col='2'>
            <Description term='单位'>{singleGoodsDetail.units || ''}</Description>
            <Description term='颜色'>{singleGoodsDetail.colors || ''}</Description>
            <Description term='尺码'>{singleGoodsDetail.sizes || ''}</Description>
            <Description term='商品分组'>{singleGoodsDetail.goodsGroup || ''}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList title='图片'>
          </DescriptionList>
        </div>
      ),
      sale: (
        <div>
          <Table columns={salesColumns} dataSource={singleGoodsSales} rowKey='id'></Table>
        </div>
      ),
      purchase: (
        <div>
          <Table columns={purchasesColumns} dataSource={singleGoodsPurchases} rowKey='id'></Table>
        </div>
      ),
      customer: (
        <div>
          <Table columns={customersColumns} dataSource={singleGoodsCustomers} rowKey='id'></Table>
        </div>
      ),
      supplier: (
        <div>
          <Table columns={suppliersColumns} dataSource={singleGoodsSuppliers} rowKey='id'></Table>
        </div>
      ),
      stock: (
        <div>
          <Table columns={stocksColumns} dataSource={singleGoodsStocks} rowKey='id'></Table>
        </div>
      )
    }


    return (
      <PageHeaderLayout
        title={`货号：${singleGoodsDetail.item_ref || ''}`}
        activeTabKey={activeTabKey}
        tabList={tabList}
        content={description}
        action={action}
        status={status}
        onTabChange={this.handleTabChange}
      >
        <Card bordered={false}>
          {singleGoodsTab[activeTabKey]}
        </Card>
      </PageHeaderLayout>
    );
  }
}
