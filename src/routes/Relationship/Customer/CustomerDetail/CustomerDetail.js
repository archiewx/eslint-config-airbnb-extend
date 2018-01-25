import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Button,Icon,Menu,Dropdown,Popconfirm,Divider,Radio,Table,Form,DatePicker} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import StandardFormRow from '../../../../components/antd-pro/StandardFormRow';
import DescriptionList from '../../../../components/antd-pro/DescriptionList';
import TagSelect from '../../../../components/DuokeTagSelect';
import styles from './CustomerDetail.less'
const { Description } = DescriptionList;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;
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
  customerDetail: state.customerDetail
}))
export default class CustomerDetail extends PureComponent {

  state = {
    activeTabKey : 'detail',
  }

  handleTabChange = (key) => {
    this.setState({activeTabKey:key})
  }

  handleDeleteSingleCustomer = (id) => {
    this.props.dispatch({type:'customerDetail/deleteSingle',payload:id})
  }

  handleChangeCustomerStatus = (id,status) => {
    this.props.dispatch({type:'customerDetail/changeCustomerStatus',payload:{
      id: id,
      freeze: status == 1 ? 0 : 1
    }})
  }

  handleSaleHistorySort = (pagination,filter,sorter) => {
    if(!!Object.keys(sorter).length) {
      let current = {};
      current[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
      this.props.dispatch({type:'customerDetail/getSaleHistory',payload:{
        sorts: current,
        id:this.props.customerDetail.currentId.id
      }})
    }else {
      this.props.dispatch({type:'customerDetail/getSaleHistory',payload: {
        id: this.props.customerDetail.currentId.id,
        sorts:{
          created_at:'desc'
        }
      }})
    }
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
          this.props.dispatch({type:'customerDetail/getSaleHistory',payload:{
            filter:this.props.customerDetail.filterSaleServerData,
            id:this.props.customerDetail.currentId.id,
          }})
        }
      })
    }, 0)
  }

  handleGoodsHistorySort = (pagination,filter,sorter) => {
    if(!!Object.keys(sorter).length) {
      let current = {};
      current[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
      this.props.dispatch({type:'customerDetail/getGoodsHistory',payload:{
        sorts: current,
        id:this.props.customerDetail.currentId.id
      }})
    }else {
      this.props.dispatch({type:'customerDetail/getGoodsHistory',payload: {
        id: this.props.customerDetail.currentId.id,
      }})
    }
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
          this.props.dispatch({type:'customerDetail/getGoodsHistory',payload:{
            filter:this.props.customerDetail.filterGoodsServerData,
            id:this.props.customerDetail.currentId.id,
          }})
        }
      })
    }, 0)
  }

  handlePaymentHistorySort = (pagination,filter,sorter) => {
    if(!!Object.keys(sorter).length) {
      let current = {};
      current[sorter.field] = sorter.order.slice(0,sorter.order.length-3)
      this.props.dispatch({type:'customerDetail/getPaymentHistory',payload:{
        sorts: current,
        id:this.props.customerDetail.currentId.id
      }})
    }else {
      this.props.dispatch({type:'customerDetail/getPaymentHistory',payload: {
        id: this.props.customerDetail.currentId.id,
        sorts:{
          created_at:'desc'
        }
      }})
    }
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
          this.props.dispatch({type:'customerDetail/getPaymentHistory',payload:{
            filter:this.props.customerDetail.filterPaymentServerData,
            id:this.props.customerDetail.currentId.id,
          }})
        }
      })
    }, 0)
  }

  render() {
    const {singleCustomerDetail,singleCustomerFinance,singleCustomerSaleHistory,singleCustomerGoodsHistory,singleCustomerPaymentHistory,saleHistoryFilter,goodsHistoryFilter,paymentHistoryFilter,currentId} = this.props.customerDetail;
    const {activeTabKey} = this.state;
    const {getFieldDecorator} = this.props.form
    const description = (
      <DescriptionList size="small" col="2" className={styles.descriptionPostion}>
        <Description term="手机号">{`${singleCustomerDetail.phone || ''}`}</Description>
        <Description term="客户等级"></Description>
        <Description term="欠款"></Description>
        <Description term="积分">{`${singleCustomerDetail.total_points || ''}`}</Description>
      </DescriptionList>
    )
    const menu = (
      <Menu>
        <Menu.Item key='1'>删除</Menu.Item>
      </Menu>
    )

    const action = (
      <div>
        <ButtonGroup>
          <Button onClick={this.handleChangeCustomerStatus.bind(null,currentId.id,singleCustomerDetail.freeze)}>{singleCustomerDetail.freeze == 1 ? '解冻' : '冻结'}</Button>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
        <Button type="primary">编辑</Button>
      </div>
    )

    const saleColumns = [{
      title: '单号',
      dataIndex: 'number',
      render: (text,record) => (`#${record.number}`)
    },{
      title: '业绩归属员工',
      dataIndex: 'seller',
      render: (text,record) => (`${record.seller.data.name}`)
    },{
      title: '商品数量',
      dataIndex: 'quantity',
      sorter:true,
    },{
      title: '总额',
      dataIndex: 'due_fee',
      sorter:true,
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
      title: '购买量',
      dataIndex: 'item_quantity',
      sorter:true,
    },{
      title: '购买额',
      dataIndex: 'item_value',
      sorter:true,
    },{
      title: '最后购买时间',
      dataIndex: '',
      sorter:true,
    },{
      title: '操作',
      dataIndex: 'operation',
      render: (text,record) => (<Link to={`/relationship/customer-detail/goods-purchase-detail/${currentId.id}/${record.id}`}>查看</Link>)
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
      sorter:true,
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
        title={`单号：${singleCustomerDetail.name || ''}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description}
        activeTabKey={activeTabKey}
        action={action}
        tabList={tabList}
        onTabChange={this.handleTabChange}
      >
        <Card bordered={false} style={{display: activeTabKey == 'detail' ? 'block' : 'none'}}>
          <DescriptionList size="large" title="基本资料"  col={2}>
            <Description term="微信号" style={{display: singleCustomerDetail.wechat ? 'block' : 'none'}}>{`${singleCustomerDetail.wechat }`}</Description> 
            <Description term="初始欠款">已取货</Description>
            <Description term="专属导购" style={{display: singleCustomerDetail.seller ? 'block' : 'none'}}>{`${singleCustomerDetail.seller }`}</Description> 
            <Description term="商品分组">3214321432</Description>
            <Description term="备注" style={{display: singleCustomerDetail.remark1 ? 'block' : 'none'}}>{`${singleCustomerDetail.remark1}`}</Description> 
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>附件</div>
          { singleCustomerDetail.addresses && !!singleCustomerDetail.addresses.length ? <div><Divider style={{ marginBottom: 32 }} /><div className={styles.title}>地址</div></div> : null}
          {
            singleCustomerDetail.addresses  && singleCustomerDetail.addresses.map( (item,index) => {
              return (
                <div key={item.id}>
                  {index > 0 ? <Divider style={{marginBottom: 20}} /> : null}
                  <Row>
                    <Col span={4}>
                      <label className={styles.labelTitle}>收货人：</label><span>{item.name || ''}</span>
                    </Col>
                    <Col span={6}>
                      <label className={styles.labelTitle}>手机号：</label><span>{item.phone}</span>
                    </Col>
                    <Col span={12}>
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
        <Card bordered={false} style={{display: activeTabKey == 'finance' ? 'block' : 'none'}}>
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
            <Table columns={saleColumns} dataSource={singleCustomerSaleHistory} onChange={this.handleSaleHistorySort} pagination={salePagination} rowKey='id' />
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
          </Card>
        </div>
        <div style={{display: activeTabKey == 'payment' ? 'block' : 'none'}}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              {
                paymentHistoryFilter.map( (item,index) => {
                  return (
                    <StandardFormRow key={`${index}`} title={`${item.name}`} block>
                      <FormItem expandable onChange={this.handlePaymentFormSubmit}>
                        {getFieldDecorator(`payment_${item.code}`)(
                          <TagSelect>
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
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
