import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Select,Menu,Dropdown,Popconfirm,Divider,Form,DatePicker} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardFormRow from '../../../components/antd-pro/StandardFormRow';
import TagSelect from '../../../components/antd-pro/TagSelect';
import styles from './GoodsList.less'
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@Form.create()
@connect(state => ({
  goodsList:state.goodsList,
  layoutFilter:state.layoutFilter
}))
export default class GoodsList extends PureComponent {

  state = {
    activeTabKey: 'sale',
    sortSale: {
      created_at: 'desc'
    },
    sortPurchase: {
      created_at: 'desc'
    },
    sortSaleOptions: [{
      name:'创建时间降序',
      id:1,
      sorts: {
        created_at: 'desc'
      }
    },{
      name:'创建时间升序',
      id:2,
      sorts: {
        created_at: 'asc'
      }
    },{
      name:'更新时间降序',
      id:3,
      sorts: {
        updated_at: 'desc'
      }
    },{
      name:'更新时间升序',
      id:4,
      sorts: {
        updated_at: 'asc'
      }
    },{
      name:'销售量降序',
      id:5,
      sorts: {
        sales_quantity: 'desc'
      }
    },{
      name:'销售量升序',
      id:6,
      sorts: {
        sales_quantity: 'asc'
      }
    },{
      name:'销售额降序',
      id:7,
      sorts: {
        sales_amount: 'desc'
      }
    },{
      name:'销售额升序',
      id:8,
      sorts: {
        sales_amount: 'asc'
      }
    },{
      name:'库存量降序',
      id:9,
      sorts: {
        stock_quantity: 'desc'
      }
    },{
      name:'库存量升序',
      id:10,
      sorts: {
        stock_quantity: 'asc'
      }
    }],
    sortPurchaseOptions: [{
      name:'创建时间降序',
      id:1,
      sorts: {
        created_at: 'desc'
      }
    },{
      name:'创建时间升序',
      id:2,
      sorts: {
        created_at: 'asc'
      }
    },{
      name:'更新时间降序',
      id:3,
      sorts: {
        updated_at: 'desc'
      }
    },{
      name:'更新时间升序',
      id:4,
      sorts: {
        updated_at: 'asc'
      }
    },{
      name:'进货量降序',
      id:5,
      sorts: {
        purchase_quantity: 'desc'
      }
    },{
      name:'进货量升序',
      id:6,
      sorts: {
        purchase_quantity: 'asc'
      }
    },{
      name:'进货额降序',
      id:7,
      sorts: {
        purchase_amount: 'desc'
      }
    },{
      name:'进货额升序',
      id:8,
      sorts: {
        purchase_amount: 'asc'
      }
    },{
      name:'库存量降序',
      id:9,
      sorts: {
        stock_quantity: 'desc'
      }
    },{
      name:'库存量升序',
      id:10,
      sorts: {
        stock_quantity: 'asc'
      }
    }]
  }

  componentDidMount() {
    this.props.dispatch({type:'goodsList/getGoodsList'})
  }
  
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

  handleDeleteSingleGoods = (item) => {
    this.props.dispatch({type:'goodsList/deleteSingleGoods',payload:{
      id:item.id
    }})
  }

  handleSaleFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'goodsList/setFilterSaleServerData',payload:{
            ...value,
            sale_datePick: value['sale_datePick'] ? [value['sale_datePick'][0].format('YYYY-MM-DD'),value['sale_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          this.props.dispatch({type:'goodsList/getGoodsSaleList',payload:this.props.goodsList.filterSaleServerData})
        }
      })
    }, 0)
  }

  handlePurchaseFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'goodsList/setFilterPurchaseServerData',payload:{
            ...value,
            purchase_datePick: value['purchase_datePick'] ? [value['purchase_datePick'][0].format('YYYY-MM-DD'),value['purchase_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          this.props.dispatch({type:'goodsList/getGoodsPurchaseList',payload:this.props.goodsList.filterPurchaseServerData})
        }
      })
    }, 0)
  }

  handleSelectSort = (type,value) => {
    let targetName = value.slice(6,value.length)
    if(type == 'sale') {
      let sortSale = this.state.sortSaleOptions.find( item => item.name == targetName).sorts;
      this.setState({sortSale})
      this.props.dispatch({type:'goodsList/getGoodsSaleList',payload:{
        sorts: {...sortSale},
        per_page: this.props.goodsList.goodsSalePagination.per_page,
        page: this.props.goodsList.goodsSalePagination.current_page
      }})
    }else if(type == 'purchase') {
      let sortPurchase = this.state.sortPurchaseOptions.find( item => item.name == targetName).sorts;
      this.setState({sortPurchase})
      this.props.dispatch({type:'goodsList/getGoodsPurchaseList',payload:{
        sorts:{...sortPurchase},
        per_page: this.props.goodsList.goodsPurchasePagination.per_page,
        page: this.props.goodsList.goodsPurchasePagination.current_page
      }})
    }
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
            <Menu.Item key="3"><Popconfirm title="确认删除此商品?" onConfirm={this.handleDeleteSingleGoods.bind(null,item)}>删除</Popconfirm></Menu.Item>
          </Menu>
        }>
        <a className="ant-dropdown-link">更多<Icon type="down" /></a>
        </Dropdown>
      </div>
    )
  }

  render() {
    const {activeTabKey,sortSaleOptions,sortPurchaseOptions,sortSale,sortPurchase} = this.state
    const {goodsListSales,goodsListPurchases,goodsSalePagination,goodsPurchasePagination} = this.props.goodsList
    const {goodsSaleFilter,goodsPurchaseFilter} = this.props.layoutFilter
    const {getFieldDecorator} = this.props.form
    const {dispatch} = this.props;

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

    const sortSaleExtra = (
      <Select style={{ width: 200 }}  defaultValue={'排序方式: 创建时间降序'} onChange={this.handleSelectSort.bind(null,'sale')} optionLabelProp='value'>
        {
          sortSaleOptions.map( item => {
            return <Option key={item.id} value={`排序方式: ${item.name}`}>{item.name}</Option>
          })
        }
      </Select>
    )

    const sortPurchaseExtra = (
      <Select style={{ width: 200 }}  defaultValue={'排序方式: 创建时间降序'} onChange={this.handleSelectSort.bind(null,'purchase')} optionLabelProp='value'>
        {
          sortPurchaseOptions.map( item => {
            return <Option key={item.id} value={`排序方式: ${item.name}`}>{item.name}</Option>
          })
        }
      </Select>
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

    const salePagination = {
      pageSize:goodsSalePagination.per_page,
      total:goodsSalePagination.total,
      showQuickJumper:true,
      showSizeChanger:true,
      hideOnSinglePage:true,
      onChange( pageNumber ){
        dispatch({type:'goodsList/getGoodsSaleList',payload:{
          per_page:goodsSalePagination.per_page,
          page:pageNumber,
          sorts: {...sortSale}
        }})
       }
    }

    const putchasePagination = {
      pageSize:goodsPurchasePagination.per_page,
      total:goodsPurchasePagination.total,
      showQuickJumper:true,
      showSizeChanger:true,
      hideOnSinglePage:true,
      onChange( pageNumber ){
        dispatch({type:'goodsList/getGoodsPurchaseList',payload:{
          per_page:goodsPurchasePagination.per_page,
          page:pageNumber,
          sorts:{...sortPurchase}
        }})
       }
    }

    return (
      <PageHeaderLayout
        className={styles.goodsListExtra}
        tabList={tabList}
        activeTabKey={activeTabKey}
        extraContent={extra}
        onTabChange={this.handleTabChange}
      >
        <div style={{display: activeTabKey == 'sale' ? 'block' : 'none'}} >
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                goodsSaleFilter.map( (item,index) => {
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
          <Card bordered={false} title='商品' className={styles.goodsList} extra={sortSaleExtra}> 
            <Table 
              rowKey='id'
              columns={salesColumns} 
              dataSource={goodsListSales} 
              pagination={salePagination}
            >
            </Table>
          </Card>
        </div>  
        <div style={{display: activeTabKey == 'purchase' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                goodsPurchaseFilter.map( (item,index) => {
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
          <Card bordered={false} title='商品' className={styles.goodsList} extra={sortPurchaseExtra}>
              <Table 
                rowKey='id'
                columns={purchaseColumns} 
                dataSource={goodsListPurchases} 
                pagination={putchasePagination}
              >
              </Table>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
