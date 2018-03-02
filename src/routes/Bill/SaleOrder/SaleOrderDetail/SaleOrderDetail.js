import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider,Menu,Dropdown} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './SaleOrderDetail.less'
const ButtonGroup = Button.Group;
@connect(state => ({
  saleOrderDetail:state.saleOrderDetail,
}))
export default class SaleOrderDetail extends PureComponent {

  state = {

  }

  handleDeleteSingle = (id) => {

  }

  handlePrint = (id) => {
    this.props.dispatch({type:'saleOrderDetail/printSaleOrder',payload:{
      id:id,
      round:1
    }})
  }

  render() {
    const {singleOrderDetail} = this.props.saleOrderDetail;

    const breadcrumbList = [{
      title:'单据',
    },{
      title:'销售单',
    },{
      title:`#${singleOrderDetail.number}` || ''
    }]

    const menu = (
      <Menu>
        <Menu.Item key='1'>
          <Popconfirm title="确认删除此销售单?" placement='bottom' onConfirm={this.handleDeleteSingle.bind(null,singleOrderDetail.id)}>删除</Popconfirm>
        </Menu.Item>
      </Menu>
    )

    const action = (
      <div>
        <ButtonGroup>
          <Popconfirm title={'确认打印'} placement='bottom' onConfirm={this.handlePrint.bind(null,singleOrderDetail.id)}><Button >打印</Button></Popconfirm>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
      </div>
    )

    return (
      <PageHeaderLayout 
        title={`单号: #${singleOrderDetail.number}` || ''}
        breadcrumbList={breadcrumbList}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={action}
      >
        <Card>
        </Card>
      </PageHeaderLayout>
    );
  }
}
