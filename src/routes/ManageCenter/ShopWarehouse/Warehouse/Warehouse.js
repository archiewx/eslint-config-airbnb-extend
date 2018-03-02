import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import breadCrumbList from '../../../../common/breadCrumbList'
@connect(state => ({
  warehouse:state.warehouse,
}))
export default class Warehouse extends PureComponent {

  componentDidMount(){
    this.props.dispatch({type:'warehouse/getList'})
  }


  render() {
    const {warehouses} = this.props.warehouse;

    const columns = [{
      title:'名称',
      dataIndex:'name',
      width:'30%'
    },{
      title:'关联的店铺',
      dataIndex:'relationShop',
      render:(text,record) => `${record.shops.data.map( n => n.name).join('、')}`
    }]

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)}>
        <Card>
          <Table dataSource={warehouses} columns={columns} rowKey='id' pagination={false}/>
        </Card>
      </PageHeaderLayout>
    );
  }
}
