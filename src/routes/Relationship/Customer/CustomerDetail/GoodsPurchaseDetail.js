import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import currency from 'currency.js'
import { Row, Col, Card, Button,Icon,Table} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './CustomerDetail.less'
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const NCNI = value => currency(value, { symbol: "", precision: 0});
@connect(state => ({
  goodsPurchaseDetail: state.goodsPurchaseDetail
}))
export default class GoodsPurchaseDetail extends PureComponent {

  render() {

    const columns = [{
      title: '名称',
      dataIndex: 'item_ref',
    },{
      title: '购买量',
      dataIndex: 'total_quantity ',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNI(record.total_quantity ).format(true)
    },{
      title: '购买额',
      dataIndex: 'total_fee',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNF(record.total_fee).format(true)
    },{
      title: '最后购买时间',
      dataIndex: 'last_purchase_time',
      sorter:true,
    },{
      title: '操作',
      dataIndex: 'operation',
      render: (text,record) => <a>操作</a>
    }]

    return (
      <PageHeaderLayout
      >
      12222222
      </PageHeaderLayout>
    );
  }
}
