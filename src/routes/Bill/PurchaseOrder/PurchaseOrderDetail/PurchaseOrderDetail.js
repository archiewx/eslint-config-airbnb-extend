import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import currency from 'currency.js';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider, Menu, Dropdown, Popover, Modal } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/antd-pro/DescriptionList';
import styles from './PurchaseOrderDetail.less';

const NCNF = value => currency(value, { symbol: '', precision: 2 });
const NCNI = value => currency(value, { symbol: '', precision: 0 });
const ButtonGroup = Button.Group;
let confirmModal;
const { againModalConfirm } = styles;
const { Description } = DescriptionList;
@connect(state => ({
  purchaseOrderDetail: state.purchaseOrderDetail,
}))
export default class PurchaseOrderDetail extends PureComponent {
  handleDeleteSingle = (id, deal) => {
    if (deal != -1) {
      confirmModal.destroy();
      this.props.dispatch({ type: 'purchaseOrderDetail/deleteSingle',
        payload: {
          id,
          deal_payments: deal,
        } }).then(() => {
        this.props.dispatch(routerRedux.push('/bill/purchase-order'));
      });
    } else {
      this.props.dispatch({ type: 'purchaseOrderDetail/deleteSingle',
        payload: {
          id,
        } }).then(() => {
        this.props.dispatch(routerRedux.push('/bill/purchase-order'));
      });
    }
  }

  handlePrint = (id) => {
    this.props.dispatch({ type: 'purchaseOrderDetail/printPurchaseOrder',
      payload: {
        id,
        round: 1,
      } });
  }

  handleExpandedRowRender = (record) => {
    const itemExtraList = this.props.purchaseOrderDetail.singleOrderDetail.itemExtraList[`${record.item_id}`] || [];
    const expandDetailColumns = [{
      title: '货号',
      dataIndex: 'item_ref',
      width: '15%',
      render: () => '',
    }, {
      title: '颜色',
      dataIndex: 'color',
    }, {
      title: '尺码',
      dataIndex: 'size',
    }, {
      title: '价格',
      dataIndex: 'price',
      className: styles.numberRightMove,
      render: (text, record) => NCNF(record.price).format(true),
    }, {
      title: '数量',
      dataIndex: 'quantity',
      width: '10%',
    }, {
      title: '总额',
      dataIndex: 'total',
      className: styles.numberRightMove,
      render: (text, record) => NCNF(record.total).format(true),
    }, {
      title: '标签',
      dataIndex: 'label',
    }, {
      title: '备注',
      dataIndex: 'remark',
    }];
    if (record.colorId) {
      if (itemExtraList.length) {
        return (
          <table style={{ width: '84.5%', float: 'right' }}>
            <thead className={styles.tableHead}>
              <tr>
                <th><span /></th>
                {
                  itemExtraList[0].map((n, index) => {
                    return <th key={index}><span>{n.name}</span></th>;
                  })
                }
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {
                itemExtraList.map((n, index) => {
                  return index == 0 ? null : (
                    <tr key={index}>
                      <td>{n.name}</td>
                      {
                        n.children.map((m, i) => {
                          return (
                            <td key={i}><Popover content={<div><p>{`标签：${m.label}`}</p><p>{`备注：${m.remark}`}</p></div>}>{m.quantity}</Popover></td>
                          );
                        })
                      }
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        );
      } else {
        return <div>空</div>;
      }
    } else if (itemExtraList.length) {
      return <Table columns={expandDetailColumns} rowKey="id" dataSource={itemExtraList || []} pagination={false} showHeader={false} />;
    } else {
      return <div>无</div>;
    }
  }

  handleDeletePopConfirm = (settleWay, payStatus, id) => {
    let popconfirmModal;
    if (settleWay == 1) {
      popconfirmModal = (
        <Popconfirm title={<div><span>确认删除此进货单?</span><div style={{ color: 'red' }}>关联的流水也将一同删除</div></div>} okText="继续" onConfirm={this.handleAgianPopConfirm.bind(null, id)}>
          删除
        </Popconfirm>
      );
    } else if (payStatus == 1) {
      popconfirmModal = (
        <Popconfirm title={<div><span>确认删除此进货单?</span></div>} okText="确认" onConfirm={this.handleDeleteSingle.bind(null, id, -1)}>
            删除
        </Popconfirm>
      );
    } else if (payStatus == 3) {
      popconfirmModal = (
        <Popconfirm title={<div><span>进货单已结算，无法删除</span></div>} okText="确认" >
            删除
        </Popconfirm>
      );
    }
    return popconfirmModal;
  }

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
    const { singleOrderDetail } = this.props.purchaseOrderDetail;

    const breadcrumbList = [{
      title: '单据',
    }, {
      title: '进货单',
      href: '/bill/purchase-order',
    }, {
      title: `#${singleOrderDetail.number || ''}`,
    }];

    const menu = (
      <Menu>
        <Menu.Item key="1">
          {this.handleDeletePopConfirm(singleOrderDetail.settle_way, singleOrderDetail.pay_status, singleOrderDetail.id)}
        </Menu.Item>
      </Menu>
    );

    const action = (
      <div>
        <ButtonGroup>
          <Popconfirm title="确认打印进货单" placement="bottom" onConfirm={this.handlePrint.bind(null, singleOrderDetail.id)}><Button >打印</Button></Popconfirm>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
      </div>
    );

    const extra = (
      <Row>
        <Col span="8">
          <div className={styles.textSecondary}>商品项数</div>
          <div className={styles.heading}>{singleOrderDetail.count || ''}</div>
        </Col>
        <Col span="8">
          <div className={styles.textSecondary}>商品数量</div>
          <div className={styles.heading}>{singleOrderDetail.quantity || ''}</div>
        </Col>
        <Col span="8">
          <div className={styles.textSecondary}>单据总额</div>
          <div className={styles.heading}>{singleOrderDetail.due_fee || ''}</div>
        </Col>
      </Row>
    );

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="入库仓库">{singleOrderDetail.intoWarehouse || ''}</Description>
        <Description term="供应商">{singleOrderDetail.supplier || ''}</Description>
        <Description term="入库方式">{`${singleOrderDetail.deliverWay || ''}`}<span style={{ marginLeft: 10, color: singleOrderDetail.deliverStatus == 1 ? 'red' : 'rgba(0, 0, 0, 0.65)' }}>{`${singleOrderDetail.deliverStatus || ''}`}</span></Description>
        <Description term=" " style={{ visibility: 'hidden' }} />
        <Description term="标签">{singleOrderDetail.label || ''}</Description>
        <Description term="备注">{singleOrderDetail.remark || ''}</Description>
      </DescriptionList>
    );

    const itemDetailColumns = [{
      title: '货号',
      dataIndex: 'item_ref',
    }, {
      title: '颜色',
      dataIndex: 'color',
      width: '12%',
    }, {
      title: '尺码',
      dataIndex: 'size',
      width: '10%',
    }, {
      title: '价格',
      dataIndex: 'price',
      width: '12%',
      className: styles.numberRightMove,
      render: (text, record) => NCNF(record.price).format(true),
    }, {
      title: '数量',
      dataIndex: 'quantity',
      width: '12%',
    }, {
      title: '总额',
      dataIndex: 'total',
      width: '12%',
      className: styles.numberRightMove,
      render: (text, record) => NCNF(record.total).format(true),
    }, {
      title: '标签',
      dataIndex: 'label',
      width: '12%',
    }, {
      title: '备注',
      dataIndex: 'remark',
      width: '12%',
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
        title={`单号: #${singleOrderDetail.number || ''}`}
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
                singleOrderDetail.paymentWays ? (
                  singleOrderDetail.paymentWays.length ? (
                    singleOrderDetail.paymentWays.map((n, index) => {
                      return index == 0 ? <span key={index}><span>{`${n.name}：`}</span><span style={{ color: singleOrderDetail.settle_way == 2 && singleOrderDetail.pay_status == 1 ? 'red' : 'rgba(0, 0, 0, 0.65)' }}>{`${n.value || ''}`}</span></span> : <div key={index} style={{ paddingLeft: 69 }}><span>{`${n.name}：`}</span><span>{`${n.value || ''}`}</span></div>;
                    })
                  ) : <span>无</span>
                ) : null
              }
            </Col>
          </Row>
        </Card>
        <Card title="商品清单" bordered={false} style={{ marginBottom: 30 }}>
          <Table columns={itemDetailColumns} rowKey="id" dataSource={singleOrderDetail.itemList || []} pagination={false} expandedRowRender={this.handleExpandedRowRender} />
        </Card>
        <Card title="操作记录" bordered={false}>
          <Table columns={operationColumns} rowKey="id" dataSource={singleOrderDetail.operationSource || []} pagination={false} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
