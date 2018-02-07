import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js'
import { Row, Col, Card, Button,Icon,Menu,Dropdown,Popconfirm,Divider,Radio,Table,Form,DatePicker} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import StandardFormRow from '../../../../components/antd-pro/StandardFormRow';
import DescriptionList from '../../../../components/antd-pro/DescriptionList';
import TagSelect from '../../../../components/DuokeTagSelect';
import styles from './SupplierDetail.less'
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const NCNI = value => currency(value, { symbol: "", precision: 0});
const { Description } = DescriptionList;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;
const agoSevenDays = new Date((new Date).getTime() - 7*24*60*60*1000)
const tabList = [{
  key:'detail',
  tab:'详情'
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
@Form.create()
@connect(state => ({
  supplierDetail: state.supplierDetail
}))
export default class SupplierDetail extends PureComponent {

  state = {
    activeTabKey : 'detail',
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
  }

  handleTabChange = (key) => {
    this.setState({activeTabKey:key})
  }

  handleDeleteSingleSupplier = (id) => {
    this.props.dispatch({type:'supplierDetail/deleteSingle',payload:id}).then(()=>{
      this.props.dispatch(routerRedux.push('/relationship/supplier-list'))
    })
  }

  handleChangeSupplierStatus = (id,status) => {
    this.props.dispatch({type:'supplierDetail/changeSupplierStatus',payload:{
      id: id,
      freeze: status == 1 ? 0 : 1
    }})
  }

  handleToSupplierEdit = () => {
    this.props.dispatch(routerRedux.push(`/relationship/supplier-edit/${this.props.supplierDetail.currentId.id}`))
  }

  handleSaleHistorySort = (pagination,filter,sorter) => {
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
    this.props.dispatch({type:'supplierDetail/getSaleHistory',payload:{
      ...this.state.filterSaleHistory,
      ...sortSaleHistory,
      id:this.props.supplierDetail.currentId.id
    }})

  }

  handleSaleFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'supplierDetail/setFilterSaleServerData',payload:{
            ...value,
            sale_datePick: value['sale_datePick'] ? [value['sale_datePick'][0].format('YYYY-MM-DD'),value['sale_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          const filterSaleHistory = this.props.supplierDetail.filterSaleServerData;
          this.setState({filterSaleHistory})
          this.props.dispatch({type:'supplierDetail/getSaleHistory',payload:{
            ...filterSaleHistory,
            ...this.state.sortSaleHistory,
            id:this.props.supplierDetail.currentId.id,
          }})
        }
      })
    }, 0)
  }

  handleGoodsHistorySort = (pagination,filter,sorter) => {
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
    this.props.dispatch({type:'supplierDetail/getGoodsHistory',payload:{
      ...this.state.filterGoodsHistory,
      ...sortGoodsHistory,
      id:this.props.supplierDetail.currentId.id
    }})
  }

  handleGoodsFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'supplierDetail/setFilterGoodsServerData',payload:{
            ...value,
            goods_datePick: value['goods_datePick'] ? [value['goods_datePick'][0].format('YYYY-MM-DD'),value['goods_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          const filterGoodsHistory = this.props.supplierDetail.filterGoodsServerData
          this.setState({filterGoodsHistory})
          this.props.dispatch({type:'supplierDetail/getGoodsHistory',payload:{
            ...filterGoodsHistory,
            ...this.state.sortGoodsHistory,
            id:this.props.supplierDetail.currentId.id,
          }})
        }
      })
    }, 0)
  }

  handlePaymentHistorySort = (pagination,filter,sorter) => {
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
    this.props.dispatch({type:'supplierDetail/getPaymentHistory',payload:{
      ...this.state.filterPaymentHistory,
      ...sortPaymentHistory,
      id:this.props.supplierDetail.currentId.id
    }})
  }

  handlePaymentFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'supplierDetail/setFilterPurchaseServerData',payload:{
            ...value,
            payment_datePick: value['payment_datePick'] ? [value['payment_datePick'][0].format('YYYY-MM-DD'),value['payment_datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          const filterPaymentHistory = this.props.supplierDetail.filterPaymentServerData;
          this.setState({filterPaymentHistory})
          this.props.dispatch({type:'supplierDetail/getPaymentHistory',payload:{
            ...filterPaymentHistory,
            ...this.state.sortPaymentHistory,
            id:this.props.supplierDetail.currentId.id,
          }})
        }
      })
    }, 0)
  }

  render() {
    const {singleSupplierDetail,singleSupplierSaleHistory,singleSupplierGoodsHistory,singleSupplierPaymentHistory,saleHistoryFilter,goodsHistoryFilter,paymentHistoryFilter,currentId} = this.props.supplierDetail;
    const {activeTabKey} = this.state;
    const {getFieldDecorator} = this.props.form
    const description = (
      <DescriptionList size="small" col="2" className={styles.descriptionPostion}>
        <Description term="手机号">{`${singleSupplierDetail.phone || ''}`}</Description>
        <Description term="我欠他">{`${singleSupplierDetail.debt || ''}`}</Description>
      </DescriptionList>
    )
    const menu = (
      <Menu>
        <Menu.Item key='1'>
          <Popconfirm title="确认删除此供应商?" placement='bottom' onConfirm={this.handleDeleteSingleSupplier.bind(null,currentId.id)}>删除</Popconfirm>
        </Menu.Item>
      </Menu>
    )

    const action = (
      <div>
        <ButtonGroup>
          <Button onClick={this.handleChangeSupplierStatus.bind(null,currentId.id,singleSupplierDetail.freeze)}>{singleSupplierDetail.freeze == 1 ? '解冻' : '冻结'}</Button>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
        <Button type="primary" onClick={this.handleToSupplierEdit}>编辑</Button>
      </div>
    )

    const saleColumns = [{
      title: '单号',
      dataIndex: 'number',
      render: (text,record) => (`#${record.number}`)
    },{
      title: '入库仓库',
      dataIndex: 'warehouse',
      render: (text,record) => (`${record.warehouse.data.name}`)
    },{
      title: '商品数量',
      dataIndex: 'quantity',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNI(record.quantity).format(true)
    },{
      title: '总额',
      dataIndex: 'due_fee',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNF(record.due_fee).format(true)
    },{
      title: '创建时间',
      dataIndex: 'created_at',
      sorter:true,
    },{
      title: '操作',
      dataIndex: 'operation',
      render: (text,record) => (<a>查看</a>)
    }]

    const goodsColumns = [{
      title: '货号',
      dataIndex: 'item_ref',
    },{
      title: '供应量',
      dataIndex: 'item_quantity',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNI(record.item_quantity).format(true)

    },{
      title: '供应额',
      dataIndex: 'item_value',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNF(record.item_value).format(true)

    },{
      title: '最后供应时间',
      dataIndex: 'purchase_time',
      sorter:true,
    },{
      title: '操作',
      dataIndex: 'operation',
      render: (text,record) => (<Link to={`/relationship/supplier-detail/goods-purchase-detail/${currentId.id}/${record.id}`}>查看</Link>)
    }]

    const paymentColumns = [{
      title: '流水号',
      dataIndex: 'number',
      render:(text,record) => (`#${record.number}`)
    },{
      title: '收银方式',
      dataIndex: 'paymentmethod',
      render:(text,record) => (`${record.paymentmethod.name}`)
    },{
      title: '金额',
      dataIndex: 'value',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNF(record.value).format(true)
    },{
      title: '创建时间',
      dataIndex: 'created_at',
      sorter:true,
    },{
      title: '操作',
      dataIndex: 'operation',
      render: (text,record) => (<a>查看</a>)
    }]
    return (
      <PageHeaderLayout
        title={`单号：${singleSupplierDetail.name || ''}`}
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
            singleSupplierDetail.basicDetail  && !!singleSupplierDetail.basicDetail.length ? (
              <Row gutter={32}>
                {
                    singleSupplierDetail.basicDetail.map( (item,index) => {
                    return (
                      <Col span={12} key={index} style={{marginBottom: 16}}>
                        <label className={styles.labelTitle}>{`${item.parentName}： `}</label><span>{item.name}</span>
                      </Col>
                    )
                  })
                }
              </Row>
            ) : null
          }
          {singleSupplierDetail.imageFiles && !!singleSupplierDetail.imageFiles.length ? <div><Divider style={{ marginBottom: 32 }} /><div className={styles.title}>附件</div></div> : null}
          {
            singleSupplierDetail.imageFiles && singleSupplierDetail.imageFiles.map( (item,index) => {
              return <img src={`${item}`} key={index}  alt='无法显示' style={{width:102,height:102,marginRight:20}}/>
            })
          }
          { singleSupplierDetail.addresses && !!singleSupplierDetail.addresses.length ? <div><Divider style={{ marginBottom: 32 }} /><div className={styles.title}>地址</div></div> : null}
          {
            singleSupplierDetail.addresses  && singleSupplierDetail.addresses.map( (item,index) => {
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
            <Table columns={saleColumns} dataSource={singleSupplierSaleHistory} onChange={this.handleSaleHistorySort} pagination={salePagination} rowKey='id' />
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
            <Table columns={goodsColumns} dataSource={singleSupplierGoodsHistory} onChange={this.handleGoodsHistorySort} pagination={goodsPagination} rowKey='id' />
          </Card>
        </div>
        <div style={{display: activeTabKey == 'payment' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                paymentHistoryFilter.map( (item,index) => {
                  return (
                    <StandardFormRow key={`${index}`} title={`${item.name}`} block>
                      <FormItem expandable >
                        {getFieldDecorator(`payment_${item.code}`)(
                          <TagSelect onChange={this.handlePaymentFormSubmit}>
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
            <Table columns={paymentColumns} dataSource={singleSupplierPaymentHistory} onChange={this.handlePaymentHistorySort} pagination={paymentPagination} rowKey='id' />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
