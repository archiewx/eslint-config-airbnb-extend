import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js';
import { Row, Col, Card, Button, Icon, Menu, Dropdown, Popconfirm, Divider, Radio, Table, Form, DatePicker } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import FilterDatePick from '../../../../components/FilterDatePick';
import DescriptionList from '../../../../components/antd-pro/DescriptionList';
import LightBoxImage from '../../../../components/LightBoxImage/LightBoxImage';
import TagSelect from '../../../../components/DuokeTagSelect';
import styles from './CustomerDetail.less';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;
const NCNF = value => currency(value, { symbol: '', precision: 2 });
const NCNI = value => currency(value, { symbol: '', precision: 0 });
const agoSevenDays = new Date((new Date()).getTime() - 7 * 24 * 60 * 60 * 1000);
const tabList = [{
  key: 'detail',
  tab: '详情',
}, {
  key: 'finance',
  tab: '欠款',
}, {
  key: 'sale',
  tab: '交易历史',
}, {
  key: 'goods',
  tab: '商品历史',
}, {
  key: 'payment',
  tab: '收银历史',
}];
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
const pagination = {
  showQuickJumper: true,
  showSizeChanger: true,
};
const dataPick = {
  date_type: 'custom',
  sday: moment(new Date((new Date()).getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD').format('YYYY-MM-DD'),
  eday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
};
@Form.create()
@connect(state => ({
  customerDetail: state.customerDetail,
}))
export default class CustomerDetail extends PureComponent {
  state = {
    activeTabKey: 'detail',
    activeBlanceTabKey: 'balance',
    sortSaleHistory: {
      sorts: {
        created_at: 'desc',
      },
    },
    filterSaleHistory: dataPick,
    pageSaleHistory: {
      page: 1,
      per_page: 10,
    },
    sortGoodsHistory: {
      sorts: {
        purchase_time: 'desc',
      },
    },
    filterGoodsHistory: dataPick,
    pageGoodsHistory: {
      page: 1,
      per_page: 10,
    },
    sortPaymentHistory: {
      sorts: {
        created_at: 'desc',
      },
    },
    filterPaymentHistory: dataPick,
    pagePaymentHistory: {
      page: 1,
      per_page: 10,
    },
    pageSalesorder: {
      page: 1,
      per_page: 10,
    },
    pageStatement: {
      page: 1,
      per_page: 10,
    },
    pagePayments: {
      page: 1,
      per_page: 10,
    },
  }

  //切换tab
  handleTabChange = (key) => {
    this.setState({ activeTabKey: key });
  }

  //切换欠款tab
  handleBlanceTabChange = (key) => {
    this.setState({ activeBlanceTabKey: key });
  }

  //删除客户
  handleDeleteSingleCustomer = (id) => {
    this.props.dispatch({ type: 'customerDetail/deleteSingle', payload: id }).then(() => {
      this.props.dispatch(routerRedux.push('/relationship/customer-list'));
    });
  }

  //改变客户状态
  handleChangeCustomerStatus = (id, status) => {
    this.props.dispatch({ type: 'customerDetail/changeCustomerStatus',
      payload: {
        id,
        freeze: status == 1 ? 0 : 1,
      } });
  }

  //跳转编辑客户
  handleToCustomerEdit = () => {
    this.props.dispatch(routerRedux.push(`/relationship/customer-edit/${this.props.customerDetail.currentId.id}`));
  }

  //交易历史排序
  handleSaleHistorySort = (pagination, filter, sorter) => {
    const pageSaleHistory = {
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    this.setState({ pageSaleHistory });
    const sortSaleHistory = {
      sorts: {},
    };
    if (sorter.field) {
      sortSaleHistory.sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sortSaleHistory.sorts = {
        created_at: 'desc',
      };
    }
    this.setState({ sortSaleHistory });
    this.props.dispatch({ type: 'customerDetail/getSaleHistory',
      payload: {
        ...this.state.filterSaleHistory,
        ...sortSaleHistory,
        id: this.props.customerDetail.currentId.id,
      } });
  }

  //交易历史筛
  handleSaleFilter = (value) => {
    this.props.dispatch({ type: 'customerDetail/setFilterSaleServerData',
      payload: {
        ...value,
        sale_datePick: value.sale_datePick ? [value.sale_datePick[0].format('YYYY-MM-DD'), value.sale_datePick[1].format('YYYY-MM-DD')] : undefined,
      } });
    const filterSaleHistory = this.props.customerDetail.filterSaleServerData;
    this.setState({ filterSaleHistory });
    this.props.dispatch({ type: 'customerDetail/getSaleHistory',
      payload: {
        ...filterSaleHistory,
        ...this.state.sortSaleHistory,
        id: this.props.customerDetail.currentId.id,
      } });
  }

  //商品历史排序
  handleGoodsHistorySort = (pagination, filter, sorter) => {
    const pageGoodsHistory = {
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    this.setState({ pageGoodsHistory });
    const sortGoodsHistory = {
      sorts: {},
    };
    if (sorter.field) {
      sortGoodsHistory.sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sortGoodsHistory.sorts = {
        purchase_time: 'desc',
      };
    }
    this.setState({ sortGoodsHistory });
    this.props.dispatch({ type: 'customerDetail/getGoodsHistory',
      payload: {
        ...this.state.filterGoodsHistory,
        ...sortGoodsHistory,
        id: this.props.customerDetail.currentId.id,
      } });
  }

  //商品历史筛
  handleGoodsFilter = (value) => {
    this.props.dispatch({ type: 'customerDetail/setFilterGoodsServerData',
      payload: {
        ...value,
        goods_datePick: value.goods_datePick ? [value.goods_datePick[0].format('YYYY-MM-DD'), value.goods_datePick[1].format('YYYY-MM-DD')] : undefined,
      } });
    const filterGoodsHistory = this.props.customerDetail.filterGoodsServerData;
    this.setState({ filterGoodsHistory });
    this.props.dispatch({ type: 'customerDetail/getGoodsHistory',
      payload: {
        ...filterGoodsHistory,
        ...this.state.sortGoodsHistory,
        id: this.props.customerDetail.currentId.id,
      } });
  }

  //收银历史排序
  handlePaymentHistorySort = (pagination, filter, sorter) => {
    const pagePaymentHistory = {
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    this.setState({ pagePaymentHistory });
    const sortPaymentHistory = {
      sorts: {},
    };
    if (sorter.field) {
      sortPaymentHistory.sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sortPaymentHistory.sorts = {
        created_at: 'desc',
      };
    }
    this.setState({ sortPaymentHistory });
    this.props.dispatch({ type: 'customerDetail/getPaymentHistory',
      payload: {
        ...this.state.filterPaymentHistory,
        ...sortPaymentHistory,
        id: this.props.customerDetail.currentId.id,
      } });
  }

  //收银历史筛选你
  handlePaymentFilter = (value) => {
    this.props.dispatch({ type: 'customerDetail/setFilterPurchaseServerData',
      payload: {
        ...value,
        payment_datePick: value.payment_datePick ? [value.payment_datePick[0].format('YYYY-MM-DD'), value.payment_datePick[1].format('YYYY-MM-DD')] : undefined,
      } });
    const filterPaymentHistory = this.props.customerDetail.filterPaymentServerData;
    this.setState({ filterPaymentHistory });
    this.props.dispatch({ type: 'customerDetail/getPaymentHistory',
      payload: {
        ...filterPaymentHistory,
        ...this.state.sortPaymentHistory,
        id: this.props.customerDetail.currentId.id,
      } });
  }

  //欠款，当前余额排序
  handlePaymentsSort = (pagination, filter, sorter) => {
    const pagePayments = {
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    this.setState({ pagePayments });
    let sorts = {};
    if (sorter.field) {
      sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sorts = {
        created_at: 'desc',
      };
    }
    this.props.dispatch({ type: 'customerDetail/getPayments',
      payload: {
        sorts,
        id: this.props.customerDetail.currentId.id,
      } });
  }

  //欠款，未结算销售单排序
  handleSalesorderSort = (pagination, filter, sorter) => {
    const pageSalesorder = {
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    this.setState({ pageSalesorder });
    let sorts = {};
    if (sorter.field) {
      sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sorts = {
        created_at: 'desc',
      };
    }
    this.props.dispatch({ type: 'customerDetail/getSalesorder',
      payload: {
        sorts,
        id: this.props.customerDetail.currentId.id,
      } });
  }

  //欠款，未付款结算单排序
  handleStatementSort = (pagination, filter, sorter) => {
    const pageStatement = {
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    this.setState({ pageStatement });
    let sorts = {};
    if (sorter.field) {
      sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sorts = {
        created_at: 'desc',
      };
    }
    this.props.dispatch({ type: 'customerDetail/getStatement',
      payload: {
        sorts,
        id: this.props.customerDetail.currentId.id,
      } });
  }

  render() {
    const { singleCustomerDetail, singleCustomerFinance, singleCustomerSaleHistory, singleCustomerGoodsHistory, singleCustomerPaymentHistory, singleCustomerSalesorders, singleCustomerStatements, saleHistoryFilter, goodsHistoryFilter, paymentHistoryFilter, currentId, singleCustomerPayments } = this.props.customerDetail;
    const { activeTabKey, activeBlanceTabKey, pageSaleHistory, pageGoodsHistory, pagePaymentHistory, pageSalesorder, pageStatement, pagePayments } = this.state;
    const { getFieldDecorator } = this.props.form;
    const description = (
      <DescriptionList size="small" col="2" className={styles.descriptionPostion}>
        <Description term="手机号">{`${singleCustomerDetail.phone || ''}`}</Description>
        <Description term="客户等级">{`${singleCustomerDetail.vip || ''}`}</Description>
        <Description term="欠款">{`${singleCustomerDetail.debt || 0}`}</Description>
        <Description term="积分">{`${singleCustomerDetail.total_points || 0}`}</Description>
      </DescriptionList>
    );
    const menu = (
      <Menu style={{ width: 109 }}>
        <Menu.Item key="1">
          <Popconfirm title="确认删除此客户?" placement="bottom" onConfirm={this.handleDeleteSingleCustomer.bind(null, currentId.id)}><span style={{ width: '100%', display: 'inline-block' }}>删除</span></Popconfirm>
        </Menu.Item>
      </Menu>
    );
    const breadcrumbList = [{
      title: '关系',
    }, {
      title: '客户',
    }, {
      title: singleCustomerDetail.name || '',
    }];

    const action = (
      <div>
        <ButtonGroup>
          <Popconfirm title={singleCustomerDetail.freeze == 1 ? '确定解冻此客户?' : '确定冻结此客户?'} placement="bottom" onConfirm={this.handleChangeCustomerStatus.bind(null, currentId.id, singleCustomerDetail.freeze)}><Button >{singleCustomerDetail.freeze == 1 ? '解冻' : '冻结'}</Button></Popconfirm>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
        <Button type="primary" onClick={this.handleToCustomerEdit}>编辑</Button>
      </div>
    );

    const saleColumns = [{
      title: '单号',
      dataIndex: 'number',
      width: '15%',
      render: (text, record) => (`#${record.number}`),
    }, {
      title: '业绩归属员工',
      dataIndex: 'seller',
      width: '15%',
      render: (text, record) => (`${record.seller.data.name}`),
    }, {
      title: '商品数量',
      dataIndex: 'quantity',
      className: styles.numberRightMove,
      width: '15%',
      sorter: true,
      render: (text, record) => NCNI(record.quantity).format(true),
    }, {
      title: '总额',
      dataIndex: 'due_fee',
      className: styles.numberRightMove,
      width: '20%',
      sorter: true,
      render: (text, record) => NCNF(record.due_fee).format(true),
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      width: '25%',
      sorter: true,
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record) => <Link to={`/bill/sale-detail/${record.id}`}>查看</Link>,
    }];

    const goodsColumns = [{
      title: '货号',
      dataIndex: 'item_ref',
      width: '15%',
    }, {
      title: '购买量',
      dataIndex: 'item_quantity',
      width: '20%',
      className: styles.numberRightMove,
      sorter: true,
      render: (text, record) => NCNI(record.item_quantity).format(true),
    }, {
      title: '购买额',
      dataIndex: 'item_value',
      width: '30%',
      className: styles.numberRightMove,
      sorter: true,
      render: (text, record) => NCNF(record.item_value).format(true),
    }, {
      title: '最后购买时间',
      width: '25%',
      dataIndex: 'purchase_time',
      sorter: true,
    }, {
      title: '操作',
      width: '10%',
      dataIndex: 'operation',
      render: (text, record) => (<Link to={`/relationship/customer-detail/goods-purchase-detail/${currentId.id}/${record.id}/${singleCustomerDetail.name}`}>查看</Link>),
    }];

    const paymentColumns = [{
      title: '流水号',
      dataIndex: 'number',
      width: '25',
      render: (text, record) => (`#${record.number}`),
    }, {
      title: '收银方式',
      dataIndex: 'paymentmethod',
      width: '20%',
      render: (text, record) => (`${record.paymentmethod.name}`),
    }, {
      title: '金额',
      dataIndex: 'value',
      sorter: true,
      width: '20%',
      className: styles.numberRightMove,
      render: (text, record) => NCNF(record.value).format(true),
    }, {
      title: '创建时间',
      width: '25%',
      dataIndex: 'created_at',
      sorter: true,
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record) => (<Link to={`/finance/payments-detail/${record.id}`}>查看</Link>),
    }];

    const salesorderColumns = [{
      title: '单号',
      dataIndex: 'number',
      width: '15%',
      render: (text, record) => (`#${record.number}`),
    }, {
      title: '商品数量',
      dataIndex: 'quantity',
      width: '20%',
      sorter: true,
      className: styles.numberRightMove,
      render: (text, record) => NCNI(record.quantity).format(true),
    }, {
      title: '未付总款',
      dataIndex: 'due_fee',
      width: '30%',
      className: styles.numberRightMove,
      sorter: true,
      render: (text, record) => NCNF(record.due_fee).format(true),
    }, {
      title: '创建时间',
      width: '25%',
      dataIndex: 'created_at',
      sorter: true,
    }, {
      title: '操作',
      width: '10%',
      dataIndex: 'operation',
      render: (text, record) => <Link to={`/bill/sale-detail/${record.id}`}>查看</Link>,
    }];

    const statementColumns = [{
      title: '单号',
      dataIndex: 'number',
      width: '15%',
      render: (text, record) => (`#${record.number}`),
    }, {
      title: '单据数量',
      dataIndex: 'order_quantity',
      width: '20%',
      className: styles.numberRightMove,
      sorter: true,
      render: (text, record) => NCNI(record.order_quantity).format(true),
    }, {
      title: '未付总款',
      dataIndex: 'need_pay',
      width: '30%',
      className: styles.numberRightMove,
      sorter: true,
      render: (text, record) => NCNF(record.need_pay).format(true),
    }, {
      title: '创建时间',
      width: '25%',
      dataIndex: 'created_at',
      sorter: true,
    }, {
      title: '操作',
      width: '10%',
      dataIndex: 'operation',
      render: (text, record) => (<Link to={`/finance/sale-settle-detail/${record.id}`}>查看</Link>),
    }];

    const purchasesColumns = [{
      title: '单号',
      dataIndex: 'number',
      width: '20%',
      render: (text, record) => (`#${record.number}`),
    }, {
      title: '支付方式',
      dataIndex: 'paymentWay',
      sorter: true,
      render: (text, record) => record.paymentmethod.data.name,
    }, {
      title: '金额',
      dataIndex: 'value',
      width: '20%',
      className: styles.numberRightMove,
      sorter: true,
      render: (text, record) => NCNF(record.value).format(true),
    }, {
      title: '创建时间',
      width: '30%',
      dataIndex: 'created_at',
      sorter: true,
    }, {
      title: '操作',
      width: '10%',
      dataIndex: 'operation',
      render: (text, record) => (<Link to={`/finance/payments-detail/${record.id}`}>查看</Link>),
    }];

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    return (
      <PageHeaderLayout
        title={<div><span>姓名：{singleCustomerDetail.name || ''}</span><span style={{ fontSize: 14, marginLeft: 30, color: '#666' }}>{singleCustomerDetail.freeze === '1' && '已冻结'}</span></div>}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        breadcrumbList={breadcrumbList}
        content={description}
        activeTabKey={activeTabKey}
        action={action}
        tabList={tabList}
        onTabChange={this.handleTabChange}
      >
        <Card bordered={false} style={{ display: activeTabKey == 'detail' ? 'block' : 'none' }}>
          <div className={styles.title}>基本资料</div>
          {
            singleCustomerDetail.basicDetail && !!singleCustomerDetail.basicDetail.length ? (
              <div>
                <Row gutter={32}>
                  {
                      singleCustomerDetail.basicDetail.map((item, index) => {
                      return (
                        <Col span={12} key={index} style={{ marginBottom: 16 }}>
                          <label className={styles.labelTitle}>{`${item.parentName}： `}</label><span>{item.name}</span>
                        </Col>
                      );
                    })
                  }
                </Row>
              </div>
            ) : null
          }
          {singleCustomerDetail.imageFiles && !!singleCustomerDetail.imageFiles.length ? <div><Divider style={{ marginBottom: 32 }} /><div className={styles.title}>附件</div></div> : null}
          <LightBoxImage imageSource={singleCustomerDetail.imageFiles || []} />
          { singleCustomerDetail.addresses && !!singleCustomerDetail.addresses.length ? <div><Divider style={{ marginBottom: 32 }} /><div className={styles.title}>地址</div></div> : null}
          {
            singleCustomerDetail.addresses && singleCustomerDetail.addresses.map((item, index) => {
              return (
                <div key={item.id}>
                  {index > 0 ? <Divider style={{ marginBottom: 20 }} /> : null}
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
                      { item.default == 1 ? <Radio className={styles.labelTitle} checked>默认地址</Radio> : null }
                    </Col>
                  </Row>
                </div>
              );
            })
          }
        </Card>
        <div style={{ display: activeTabKey == 'finance' ? 'block' : 'none' }}>
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
            <div style={{ display: activeBlanceTabKey == 'balance' ? 'block' : 'none' }}>
              <Table columns={purchasesColumns} dataSource={singleCustomerPayments} onChange={this.handlePaymentsSort} pagination={pagination} rowKey="id" />
              <div style={{ marginTop: -43, width: 300 }}>
                <span>{`共 ${singleCustomerPayments.length || ''} 条流水 第 ${pagePayments.page} / ${Math.ceil(Number(singleCustomerPayments.length) / Number(pagePayments.per_page))} 页`}</span>
              </div>
            </div>
            <div style={{ display: activeBlanceTabKey == 'sale' ? 'block' : 'none' }}>
              <Table columns={salesorderColumns} dataSource={singleCustomerSalesorders} onChange={this.handleSalesorderSort} pagination={pagination} rowKey="id" />
              <div style={{ marginTop: -43, width: 300 }}>
                <span>{`共 ${singleCustomerSalesorders.length || ''} 条销售单 第 ${pageSalesorder.page} / ${Math.ceil(Number(singleCustomerSalesorders.length) / Number(pageSalesorder.per_page))} 页`}</span>
              </div>
            </div>
            <div style={{ display: activeBlanceTabKey == 'settle' ? 'block' : 'none' }}>
              <Table columns={statementColumns} dataSource={singleCustomerStatements} onChange={this.handleStatementSort} pagination={pagination} rowKey="id" />
              <div style={{ marginTop: -43, width: 300 }}>
                <span>{`共 ${singleCustomerStatements.length || ''} 条结算单 第 ${pageStatement.page} / ${Math.ceil(Number(singleCustomerStatements.length) / Number(pageStatement.per_page))} 页`}</span>
              </div>
            </div>
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'sale' ? 'block' : 'none' }}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <FilterDatePick onChange={this.handleSaleFilter} filterOptions={saleHistoryFilter} tagLabel="sale" dateLabel="sale" />
          </Card>
          <Card bordered={false}>
            <Table columns={saleColumns} dataSource={singleCustomerSaleHistory} onChange={this.handleSaleHistorySort} pagination={pagination} rowKey="id" />
            <div style={{ marginTop: -43, width: 300 }}>
              <span>{`共 ${singleCustomerSaleHistory.length || ''} 条销售单 第 ${pageSaleHistory.page} / ${Math.ceil(Number(singleCustomerSaleHistory.length) / Number(pageSaleHistory.per_page))} 页`}</span>
            </div>
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'goods' ? 'block' : 'none' }}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <FilterDatePick onChange={this.handleGoodsFilter} filterOptions={goodsHistoryFilter} tagLabel="goods" dateLabel="goods" />
          </Card>
          <Card bordered={false}>
            <Table columns={goodsColumns} dataSource={singleCustomerGoodsHistory} onChange={this.handleGoodsHistorySort} pagination={pagination} rowKey="id" />
            <div style={{ marginTop: -43, width: 300 }}>
              <span>{`共 ${singleCustomerGoodsHistory.length || ''} 件商品 第 ${pageGoodsHistory.page} / ${Math.ceil(Number(singleCustomerGoodsHistory.length) / Number(pageGoodsHistory.per_page))} 页`}</span>
            </div>
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'payment' ? 'block' : 'none' }}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <FilterDatePick onChange={this.handlePaymentFilter} filterOptions={paymentHistoryFilter} tagLabel="payment" dateLabel="payment" />
          </Card>
          <Card bordered={false}>
            <Table columns={paymentColumns} dataSource={singleCustomerPaymentHistory} onChange={this.handlePaymentHistorySort} pagination={pagination} rowKey="id" />
            <div style={{ marginTop: -43, width: 300 }}>
              <span>{`共 ${singleCustomerPaymentHistory.length || ''} 条流水 第 ${pagePaymentHistory.page} / ${Math.ceil(Number(singleCustomerPaymentHistory.length) / Number(pagePaymentHistory.per_page))} 页`}</span>
            </div>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
