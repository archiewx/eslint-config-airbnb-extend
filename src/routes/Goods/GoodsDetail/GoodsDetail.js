import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Menu,Dropdown,Popconfirm,Divider,Form,DatePicker} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/antd-pro/DescriptionList';
import StandardFormRow from '../../../components/antd-pro/StandardFormRow';
import TagSelect from '../../../components/antd-pro/TagSelect';
import styles from './GoodsDetail.less'
const ButtonGroup = Button.Group;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const {Description} = DescriptionList
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

const saleColumns = [{
  title:'名称',
  dataIndex:'name',
},{
  title:'销售量',
  dataIndex:'sales_quantity',
  sorter:true
},{
  title:'销售额',
  dataIndex:'sales_amount',
  sorter:true
},{
  title:'利润',
  dataIndex:'profit',
  sorter:true
},{
  title:'库存',
  dataIndex:'stock_quantity',
  sorter:true
}]

const purchaseColumns = [{
  title:'名称',
  dataIndex:'name',
},{
  title:'进货量',
  dataIndex:'purchase_quantity',
  sorter:true
},{
  title:'进货额',
  dataIndex:'purchase_amount',
  sorter:true
},{
  title:'库存',
  dataIndex:'stock_quantity',
  sorter:true
}]

const customerColumns = [{
  title:'名称',
  dataIndex:'name',
},{
  title:'购买量',
  dataIndex:'sales_quantity',
  sorter:true
},{
  title:'购买额',
  dataIndex:'sales_amount',
  sorter:true
},{
  title:'退货量',
  dataIndex:'sales_return_quantity',
  sorter:true
},{
  title:'利润',
  dataIndex:'profit',
  sorter:true
}]

const supplierColumns = [{
  title:'名称',
  dataIndex:'name',
},{
  title:'供应量',
  dataIndex:'purchase_quantity',
  sorter:true
},{
  title:'供应额',
  dataIndex:'purchase_amount',
  sorter:true
}]

const stockColumns = [{
  title:'名称',
  dataIndex:'name',
},{
  title:'出货量',
  dataIndex:'sales_quantity',
  sorter:true
},{
  title:'入货量',
  dataIndex:'purchase_quantity',
  sorter:true
},{
  title:'库存量',
  dataIndex:'stock_quantity',
  sorter:true
}]
const customerPagination = {
  showQuickJumper:true,
  showSizeChanger:true,
  hideOnSinglePage:true
}
const supplierPagination = {
  showQuickJumper:true,
  showSizeChanger:true,
  hideOnSinglePage:true
}
@Form.create()
@connect( state => ({
  goodsDetail: state.goodsDetail,
  layoutFilter: state.layoutFilter
}))
export default class GoodsDetail extends PureComponent {

  state = {
    activeTabKey : 'message',
    selectCustomerMode: {
      name:'不分组',
      mode:'customer'
    }
  }

  handleTabChange = (key) => {
    this.setState({activeTabKey: key})
  }

  handleSelectGoodStatus = (not_sale,{id}) => {
    this.props.dispatch({type:'goodsDetail/changeGoodsStatus',payload:{
      id,
      not_sale: not_sale == 1 ? 0 : 1
    }})
  }

  handleDeleteSingleGoods = (id,{item,key,keyPath}) => {
    this.props.dispatch({type:'goodsDetail/deleteSingleGoods',payload:id})
  }

  handleToGoodsEdit = (id) => {
    this.props.dispatch(routerRedux.push(`/goods-edit/${id}`))
  }

  handleSaleSort = (pagination, filters, sorter) => {
    let current = {};
    current[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
    this.props.dispatch({type:'goodsDetail/getSingleSales',payload:{
      sorts: current,
      id:this.props.goodsDetail.currentId.id
    }})
  }

  handleSaleFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'goodsDetail/setFilterSaleServerData',payload:{
            ...value,
            sale_datePick: value['sale_datePick'] ? [value['sale_datePick'][0].format('YYYY-MM-DD'),value['sale_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          this.props.dispatch({type:'goodsDetail/getSingleSales',payload:{
            filter:this.props.goodsDetail.filterSaleServerData,
            id:this.props.goodsDetail.currentId.id
          }})
        }
      })
    }, 0)
  }

  handlePurchaseSort = (pagination, filters, sorter) => {
    let current = {};
    current[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
    this.props.dispatch({type:'goodsDetail/getSinglePurchases',payload:{
      sorts: current,
      id:this.props.goodsDetail.currentId.id
    }})
  }

  handlePurchaseFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'goodsDetail/setFilterPurchaseServerData',payload:{
            ...value,
            purchase_datePick: value['purchase_datePick'] ? [value['purchase_datePick'][0].format('YYYY-MM-DD'),value['purchase_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          this.props.dispatch({type:'goodsDetail/getSinglePurchases',payload:{
            filter:this.props.goodsDetail.filterPurchaseServerData,
            id:this.props.goodsDetail.currentId.id
          }})
        }
      })
    }, 0)
  }

  handleCustomerSort = (pagination,filters,sorter) => {
    let current = {};
    current[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
    this.props.dispatch({type:'goodsDetail/getSingleCustomers',payload:{
      sorts: current,
      id:this.props.goodsDetail.currentId.id,
      mode:this.state.selectCustomerMode.mode
    }})
  }

  handleCustomerFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'goodsDetail/setFilterCustomerServerData',payload:{
            ...value,
            customer_datePick: value['customer_datePick'] ? [value['customer_datePick'][0].format('YYYY-MM-DD'),value['customer_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          this.props.dispatch({type:'goodsDetail/getSingleCustomers',payload:{
            filter:this.props.goodsDetail.filterCustomerServerData,
            id:this.props.goodsDetail.currentId.id,
            mode:this.state.selectCustomerMode.mode
          }})
        }
      })
    }, 0)
  }

  handleCustomerModeSelect = ({item,key,keyPath}) => {
    this.setState({
      selectCustomerMode: {
        name:item.props.children,
        mode:key
      }
    })
    this.props.dispatch({type:'goodsDetail/getSingleCustomers',payload:{
      id:this.props.goodsDetail.currentId.id,
      mode:key
    }})
  }

  handleSupplierSort = (pagination,filters,sorter) => {
    let current = {};
    current[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
    this.props.dispatch({type:'goodsDetail/getSingleSuppliers',payload:{
      sorts: current,
      id:this.props.goodsDetail.currentId.id
    }})
  }

  handleSupplierFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'goodsDetail/setFilterSupplierServerData',payload:{
            ...value,
            supplier_datePick: value['supplier_datePick'] ? [value['supplier_datePick'][0].format('YYYY-MM-DD'),value['supplier_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          this.props.dispatch({type:'goodsDetail/getSingleSuppliers',payload:{
            filter:this.props.goodsDetail.filterStockServerData,
            id:this.props.goodsDetail.currentId.id
          }})
        }
      })
    }, 0)
  }

  handleStockSort = (pagination, filters, sorter) => {
    let current = {};
    current[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
    this.props.dispatch({type:'goodsDetail/getSingleStocks',payload:{
      sorts: current,
      id:this.props.goodsDetail.currentId.id
    }})
  }

  handleStockFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'goodsDetail/setFilterStockServerData',payload:{
            ...value,
            stock_datePick: value['stock_datePick'] ? [value['stock_datePick'][0].format('YYYY-MM-DD'),value['stock_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          this.props.dispatch({type:'goodsDetail/getSingleStocks',payload:{
            filter:this.props.goodsDetail.filterStockServerData,
            id:this.props.goodsDetail.currentId.id
          }})
        }
      })
    }, 0)
  }

  render() {

    const {activeTabKey,selectCustomerMode} = this.state
    const {singleGoodsDetail,singleGoodsSales,singleGoodsPurchases,singleGoodsCustomers,singleGoodsSuppliers,singleGoodsStocks,currentId,singleCustomerMode} = this.props.goodsDetail
    const {goodsDetailFilter} = this.props.layoutFilter
    const {getFieldDecorator,getFieldValue} = this.props.form
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
        <Menu.Item key="1"><Popconfirm title="确认删除此商品?" onConfirm={this.handleDeleteSingleGoods.bind(null,currentId)}>删除</Popconfirm></Menu.Item>
      </Menu>
    );

    const action = (
      <div>
        <ButtonGroup>
          <Popconfirm title={ singleGoodsDetail.not_sale === '1' ? '确认解除停售此商品' : '确认停售此商品'} onConfirm={this.handleSelectGoodStatus.bind(null,singleGoodsDetail.not_sale,currentId)}><Button>{singleGoodsDetail.not_sale === '1' ? '在售' : '停售'}</Button></Popconfirm>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
        <Button type="primary" onClick={this.handleToGoodsEdit.bind(null,currentId.id)}>编辑</Button>
      </div>
    )

    const customerMenu = (
      <Menu onClick={this.handleCustomerModeSelect}>
        {
          singleCustomerMode.map( item => {
            return <Menu.Item key={`${item.mode}`}>{item.name}</Menu.Item>
          })
        }
      </Menu>
    )

    const customerExrta = (
      <Dropdown overlay={customerMenu}>
        <Button style={{ marginLeft: 8 }}>
          更改模式 <Icon type="down" />
        </Button>
      </Dropdown>
    )

    const saleExpandedRowRender = (item) => {
      return(
        <Table
          showHeader={false}
          columns={saleColumns}
          dataSource={item.childrens}
          pagination={false}
          rowKey='id'
        />
      )
    }

    const purchaseExpandedRowRender = (item) => {
      return(
        <Table
          showHeader={false}
          columns={purchaseColumns}
          dataSource={item.childrens}
          pagination={false}
          rowKey='id'
        />
      )
    }

    const stockExpandedRowRender = (item) => {
      return(
        <Table
          showHeader={false}
          columns={stockColumns}
          dataSource={item.childrens}
          pagination={false}
          rowKey='id'
        />
      )
    }

    const status = (
      <div>
        {
          singleGoodsDetail.not_sale == 0 ? (
            <div>
              <span className={styles.onSaleStatus}>• </span>
              <span style={{color: 'rgba(0, 0, 0, 0.85)'}}>在售</span>
            </div>
          ) : (
            <div>
              <span className={styles.stopSaleStatus}>• </span>
              <span style={{color: 'rgba(0, 0, 0, 0.85)'}}>停售</span>
            </div>
          )
        }
      </div>
    )

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
        <div style={{display: activeTabKey == 'message' ? 'block' : 'none'}}>
          <Card bordered={false}>
            <DescriptionList title='价格等级&价格组成' size='large' >
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList title='属性' col='2' size='large'>
              <Description term='单位'>{singleGoodsDetail.units || ''}</Description>
              <Description term='颜色' style={{display: singleGoodsDetail.colors ? 'block' : 'none'}}>{singleGoodsDetail.colors || ''}</Description>
              <Description term='尺码' style={{display: singleGoodsDetail.sizes ? 'block' : 'none'}}>{singleGoodsDetail.sizes || ''}</Description>
              <Description term='商品分组' style={{display: singleGoodsDetail.goodsGroup ? 'block' : 'none'}}>{singleGoodsDetail.goodsGroup || ''}</Description>
            </DescriptionList>
            {
              (singleGoodsDetail.images || []).length === 0 ? null : (
                <div>
                  <Divider style={{ marginBottom: 32 }} />
                  <DescriptionList title='图片' style={{paddingBottom:32}} size='large' >
                    {
                      singleGoodsDetail.images.map( item => {
                        return <img src={`${item.url}`} alt = {item.name} style={{height:104}} key={item.id}/>
                      })
                    }
                  </DescriptionList>
                </div>
              )
            }
          </Card>
        </div>
        <div style={{display: activeTabKey == 'sale' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                goodsDetailFilter.map( (item,index) => {
                  return (
                    <StandardFormRow key={`${index}`} title={`${item.name}`} block>
                      <FormItem>
                        {getFieldDecorator(`sale_${item.code}`)(
                          <TagSelect expandable onChange={this.handleSaleFormSubmit}>
                            {
                              item.options.map( (subItem,subIndex) => {
                                return <TagSelect.Option key={`${subIndex}`} value={`${subItem.value}`}>{subItem.name}</TagSelect.Option>
                              })
                            }
                          </TagSelect>
                        )}
                      </FormItem>
                    </StandardFormRow>
                  )
                })              
              }
              <FormItem label='选择日期' >
                {getFieldDecorator('sale_datePick')(
                  <RangePicker style={{width:542}} onChange={this.handleSaleFormSubmit}/>
                )}
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false}>
            <Table columns={saleColumns} dataSource={singleGoodsSales} expandedRowRender={saleExpandedRowRender } onChange={this.handleSaleSort} pagination={false} rowKey='id'></Table>
          </Card>
        </div>
        <div style={{display: activeTabKey == 'purchase' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                goodsDetailFilter.map( (item,index) => {
                  return (
                    <StandardFormRow key={`${index}`} title={`${item.name}`} block>
                      <FormItem>
                        {getFieldDecorator(`purchase_${item.code}`)(
                          <TagSelect expandable onChange={this.handlePurchaseFormSubmit}>
                            {
                              item.options.map( (subItem,subIndex) => {
                                return <TagSelect.Option key={`${subIndex}`} value={`${subItem.value}`}>{subItem.name}</TagSelect.Option>
                              })
                            }
                          </TagSelect>
                        )}
                      </FormItem>
                    </StandardFormRow>
                  )
                })              
              }
              <FormItem label='选择日期' >
                {getFieldDecorator('purchase_datePick')(
                  <RangePicker style={{width:542}} onChange={this.handlePurchaseFormSubmit}/>
                )}
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false}>
            <Table columns={purchaseColumns} dataSource={singleGoodsPurchases} expandedRowRender={purchaseExpandedRowRender } onChange={this.handlePurchaseSort} pagination={false} rowKey='id'></Table>
          </Card>
        </div>
        <div style={{display: activeTabKey == 'customer' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided} >
            <Form layout='inline'>
              {
                goodsDetailFilter.map( (item,index) => {
                  return (
                    <StandardFormRow key={`${index}`} title={`${item.name}`} block>
                      <FormItem>
                        {getFieldDecorator(`customer_${item.code}`)(
                          <TagSelect expandable onChange={this.handleCustomerFormSubmit}>
                            {
                              item.options.map( (subItem,subIndex) => {
                                return <TagSelect.Option key={`${subIndex}`} value={`${subItem.value}`}>{subItem.name}</TagSelect.Option>
                              })
                            }
                          </TagSelect>
                        )}
                      </FormItem>
                    </StandardFormRow>
                  )
                })              
              }
              <FormItem label='选择日期' >
                {getFieldDecorator('customer_datePick')(
                  <RangePicker style={{width:542}} onChange={this.handleCustomerFormSubmit}/>
                )}
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false} title={selectCustomerMode.name} extra={customerExrta}>
            <Table columns={customerColumns} dataSource={singleGoodsCustomers}  onChange={this.handleCustomerSort} rowKey='id' pagination={ selectCustomerMode.mode == 'customer' ? customerPagination : false}></Table>
          </Card>
        </div>
        <div style={{display: activeTabKey == 'supplier' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                goodsDetailFilter.map( (item,index) => {
                  return (
                    <StandardFormRow key={`${index}`} title={`${item.name}`} block>
                      <FormItem>
                        {getFieldDecorator(`supplier_${item.code}`)(
                          <TagSelect expandable onChange={this.handleSupplierFormSubmit}>
                            {
                              item.options.map( (subItem,subIndex) => {
                                return <TagSelect.Option key={`${subIndex}`} value={`${subItem.value}`}>{subItem.name}</TagSelect.Option>
                              })
                            }
                          </TagSelect>
                        )}
                      </FormItem>
                    </StandardFormRow>
                  )
                })              
              }
              <FormItem label='选择日期' >
                {getFieldDecorator('supplier_datePick')(
                  <RangePicker style={{width:542}} onChange={this.handleSupplierFormSubmit}/>
                )}
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false}>
            <Table columns={supplierColumns} dataSource={singleGoodsSuppliers} onChange={this.handleSupplierAndSort} pagination={supplierPagination} rowKey='id'></Table>
          </Card>
        </div>
        <div style={{display: activeTabKey == 'stock' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                goodsDetailFilter.map( (item,index) => {
                  return (
                    <StandardFormRow key={`${index}`} title={`${item.name}`} block>
                      <FormItem>
                        {getFieldDecorator(`stock_${item.code}`)(
                          <TagSelect expandable >
                            {
                              item.options.map( (subItem,subIndex) => {
                                return <TagSelect.Option key={`${subIndex}`} value={`${subItem.value}`}>{subItem.name}</TagSelect.Option>
                              })
                            }
                          </TagSelect>
                        )}
                      </FormItem>
                    </StandardFormRow>
                  )
                })              
              }
              <FormItem label='选择日期' >
                {getFieldDecorator('stock_datePick')(
                  <RangePicker style={{width:542}}/>
                )}
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false}>
            <Table columns={stockColumns} dataSource={singleGoodsStocks} expandedRowRender={stockExpandedRowRender } onChange={this.handleStockSort} pagination={false} rowKey='id'></Table>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}






