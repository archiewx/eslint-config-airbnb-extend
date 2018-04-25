import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import currency from 'currency.js';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider, Menu, Dropdown } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/antd-pro/DescriptionList';
import styles from './PaymentsDetail.less';

const NCNF = value => currency(value, { symbol: '', precision: 2 });
const ButtonGroup = Button.Group;
const { Description } = DescriptionList;
@connect(state => ({
  paymentsDetail: state.paymentsDetail,
}))
export default class PaymentsDetail extends PureComponent {
  // 删除
  handleDeleteSingle = (id) => {
    this.props.dispatch({ type: 'paymentsDetail/deleteSingle', payload: id }).then(() => {
      this.props.dispatch(routerRedux.push('/finance/payments'));
    });
  }

  render() {
    const { singleData } = this.props.paymentsDetail;

    const breadcrumbList = [{
      title: '财务',
    }, {
      title: '流水',
      href: '/finance/payments',
    }, {
      title: `#${singleData.number || ''}`,
    }];

    const action = (
      <div>
        <Popconfirm title="确认删除此流水?" placement="bottom" onConfirm={this.handleDeleteSingle.bind(null, singleData.id)}><Button>删除</Button></Popconfirm>
      </div>
    );

    const extra = (
      <Row>
        <Col span="8" offset="16">
          <div className={styles.textSecondary}>金额</div>
          <div className={styles.heading}>{NCNF(singleData.value).format(true) || ''}</div>
        </Col>
      </Row>
    );

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="交易对象">{singleData.customer || ''}</Description>
        <Description term="入账店铺">{singleData.shop || ''}</Description>
        <Description term="收银员工">{singleData.user || ''}</Description>
        <Description term="关联单据" >
          {singleData.orderNumber ? singleData.orderNumber.map((n, i) => {
            return (
              <div key={`${i}`}>
                {n.orderType}
                {
                  n.orderType == '销售单' ? <Link to={`/bill/sale-detail/${n.id}`}>{` #${n.number}`}</Link> : (
                    n.orderType == '进货单' ? <Link to={`/bill/purchase-detail/${n.id}`}>{` #${n.number}`}</Link> : <Link to={`/finance/purchase-settle-detail/${n.id}`}>{` #${n.number}`}</Link>
                  )
                }
              </div>
            );
          }) : '无'}
        </Description>
      </DescriptionList>
    );

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
              <span>{`${singleData.paymentWays && singleData.paymentWays.name || '无'}`}</span>
            </Col>
          </Row>
        </Card>
        <Card title="操作记录" bordered={false}>
          <Table columns={operationColumns} rowKey="id" dataSource={singleData.operationSource || []} pagination={false} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
