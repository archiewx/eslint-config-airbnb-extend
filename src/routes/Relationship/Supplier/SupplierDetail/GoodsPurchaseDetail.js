import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import currency from 'currency.js';
import { Row, Col, Card, Button, Icon, Table } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './SupplierDetail.less';

const NCNF = value => currency(value, { symbol: '', precision: 2 });
const NCNI = value => currency(value, { symbol: '', precision: 0 });
@connect(state => ({
  supplierGoodsPurchaseDetail: state.supplierGoodsPurchaseDetail,
}))
export default class GoodsPurchaseDetail extends PureComponent {
  handleSort = (pagination, filters, sorter) => {
    let sorts = {};
    if (sorter.field) {
      sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sorts = {
        last_purchase_time: 'desc',
      };
    }
    this.props.dispatch({ type: 'supplierGoodsPurchaseDetail/getList',
      payload: {
        id: this.props.supplierGoodsPurchaseDetail.customerId,
        subId: this.props.supplierGoodsPurchaseDetail.itemId,
        sorts,
      } });
  }

  render() {
    const { goodsPurchaseList, customerId } = this.props.supplierGoodsPurchaseDetail;
    let parent = null

    const breadcrumbList = [{
      title: '关系',
    }, {
      title: '供应商',
    }, {
      title: this.props.history.location.pathname.slice(this.props.history.location.pathname.lastIndexOf('/') + 1),
    }, {
      title: '商品供应详情',
    }];

    const columns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '供应量',
      dataIndex: 'total_quantity ',
      className: styles.numberRightMove,
      sorter: true,
      render: (text, record) => NCNI(record.total_quantity).format(true),
    }, {
      title: '供应额',
      dataIndex: 'total_fee',
      className: styles.numberRightMove,
      sorter: true,
      render: (text, record) => NCNF(record.total_fee).format(true),
    }, {
      title: '最后供应时间',
      dataIndex: 'last_purchase_time',
      sorter: true,
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        // return (
        //   record.name ? (
        //     record.children ? (
        //       ((record.id).toString()).indexOf('_') > -1 ? <Link to={`/relationship/supplier-detail/skus-purchase-detail/${customerId}/${record.skuId}/${this.props.match.params.name}`}>查看</Link> : null
        //     ) : <Link to={`/relationship/supplier-detail/skus-purchase-detail/${customerId}/${record.skuId}/${this.props.match.params.name}`}>查看</Link>
        //   ) : null
        // );
        if (record.children) {
          parent = record;
        } else {
          return (<Link to={`/relationship/supplier-detail/skus-purchase-detail/${customerId}/${parent.skuId}/${this.props.match.params.name}`}>查看</Link>);
        }
        return null;
      },
    }];

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Table columns={columns} dataSource={goodsPurchaseList} onChange={this.handleSort} rowKey="id" pagination={false} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
