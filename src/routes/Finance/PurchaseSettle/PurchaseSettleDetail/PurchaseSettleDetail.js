import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import currency from 'currency.js'
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider,Menu,Dropdown,Popover} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/antd-pro/DescriptionList';
import styles from './PurchaseSettleDetail.less'
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const NCNI = value => currency(value, { symbol: "", precision: 0});
const ButtonGroup = Button.Group;
const { Description } = DescriptionList;
@connect(state => ({
  purchaseSettleDetail:state.purchaseSettleDetail,
}))
export default class PurchaseSettleDetail extends PureComponent {

  handleDeleteSingle = (id) => {

  }

  handlePrint = (id) => {
    this.props.dispatch({type:'purchaseSettleDetail/printSettle',payload:{
      id:id,
      round:1
    }})
  }

  render() {
    const {singleData} = this.props.purchaseSettleDetail;
    const breadcrumbList = [{
      title:'单据',
    },{
      title:'进货结算',
    },{
      title:`#${singleData.number  || ''}`
    }]

    const menu = (
      <Menu>
        <Menu.Item key='1'>
          <Popconfirm title="确认删除此销售单?" placement='bottom' onConfirm={this.handleDeleteSingle.bind(null,singleData.id)}>删除</Popconfirm>
        </Menu.Item>
      </Menu>
    )

    const action = (
      <div>
        <ButtonGroup>
          <Popconfirm title='确认打印销售单' placement='bottom' onConfirm={this.handlePrint.bind(null,singleData.id)}><Button >打印</Button></Popconfirm>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
      </div>
    )

    const extra = (
      <Row>
        <Col span='8'>
          <div className={styles.textSecondary}>单据数量</div>
          <div className={styles.heading}>{singleData.order_quantity || ''}</div>
        </Col>
        <Col span='8'>
          <div className={styles.textSecondary}>商品数量</div>
          <div className={styles.heading}>{singleData.item_quantity_one || ''}</div>
        </Col>
        <Col span='8'>
          <div className={styles.textSecondary}>总额</div>
          <div className={styles.heading}>{singleData.value || ''}</div>
        </Col>
      </Row>
    );

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="1">
        <Description term="交易供应商">{singleData.supplier || ''}</Description>
      </DescriptionList>
    );

    const settleColumns = [{
      title:'单号',
      dataIndex:'type',
      width:'15%',
      render:(text,record) => `#${record.number}`
    },{
      title:'商品数量',
      dataIndex:'quantity',
      className: styles['numberRightMove'],
      render:(text,record) => NCNI(record.quantity).format(true)
    },{
      title:'总额',
      dataIndex:'due_fee',
      className: styles['numberRightMove'],
      render:(text,record) => NCNF(record.due_fee).format(true)
    },{
      title:'操作时间',
      dataIndex:'created_at',
      width:'25%'
    },{
      title:'操作',
      width:172,
      dataIndex:'operation',
      render: () => <div><a>查看</a></div>
    }]

    const operationColumns = [{
      title:'操作类型',
      dataIndex:'type',
      width:'45%',
      render:(text,record) => `${record.docaction.data.name}`
    },{
      title:'操作员',
      dataIndex:'user',
      render:(text,record) => `${record.user.data.name}`
    },{
      title:'操作时间',
      dataIndex:'created_at',
      width:172
    }]

    return (
      <PageHeaderLayout 
        title={`单号: #${singleData.number || '' }` }
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={action}
        extraContent={extra}
        content={description}
        breadcrumbList={breadcrumbList}
      >
        <Card title='基础信息' style={{marginBottom:30}} bordered={false}>
          <Row>
            <Col span='10'>
              <label className={styles.labelTitle}>支付方式：</label>
              {
                singleData.pay_status == 1 ? <span style={{color:'red'}}>{singleData.paymentWays && singleData.paymentWays[0]}</span> : (
                  singleData.paymentWays && singleData.paymentWays.map( (n,index) => {
                    return index == 0 ? <span key={index}><span>{`${n.name}：`}</span><span>{`${n.value || ''}`}</span></span> : <div key={index} style={{paddingLeft:69}}><span>{`${n.name}：`}</span><span>{`${n.value || ''}`}</span></div>
                  })
                )
              }
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title='结算清单' style={{marginBottom:30}}>
          <Table columns={settleColumns} rowKey='id' dataSource={singleData.orders || []} pagination={false} />
        </Card>
        <Card title='操作记录' bordered={false}>
          <Table columns={operationColumns} rowKey='id' dataSource={singleData.operationSource || []} pagination={false} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
