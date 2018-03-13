import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import moment from 'moment';
import classNames from 'classnames/bind'
import currency from 'currency.js'
import {imageApiBase} from '../../../common/index'
import { Row, Col, Card, Button, message, Table,Icon,Select,Menu,Dropdown,Popconfirm,Divider,Form,DatePicker} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardFormRow from '../../../components/antd-pro/StandardFormRow';
import TagSelect from '../../../components/DuokeTagSelect';
import styles from './GoodsList.less'
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const agoSevenDays = new Date((new Date).getTime() - 7*24*60*60*1000)
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const NCNI = value => currency(value, { symbol: "", precision: 0});
let cx = classNames.bind(styles);
const tabList = [{
  key: 'sale',
  tab: '销售'
},{
  key: 'purchase',
  tab: '进货'
}]
const sortSaleOptions = [{
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
}]
const sortPurchaseOptions = [{
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
    pagesSale: {
      per_page:10,
      page:1,
    },
    pagesPurchase: {
      per_page:10,
      page:1,
    },
    filterSale: {
      date_type:'custom',
      sday: moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD').format('YYYY-MM-DD'),
      eday: moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD'),
    },
    filterPurchase: {
      date_type:'custom',
      sday: moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD').format('YYYY-MM-DD'),
      eday: moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD'),
    }
  }

  componentDidMount() {
    this.props.dispatch({type:'goodsList/getGoodsList'})
    this.props.dispatch({type:'layoutFilter/getLayoutFilter'})
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

  handleGetSaleList = (filter,pages,sorts) => {
    this.props.dispatch({type:'goodsList/getGoodsSaleList',payload:{
      ...filter,
      ...pages,
      sorts
    }})
  }

  handleGetPurchaseList = (filter,pages,sorts) => {
    this.props.dispatch({type:'goodsList/getGoodsPurchaseList',payload:{
      ...filter,
      ...pages,
      sorts
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
          const filterSale = {...this.props.goodsList.filterSaleServerData}
          const pagesSale = {...this.state.pagesSale,page:1}
          this.setState({filterSale,pagesSale})
          this.handleGetSaleList(filterSale,pagesSale,this.state.sortSale)
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
          const filterPurchase = {...this.props.goodsList.filterPurchaseServerData}
          const pagesPurchase = {...this.state.pagesPurchase,page:1}
          this.setState({filterPurchase,pagesPurchase})
          this.handleGetPurchaseList(filterPurchase,pagesPurchase,this.state.sortPurchase)
        }
      })
    }, 0)
  }

  handleSelectSortSale = (value) => {
    let sortSale = sortSaleOptions.find( item => item.name == value.slice(6,value.length)).sorts;
    this.setState({sortSale})
    this.handleGetSaleList(this.state.filterSale,this.state.pagesSale,sortSale)
  }

  handleSelectSortPurchase = (value) => {
    let sortPurchase = sortPurchaseOptions.find( item => item.name == value.slice(6,value.length)).sorts;
    this.setState({sortPurchase})
    this.handleGetSaleList(this.state.filterPurchase,this.state.pagesPurchase,sortPurchase)
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
            { item.not_sale == 0 ? (
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
    const {activeTabKey,sortSale,sortPurchase,pagesSale,pagesPurchase,filterSale,filterPurchase} = this.state
    const {goodsListSales,goodsListPurchases,goodsSalePagination,goodsPurchasePagination} = this.props.goodsList
    const {goodsSaleFilter,goodsPurchaseFilter} = this.props.layoutFilter
    const {getFieldDecorator} = this.props.form


    const extra = (
      <Button type='primary' onClick={this.handleToGoodsCreate}>新建商品</Button>
    )

    const sortSaleExtra = (
      <Select style={{ width: 200 }}  defaultValue={'排序方式: 创建时间降序'} onChange={this.handleSelectSortSale} optionLabelProp='value'>
        {
          sortSaleOptions.map( item => {
            return <Option key={item.id} value={`排序方式: ${item.name}`}>{item.name}</Option>
          })
        }
      </Select>
    )

    const sortPurchaseExtra = (
      <Select style={{ width: 200 }}  defaultValue={'排序方式: 创建时间降序'} onChange={this.handleSelectSortPurchase} optionLabelProp='value'>
        {
          sortPurchaseOptions.map( item => {
            return <Option key={item.id} value={`排序方式: ${item.name}`}>{item.name}</Option>
          })
        }
      </Select>
    )

    const salesColumns = [{
      title: '',
      dataIndex:'image',
      width: 60,
      render: (text,record) => record.itemimage_names.length == 0 ? null : <img src={`${imageApiBase}/${record.itemimage_names[0]}`} style={{width: 42,height: 42}} alt='未显示' />
    },{
      title: '货号',
      dataIndex: 'item_ref',
      width:'10%'
    }, {
      title: '标准价',
      dataIndex: 'standard_price',
      width:'15%',
      className: styles['numberRightMove'],
      render:(text,record) => NCNF(record.standard_price).format(true)
    }, {
      title: '销售量',
      dataIndex: 'sales_quantity',
      width:'15%',
      className: styles.numberRightMove,
      render:(text,record) => NCNI(record.sales_quantity).format(true)
    }, {
      title: '销售额',
      dataIndex: 'sales_amount',
      width:'15%',
      className: styles.numberRightMove,
      render:(text,record) => NCNF(record.sales_amount).format(true)
    }, {
      title: '库存量',
      dataIndex: 'stock_quantity',
      width:'15%',
      className: styles['numberRightMove'],
      render:(text,record) => NCNI(record.stock_quantity).format(true)
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
      width:'172px',  
      render: (text,record,index) =>( this.handleMoreOperation(record) )
    }]

    const purchaseColumns = [{
      title: '',
      dataIndex:'image',
      width: 60,
      render: (text,record) => record.itemimage_names.length == 0 ? null : <img src={`${imageApiBase}/${record.itemimage_names[0]}`} style={{width: 42,height: 42}} alt='未显示' />
    }, {
      title: '货号',
      dataIndex: 'item_ref',
      width:'10%'
    }, {
      title: '标准价',
      dataIndex: 'standard_price',
      width:'15%',
      className: styles['numberRightMove'],
      render:(text,record) => NCNF(record.standard_price).format(true)
    }, {
      title: '进货量',
      width:'15%',
      dataIndex: 'purchase_quantity',
      className: styles['numberRightMove'],
      render:(text,record) => NCNI(record.purchase_quantity).format(true)
    }, {
      title: '进货额',
      width:'15%',
      dataIndex: 'purchase_amount',
      className: styles['numberRightMove'],
      render:(text,record) => NCNF(record.purchase_amount).format(true)
    }, {
      title: '库存量',
      width:'15%',
      dataIndex: 'stock_quantity',
      className: styles['numberRightMove'],
      render:(text,record) => NCNI(record.stock_quantity).format(true)
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
      width:'172px', 
      render: (text,record,index) =>( this.handleMoreOperation(record) )
    }];

    const salePagination = {
      pageSize:pagesSale.per_page,
      total:goodsSalePagination.total,
      showQuickJumper:true,
      showSizeChanger:true,
      onChange: ( pageNumber,pageSize ) => {
        const pagesSale = {
          per_page:pageSize,
          page:pageNumber
        }
        this.setState({pagesSale})
        this.handleGetSaleList(filterSale,pagesSale,sortSale)
      },
       onShowSizeChange: (current,size) => {
        const pagesSale = {
          per_page:size,
          page:1
        }
        this.setState({pagesSale})
        this.handleGetSaleList(filterSale,pagesSale,sortSale)
      },
    }

    const putchasePagination = {
      pageSize:pagesPurchase.per_page,
      total:goodsPurchasePagination.total,
      showQuickJumper:true,
      showSizeChanger:true,
      onChange: ( pageNumber,pageSize ) => {
        const pagesPurchase = {
          per_page:pageSize,
          page:pageNumber
        }
        this.setState({pagesPurchase})
        this.handleGetPurchaseList(filterPurchase,pagesPurchase,sortPurchase)
      },
      onShowSizeChange: (current,size) => {
        const pagesPurchase = {
          per_page:size,
          page:1
        }
        this.setState({pagesPurchase})
        this.handleGetPurchaseList(filterPurchase,pagesPurchase,sortPurchase)
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
        <div style={{display: activeTabKey == 'sale' ? 'block' : 'none'}} key='sale'>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                goodsSaleFilter.map( (item,index) => {
                  return item.options.length == 0 ? null : (
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
                {getFieldDecorator('sale_datePick',{
                  initialValue:[moment(agoSevenDays,'YYYY-MM-DD'),moment(new Date(),'YYYY-MM-DD')]
                })(
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
            <div style={{marginTop:-43,width:300}}>
              <span>{`共 ${goodsSalePagination.total || ''} 件商品 第 ${pagesSale.page} / ${Math.ceil(Number(goodsSalePagination.total)/Number(pagesSale.per_page))} 页`}</span>
            </div>
          </Card>
        </div>  
        <div style={{display: activeTabKey == 'purchase' ? 'block' : 'none'}} key='purchase'>
          <Card bordered={false} className={cx({bottomCardDivided:true,specialCardBody:true})} >
            <Form layout='inline'>
              {
                goodsPurchaseFilter.map( (item,index) => {
                  return item.options.length == 0 ? null : (
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
                {getFieldDecorator('purchase_datePick',{
                  initialValue:[moment(agoSevenDays,'YYYY-MM-DD'),moment(new Date(),'YYYY-MM-DD')]
                })(
                  <RangePicker style={{width:542}} onChange={this.handlePurchaseFormSubmit}/>
                )}
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false} title='商品' className={cx({goodsList:true,specialCardBody:true,specialCardHead:true})} extra={sortPurchaseExtra}>
            <Table 
              rowKey='id'
              columns={purchaseColumns} 
              dataSource={goodsListPurchases} 
              pagination={putchasePagination}
            >
            </Table>
            <div style={{marginTop:-43,width:300}}>
              <span>{`共 ${goodsPurchasePagination.total || ''} 件商品 第 ${pagesPurchase.page} / ${Math.ceil(Number(goodsPurchasePagination.total)/Number(pagesPurchase.per_page))} 页`}</span>
            </div>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
