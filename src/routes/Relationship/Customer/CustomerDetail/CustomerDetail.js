import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js'
import { Row, Col, Card, Button,Icon,Menu,Dropdown,Popconfirm,Divider,Radio,Table,Form,DatePicker} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import StandardFormRow from '../../../../components/antd-pro/StandardFormRow';
import DescriptionList from '../../../../components/antd-pro/DescriptionList';
import LightBoxImage from '../../../../components/LightBoxImage/LightBoxImage'
import TagSelect from '../../../../components/DuokeTagSelect';
import styles from './CustomerDetail.less'
const { Description } = DescriptionList;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const NCNI = value => currency(value, { symbol: "", precision: 0});
const agoSevenDays = new Date((new Date).getTime() - 7*24*60*60*1000)
const tabList = [{
  key:'detail',
  tab:'详情'
},{
  key:'finance',
  tab:'欠款'
},{
  key:'sale',
  tab:'交易历史'
},{
  key:'goods',
  tab:'商品历史'
},{
  key:'payment',
  tab:'收银历史'
}]
const tabListNoTitle = [{
  key: 'balance',
  tab: '当前余额',
}, {
  key: 'sale',
  tab: '未结算销售单',
}, {
  key: 'settle',
  tab: '未付款结算单',
}];
const salePagination = {
  showQuickJumper: true,
  showSizeChanger: true,
}
const goodsPagination = {
  showQuickJumper: true,
  showSizeChanger: true,
}
const paymentPagination = {
  showQuickJumper: true,
  showSizeChanger: true,
}
const salesorderPagination = {
  showQuickJumper: true,
  showSizeChanger: true,
}
const settlesorderPagination = {
  showQuickJumper: true,
  showSizeChanger: true,
}
@Form.create()
@connect(state => ({
  customerDetail: state.customerDetail
}))
export default class CustomerDetail extends PureComponent {

  state = {
    activeTabKey : 'detail',
    activeBlanceTabKey: 'balance',
    sortSaleHistory: {
      sorts:{
        created_at:'desc'
      }
    },
    filterSaleHistory: {
      date_type:'custom',
      sday: moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD').format('YYYY-MM-DD'),
      eday: moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD'),
    },
    pageSaleHistory: {
      page:1,
      per_page:10
    },
    sortGoodsHistory: {
      sorts:{
        purchase_time: 'desc'
      }
    },
    filterGoodsHistory: {
      date_type:'custom',
      sday: moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD').format('YYYY-MM-DD'),
      eday: moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD'),
    },
    pageGoodsHistory: {
      page:1,
      per_page:10
    },
    sortPaymentHistory: {
      sorts:{
        created_at:'desc'
      }
    },
    filterPaymentHistory: {
      date_type:'custom',
      sday: moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD').format('YYYY-MM-DD'),
      eday: moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD'),
    },
    pagePaymentHistory: {
      page:1,
      per_page:10
    },
    pageSalesorder: {
      page:1,
      per_page:10
    },
    pageStatement: {
      page:1,
      per_page:10
    }
  }

  handleTabChange = (key) => {
    this.setState({activeTabKey:key})
  }

  handleBlanceTabChange = (key) => {
    this.setState({activeBlanceTabKey:key})
  }

  handleDeleteSingleCustomer = (id) => {
    this.props.dispatch({type:'customerDetail/deleteSingle',payload:id}).then(()=>{
      this.props.dispatch(routerRedux.push('/relationship/customer-list'))
    })
  }

  handleChangeCustomerStatus = (id,status) => {
    this.props.dispatch({type:'customerDetail/changeCustomerStatus',payload:{
      id: id,
      freeze: status == 1 ? 0 : 1
    }})
  }

  handleToCustomerEdit = () => {
    this.props.dispatch(routerRedux.push(`/relationship/customer-edit/${this.props.customerDetail.currentId.id}`))
  }

  handleSaleHistorySort = (pagination,filter,sorter) => {
    let pageSaleHistory = {
      page:pagination.current,
      per_page:pagination.pageSize
    }
    this.setState({pageSaleHistory})
    let sortSaleHistory = {
      sorts:{}
    }
    if(sorter.field) {
      sortSaleHistory.sorts[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
    }else {
      sortSaleHistory.sorts = {
        created_at:'desc'
      }
    }
    this.setState({sortSaleHistory})
    this.props.dispatch({type:'customerDetail/getSaleHistory',payload:{
      ...this.state.filterSaleHistory,
      ...sortSaleHistory,
      id:this.props.customerDetail.currentId.id
    }})
  }

  handleSaleFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'customerDetail/setFilterSaleServerData',payload:{
            ...value,
            sale_datePick: value['sale_datePick'] ? [value['sale_datePick'][0].format('YYYY-MM-DD'),value['sale_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          const filterSaleHistory = this.props.customerDetail.filterSaleServerData;
          this.setState({filterSaleHistory})
          this.props.dispatch({type:'customerDetail/getSaleHistory',payload:{
            ...filterSaleHistory,
            ...this.state.sortSaleHistory,
            id:this.props.customerDetail.currentId.id,
          }})
        }
      })
    }, 0)
  }

  handleGoodsHistorySort = (pagination,filter,sorter) => {
    let pageGoodsHistory = {
      page:pagination.current,
      per_page:pagination.pageSize
    }
    this.setState({pageGoodsHistory})
    let sortGoodsHistory = {
      sorts:{}
    }
    if(sorter.field) {
      sortGoodsHistory.sorts[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
    }else {
      sortGoodsHistory.sorts = {
        purchase_time: 'desc'
      }
    }
    this.setState({sortGoodsHistory})
    this.props.dispatch({type:'customerDetail/getGoodsHistory',payload:{
      ...this.state.filterGoodsHistory,
      ...sortGoodsHistory,
      id:this.props.customerDetail.currentId.id
    }})
  }

  handleGoodsFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'customerDetail/setFilterGoodsServerData',payload:{
            ...value,
            goods_datePick: value['goods_datePick'] ? [value['goods_datePick'][0].format('YYYY-MM-DD'),value['goods_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          const filterGoodsHistory = this.props.customerDetail.filterGoodsServerData;
          this.setState({filterGoodsHistory})
          this.props.dispatch({type:'customerDetail/getGoodsHistory',payload:{
            ...filterGoodsHistory,
            ...this.state.sortGoodsHistory,
            id:this.props.customerDetail.currentId.id,
          }})
        }
      })
    }, 0)
  }

  handlePaymentHistorySort = (pagination,filter,sorter) => {
    let pagePaymentHistory = {
      page:pagination.current,
      per_page:pagination.pageSize
    }
    this.setState({pagePaymentHistory})
    let sortPaymentHistory = {
      sorts:{}
    }
    if(sorter.field) {
      sortPaymentHistory.sorts[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
    }else {
      sortPaymentHistory.sorts = {
        created_at:'desc'
      }
    }
    this.setState({sortPaymentHistory})
    this.props.dispatch({type:'customerDetail/getPaymentHistory',payload:{
      ...this.state.filterPaymentHistory,
      ...sortPaymentHistory,
      id:this.props.customerDetail.currentId.id
    }})
  }

  handlePaymentFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'customerDetail/setFilterPurchaseServerData',payload:{
            ...value,
            payment_datePick: value['payment_datePick'] ? [value['payment_datePick'][0].format('YYYY-MM-DD'),value['payment_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          const filterPaymentHistory = this.props.customerDetail.filterPaymentServerData
          this.setState({filterPaymentHistory})
          this.props.dispatch({type:'customerDetail/getPaymentHistory',payload:{
            ...filterPaymentHistory,
            ...this.state.sortPaymentHistory,
            id:this.props.customerDetail.currentId.id,
          }})
        }
      })
    }, 0)
  }

  handleSalesorderSort = (pagination,filter,sorter) => {
    let pageSalesorder = {
      page:pagination.current,
      per_page:pagination.pageSize
    }
    this.setState({pageSalesorder})
    let salesorderSort = {
      sorts:{}
    }
    if(sorter.field) {
      salesorderSort.sorts[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
    }else {
      salesorderSort.sorts = {
        created_at: 'desc'
      }
    }
    this.props.dispatch({type:'customerDetail/getSalesorder',payload:{
      ...salesorderSort,
      id:this.props.customerDetail.currentId.id,
    }})
  }

  handleStatementSort = (pagination,filter,sorter) => {
    let pageStatement = {
      page:pagination.current,
      per_page:pagination.pageSize
    }
    this.setState({pageStatement})
    let statementSort = {
      sorts: {}
    }
    if(sorter.field) {
      statementSort.sorts[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
    }else {
      statementSort.sorts = {
        created_at: 'desc'
      }
    }
    this.props.dispatch({type:'customerDetail/getStatement',payload:{
      ...statementSort,
      id:this.props.customerDetail.currentId.id,
    }})
  }

  render() {
    const {singleCustomerDetail,singleCustomerFinance,singleCustomerSaleHistory,singleCustomerGoodsHistory,singleCustomerPaymentHistory,singleCustomerSalesorders,singleCustomerStatements,saleHistoryFilter,goodsHistoryFilter,paymentHistoryFilter,currentId} = this.props.customerDetail;
    const {activeTabKey,activeBlanceTabKey,pageSaleHistory,pageGoodsHistory,pagePaymentHistory,pageSalesorder,pageStatement} = this.state;
    const {getFieldDecorator} = this.props.form
    const description = (
      <DescriptionList size="small" col="2" className={styles.descriptionPostion}>
        <Description term="手机号">{`${singleCustomerDetail.phone || ''}`}</Description>
        <Description term="客户等级">{`${singleCustomerDetail.vip || ''}`}</Description>
        <Description term="欠款">{`${singleCustomerDetail.debt || 0}`}</Description>
        <Description term="积分">{`${singleCustomerDetail.total_points || 0}`}</Description>
      </DescriptionList>
    )
    const menu = (
      <Menu>
        <Menu.Item key='1'>
          <Popconfirm title="确认删除此客户?" placement='bottom' onConfirm={this.handleDeleteSingleCustomer.bind(null,currentId.id)}>删除</Popconfirm>
        </Menu.Item>
      </Menu>
    )

    const action = (
      <div>
        <ButtonGroup>
            <Popconfirm title={singleCustomerDetail.freeze == 1 ? '确定解冻此客户' : '确定冻结此客户'} placement='bottom' onConfirm={this.handleChangeCustomerStatus.bind(null,currentId.id,singleCustomerDetail.freeze)}><Button >{singleCustomerDetail.freeze == 1 ? '解冻' : '冻结'}</Button></Popconfirm>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
        <Button type="primary" onClick={this.handleToCustomerEdit}>编辑</Button>
      </div>
    )

    const saleColumns = [{
      title: '单号',
      dataIndex: 'number',
      width:'15%',
      render: (text,record) => (`#${record.number}`)
    },{
      title: '业绩归属员工',
      dataIndex: 'seller',
      width:'15%',
      render: (text,record) => (`${record.seller.data.name}`)
    },{
      title: '商品数量',
      dataIndex: 'quantity',
      className: styles['numberRightMove'],
      width:'15%',
      sorter:true,
      render: (text,record) => NCNI(record.quantity).format(true)
    },{
      title: '总额',
      dataIndex: 'due_fee',
      className: styles['numberRightMove'],
      width:'20%',
      sorter:true,
      render: (text,record) => NCNF(record.due_fee).format(true)
    },{
      title: '创建时间',
      dataIndex: 'created_at',
      width:'25%',
      sorter:true,
    },{
      title: '操作',
      dataIndex: 'operation',
      width:'10%',
      render: (text,record) => (<a>查看</a>)
    }]

    const goodsColumns = [{
      title: '货号',
      dataIndex: 'item_ref',
      width:'15%',
    },{
      title: '购买量',
      dataIndex: 'item_quantity',
      width:'20%',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNI(record.item_quantity).format(true)
    },{
      title: '购买额',
      dataIndex: 'item_value',
      width:'30%',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNF(record.item_value).format(true)
    },{
      title: '最后购买时间',
      width:'25%',
      dataIndex: 'purchase_time',
      sorter:true,
    },{
      title: '操作',
      width:'10%',
      dataIndex: 'operation',
      render: (text,record) => (<Link to={`/relationship/customer-detail/goods-purchase-detail/${currentId.id}/${record.id}`}>查看</Link>)
    }]

    const paymentColumns = [{
      title: '流水号',
      dataIndex: 'number',
      width:'25',
      render:(text,record) => (`#${record.number}`)
    },{
      title: '收银方式',
      dataIndex: 'paymentmethod',
      width:'20%',
      render:(text,record) => (`${record.paymentmethod.name}`)
    },{
      title: '金额',
      dataIndex: 'value',
      sorter:true,
      width:'20%',
      className: styles['numberRightMove'],
      render: (text,record) => NCNF(record.value).format(true)
    },{
      title: '创建时间',
      width:'25%',
      dataIndex: 'created_at',
      sorter:true,
    },{
      title: '操作',
      dataIndex: 'operation',
      width:'10%',
      render: (text,record) => (<a>查看</a>)
    }]

    const salesorderColumns = [{
      title:'单号',
      dataIndex: 'number',
      width:'15%',
      render:(text,record) => (`#${record.number}`)
    },{
      title:'商品数量',
      dataIndex:'quantity',
      width:'20%',
      sorter:true,
      className: styles['numberRightMove'],
      render: (text,record) => NCNI(record.quantity).format(true)
    },{
      title:'未付总款',
      dataIndex:'due_fee',
      width:'30%',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNF(record.due_fee).format(true)
    },{
      title:'创建时间',
      width:'25%',
      dataIndex:'created_at',
      sorter:true,
    },{
      title:'操作',
      width:'10%',
      dataIndex:'operation',
      render:(text,record) => (<a>查看</a>)
    }]

    const statementColumns = [{
      title:'单号',
      dataIndex: 'number',
      width:'15%',
      render:(text,record) => (`#${record.number}`)
    },{
      title:'单据数量',
      dataIndex: 'order_quantity',
      width:'20%',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNI(record.order_quantity).format(true)
    },{
      title:'未付总款',
      dataIndex: 'need_pay',
      width:'30%',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNF(record.need_pay).format(true)
    },{
      title:'创建时间',
      width:'25%',
      dataIndex:'created_at',
      sorter:true,
    },{
      title:'操作',
      width:'10%',
      dataIndex: 'operation',
      render:(text,record) => (<a>查看</a>)
    }]

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    return (
      <PageHeaderLayout
        title={`单号：${singleCustomerDetail.name || ''}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description}
        activeTabKey={activeTabKey}
        action={action}
        tabList={tabList}
        onTabChange={this.handleTabChange}
      >
        <Card bordered={false} style={{display: activeTabKey == 'detail' ? 'block' : 'none'}}>
          <div className={styles.title}>基本资料</div>
          {
            singleCustomerDetail.basicDetail  && !!singleCustomerDetail.basicDetail.length ? (
              <div>
                <Row gutter={32}>
                  {
                      singleCustomerDetail.basicDetail.map( (item,index) => {
                      return (
                        <Col span={12} key={index} style={{marginBottom: 16}}>
                          <label className={styles.labelTitle}>{`${item.parentName}： `}</label><span>{item.name}</span>
                        </Col>
                      )
                    })
                  }
                </Row>
              </div>
            ) : null
          }
          {singleCustomerDetail.imageFiles && !!singleCustomerDetail.imageFiles.length ? <div><Divider style={{ marginBottom: 32 }} /><div className={styles.title}>附件</div></div> : null}
          <LightBoxImage imageSource = {singleCustomerDetail.imageFiles || []} />
          { singleCustomerDetail.addresses && !!singleCustomerDetail.addresses.length ? <div><Divider style={{ marginBottom: 32 }} /><div className={styles.title}>地址</div></div> : null}
          {
            singleCustomerDetail.addresses  && singleCustomerDetail.addresses.map( (item,index) => {
              return (
                <div key={item.id}>
                  {index > 0 ? <Divider style={{marginBottom: 20}} /> : null}
                  <Row>
                    <Col span={5}>
                      <label className={styles.labelTitle}>收货人：</label><span>{item.name || ''}</span>
                    </Col>
                    <Col span={6}>
                      <label className={styles.labelTitle}>手机号：</label><span>{item.phone}</span>
                    </Col>
                    <Col span={11}>
                      <label className={styles.labelTitle}>收货地址：</label><span>{item.address}</span>
                    </Col>
                    <Col span={2}>
                      { item.default == 1 ?  <Radio className={styles.labelTitle} checked={true}>默认地址</Radio> : null }
                    </Col>
                  </Row>
                </div>
              )
            })
          }
        </Card>
        <div style={{display: activeTabKey == 'finance' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Row>
              <Col span={8}>
                <Info title="当前余额" value={singleCustomerFinance.balance || '0.00'} bordered />
              </Col>
              <Col span={8}>
                <Info title="未结算销售单" value={singleCustomerFinance.salesorder_unpaid || '0.00'} bordered />
              </Col>
              <Col span={8}>
                <Info title="未付款结算单" value={singleCustomerFinance.statement_unpaid || '0.00'} />
              </Col>
            </Row>
          </Card>
          <Card bordered={false} tabList={tabListNoTitle} onTabChange={this.handleBlanceTabChange}>
            <div style={{display: activeBlanceTabKey == 'balance' ? 'block' : 'none'}}>
             {`emmmm………`}
            </div>
            <div style={{display: activeBlanceTabKey == 'sale' ? 'block' : 'none'}}>
              <Table columns={salesorderColumns} dataSource={singleCustomerSalesorders} onChange={this.handleSalesorderSort} pagination={salesorderPagination} rowKey='id' />
              <div style={{marginTop:-43,width:300}}>
                <span>{`共 ${singleCustomerSalesorders.length || ''} 条销售单 第 ${pageSalesorder.page} / ${Math.ceil(Number(singleCustomerSalesorders.length)/Number(pageSalesorder.per_page))} 页`}</span>
              </div>
            </div>
            <div style={{display: activeBlanceTabKey == 'settle' ? 'block' : 'none'}}>
              <Table columns={statementColumns} dataSource={singleCustomerStatements} onChange={this.handleStatementSort} pagination={settlesorderPagination} rowKey='id' />
              <div style={{marginTop:-43,width:300}}>
                <span>{`共 ${singleCustomerStatements.length || ''} 条结算单 第 ${pageStatement.page} / ${Math.ceil(Number(singleCustomerStatements.length)/Number(pageStatement.per_page))} 页`}</span>
              </div>
            </div>
          </Card>
        </div>
        <div style={{display: activeTabKey == 'sale' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                saleHistoryFilter.map( (item,index) => {
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
                {getFieldDecorator('sale_datePick',{
                  initialValue:[moment(agoSevenDays,'YYYY-MM-DD'),moment(new Date(),'YYYY-MM-DD')]
                })(
                  <RangePicker style={{width:542}} onChange={this.handleSaleFormSubmit}/>
                )}
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false}>
            <Table columns={saleColumns} dataSource={singleCustomerSaleHistory} onChange={this.handleSaleHistorySort} pagination={salePagination} rowKey='id' />
            <div style={{marginTop:-43,width:300}}>
              <span>{`共 ${singleCustomerSaleHistory.length || ''} 条销售单 第 ${pageSaleHistory.page} / ${Math.ceil(Number(singleCustomerSaleHistory.length)/Number(pageSaleHistory.per_page))} 页`}</span>
            </div>
          </Card>
        </div>
        <div style={{display: activeTabKey == 'goods' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                goodsHistoryFilter.map( (item,index) => {
                  return (
                    <StandardFormRow key={`${index}`} title={`${item.name}`} block>
                      <FormItem>
                        {getFieldDecorator(`goods_${item.code}`)(
                          <TagSelect expandable onChange={this.handleGoodsFormSubmit}>
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
                {getFieldDecorator('goods_datePick',{
                  initialValue:[moment(agoSevenDays,'YYYY-MM-DD'),moment(new Date(),'YYYY-MM-DD')]
                })(
                  <RangePicker style={{width:542}} onChange={this.handleGoodsFormSubmit}/>
                )}
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false}>
            <Table columns={goodsColumns} dataSource={singleCustomerGoodsHistory} onChange={this.handleGoodsHistorySort} pagination={goodsPagination} rowKey='id' />
            <div style={{marginTop:-43,width:300}}>
              <span>{`共 ${singleCustomerGoodsHistory.length || ''} 件商品 第 ${pageGoodsHistory.page} / ${Math.ceil(Number(singleCustomerGoodsHistory.length)/Number(pageGoodsHistory.per_page))} 页`}</span>
            </div>
          </Card>
        </div>
        <div style={{display: activeTabKey == 'payment' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                paymentHistoryFilter.map( (item,index) => {
                  return (
                    <StandardFormRow key={`${index}`} title={`${item.name}`} block>
                      <FormItem expandable>
                        {getFieldDecorator(`payment_${item.code}`)(
                          <TagSelect expandable onChange={this.handlePaymentFormSubmit}>
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
                {getFieldDecorator('payment_datePick',{
                  initialValue:[moment(agoSevenDays,'YYYY-MM-DD'),moment(new Date(),'YYYY-MM-DD')]
                })(
                  <RangePicker style={{width:542}} onChange={this.handlePaymentFormSubmit}/>
                )}
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false}>
            <Table columns={paymentColumns} dataSource={singleCustomerPaymentHistory} onChange={this.handlePaymentHistorySort} pagination={paymentPagination} rowKey='id' />
            <div style={{marginTop:-43,width:300}}>
              <span>{`共 ${singleCustomerPaymentHistory.length || ''} 条流水 第 ${pagePaymentHistory.page} / ${Math.ceil(Number(singleCustomerPaymentHistory.length)/Number(pagePaymentHistory.per_page))} 页`}</span>
            </div>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
