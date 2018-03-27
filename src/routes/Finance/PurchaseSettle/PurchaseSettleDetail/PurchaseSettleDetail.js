import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import currency from 'currency.js';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider, Menu, Dropdown, Popover, Modal } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/antd-pro/DescriptionList';
import styles from './PurchaseSettleDetail.less';

const NCNF = value => currency(value, { symbol: '', precision: 2 });
const NCNI = value => currency(value, { symbol: '', precision: 0 });
const ButtonGroup = Button.Group;
let confirmModal;
const { againModalConfirm } = styles;
const { Description } = DescriptionList;
@connect(state => ({
  purchaseSettleDetail: state.purchaseSettleDetail,
}))
export default class PurchaseSettleDetail extends PureComponent {
  // 删除
  handleDeleteSingle = (id, deal) => {
    if (deal != -1) {
      confirmModal.destroy();
      this.props.dispatch({ type: 'purchaseSettleDetail/deleteSingle',
        payload: {
          id,
          deal_payments: deal,
        } }).then(() => {
        this.props.dispatch(routerRedux.push('/finance/purchase-settle'));
      });
    } else {
      this.props.dispatch({ type: 'purchaseSettleDetail/deleteSingle',
        payload: {
          id,
        } }).then(() => {
        this.props.dispatch(routerRedux.push('/finance/purchase-settle'));
      });
    }
  }

  // 打印
  handlePrint = (id) => {
    this.props.dispatch({ type: 'purchaseSettleDetail/printSettle',
      payload: {
        id,
        round: 1,
      } });
  }

  // 删除pop
  handleDeletePopConfirm = (payStatus, id) => {
    let popconfirmModal;
    if (payStatus == 1) {
      popconfirmModal = (
        <Popconfirm title={<div><span>确认删除此进货结算单?</span></div>} okText="确认" onConfirm={this.handleDeleteSingle.bind(null, id, -1)}>
          删除
        </Popconfirm>
      );
    } else if (payStatus == 3) {
      popconfirmModal = (
        <Popconfirm title={<div><span>确认删除此进货结算单?</span><div style={{ color: 'red' }}>关联的流水也将一同删除</div></div>} okText="继续" onConfirm={this.handleAgianPopConfirm.bind(null, id)}>
          删除
        </Popconfirm>
      );
    }
    return popconfirmModal;
  }

  // 删除modal
  handleAgianPopConfirm = (id) => {
    confirmModal = Modal.confirm({
      className: againModalConfirm,
      title: '关联的流水将如何处理',
      content: <Button type="primary" className={styles.paymentsPositon} onClick={this.handleDeleteSingle.bind(null, id, 2)}>充值到余额</Button>,
      okText: '删除流水',
      onOk: () => {
        this.handleDeleteSingle(id, 1);
      },
    });
  }

  render() {
    const { singleData } = this.props.purchaseSettleDetail;

    const breadcrumbList = [{
      title: '财务',
    }, {
      title: '进货结算',
    }, {
      title: `#${singleData.number || ''}`,
    }];

    const menu = (
      <Menu>
        <Menu.Item key="1">
          {this.handleDeletePopConfirm(singleData.pay_status, singleData.id)}
        </Menu.Item>
      </Menu>
    );

    const action = (
      <div>
        <ButtonGroup>
          <Popconfirm title="确认打印结算单" placement="bottom" onConfirm={this.handlePrint.bind(null, singleData.id)}><Button >打印</Button></Popconfirm>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
      </div>
    );

    const extra = (
      <Row>
        <Col span="8">
          <div className={styles.textSecondary}>单据数量</div>
          <div className={styles.heading}>{NCNI(singleData.order_quantity).format(true) || ''}</div>
        </Col>
        <Col span="8">
          <div className={styles.textSecondary}>商品数量</div>
          <div className={styles.heading}>{NCNI(singleData.item_quantity_one).format(true) || ''}</div>
        </Col>
        <Col span="8">
          <div className={styles.textSecondary}>总额</div>
          <div className={styles.heading}>{NCNF(singleData.value).format(true) || ''}</div>
        </Col>
      </Row>
    );

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="1">
        <Description term="交易供应商">{singleData.supplier || ''}</Description>
      </DescriptionList>
    );

    const settleColumns = [{
      title: '单号',
      dataIndex: 'type',
      width: '15%',
      render: (text, record) => `#${record.number}`,
    }, {
      title: '商品数量',
      dataIndex: 'quantity',
      className: styles.numberRightMove,
      render: (text, record) => NCNI(record.quantity).format(true),
    }, {
      title: '总额',
      dataIndex: 'due_fee',
      className: styles.numberRightMove,
      render: (text, record) => NCNF(record.due_fee).format(true),
    }, {
      title: '操作时间',
      dataIndex: 'created_at',
      width: '25%',
    }, {
      title: '操作',
      width: 172,
      dataIndex: 'operation',
      render: (text, record) => <Link to={`/bill/purchase-detail/${record.id}`}>查看</Link>,
    }];

    const operationColumns = [{
      title: '操作类型',
      dataIndex: 'type',
      width: '45%',
      render: (text, record) => `${record.docaction.data.name}`,
    }, {
      title: '操作员',
      dataIndex: 'user',
      render: (text, record) => `${record.user.data.name}`,
    }, {
      title: '操作时间',
      dataIndex: 'created_at',
      width: 172,
    }];

    return (
      <PageHeaderLayout
        title={`单号: #${singleData.number || ''}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={action}
        extraContent={extra}
        content={description}
        breadcrumbList={breadcrumbList}
      >
        <Card title="基础信息" style={{ marginBottom: 30 }} bordered={false}>
          <Row>
            <Col span="10">
              <label className={styles.labelTitle}>支付方式：</label>
              {
                singleData.pay_status == 1 ? <span style={{ color: 'red' }}>{singleData.paymentWays && singleData.paymentWays[0]}</span> : (
                  singleData.pay_status == 3 ? <span>全部付款</span> : (
                    singleData.paymentWays && singleData.paymentWays.map((n, index) => {
                      return index == 0 ? <span key={index}><span>{`${n.name}：`}</span><span>{`${n.value || ''}`}</span></span> : <div key={index} style={{ paddingLeft: 69 }}><span>{`${n.name}：`}</span><span>{`${n.value || ''}`}</span></div>;
                    })
                  )
                )
              }
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title="结算清单" style={{ marginBottom: 30 }}>
          <Table columns={settleColumns} rowKey="id" dataSource={singleData.orders || []} pagination={false} />
        </Card>
        <Card title="操作记录" bordered={false}>
          <Table columns={operationColumns} rowKey="id" dataSource={singleData.operationSource || []} pagination={false} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
