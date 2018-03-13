import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import currency from 'currency.js'
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider,Menu,Dropdown,Popover} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/antd-pro/DescriptionList';
import styles from './DeliverOrderDetail.less'
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const NCNI = value => currency(value, { symbol: "", precision: 0});
const ButtonGroup = Button.Group;
const { Description } = DescriptionList;
@connect(state => ({
  deliverOrderDetail:state.deliverOrderDetail,
}))
export default class DeliverOrderDetail extends PureComponent {

  handleDeleteSingle = (id) => {
    this.props.dispatch({type:'deliverOrderDetail/deleteSingle',payload:id}).then(()=>{
      this.props.dispatch(routerRedux.push('/bill/deliver-order'))
    })
  }

  handlePrint = (id) => {
    this.props.dispatch({type:'deliverOrderDetail/printDeliverOrder',payload:{
      id:id,
      round:1
    }})
  }

  handleExpandedRowRender = (record) => {
    const itemExtraList = this.props.deliverOrderDetail.singleOrderDetail.itemExtraList[`${record.item_id}`] || []
    const expandDetailColumns = [{
      title:'货号',
      dataIndex:'item_ref',
      width:'18%',
      render:()=>'',
    },{
      title:'颜色',
      dataIndex:'color',
    },{
      title:'尺码',
      dataIndex:'size',
    },{
      title:'数量',
      dataIndex:'quantity',
      className: styles['numberRightMove'],
      render: (text,record) => record.quantity
    },{
      title:'备注',
      dataIndex:'remark',
    }]
    if(record.colorId) {
      if(Object.prototype.toString.call(itemExtraList) === '[object Array]') return <div>无</div>
      else {
        return (
          <table style={{width:'84.5%',float:'right'}}>
            <thead className={styles.tableHead}>
              <tr>
                <th><span></span></th>
                {
                  itemExtraList[0].map( (n,index) => {
                    return <th key={index}><span>{n.name}</span></th>
                  })
                }
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {
                itemExtraList.map( (n,index) => {
                  return index == 0 ? null : (
                    <tr key={index}>
                      <td>{n.name}</td>
                      {
                        n.children.map( (m,i) => {
                          return (
                            <td key={i}><Popover content={<div><p>{`备注：${m.remark}`}</p></div>}>{m.quantity}</Popover></td>
                          )
                        })
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        )
      }
    }else {
      if(itemExtraList.length) {
        return <Table columns={expandDetailColumns} rowKey='id' dataSource={itemExtraList || []} pagination={false} showHeader={false} />
      }else {
        return <div>无</div>
      }
    }
  }

  render() {
    const {singleOrderDetail} = this.props.deliverOrderDetail;

    const breadcrumbList = [{
      title:'单据',
    },{
      title:'调货单',
    },{
      title:`#${singleOrderDetail.number  || ''}`
    }]

    const menu = (
      <Menu>
        <Menu.Item key='1'>
          <Popconfirm title="确认删除此调货单?" placement='bottom' onConfirm={this.handleDeleteSingle.bind(null,singleOrderDetail.id)}>删除</Popconfirm>
        </Menu.Item>
      </Menu>
    )

    const action = (
      <div>
        <ButtonGroup>
          <Popconfirm title='确认打印调货单' placement='bottom' onConfirm={this.handlePrint.bind(null,singleOrderDetail.id)}><Button >打印</Button></Popconfirm>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
      </div>
    )

    const extra = (
      <Row>
        <Col span='8' offset={8}>
          <div className={styles.textSecondary}>商品项数</div>
          <div className={styles.heading}>{singleOrderDetail.total_count || ''}</div>
        </Col>
        <Col span='8'>
          <div className={styles.textSecondary}>商品数量</div>
          <div className={styles.heading}>{singleOrderDetail.total_quantity || ''}</div>
        </Col>
      </Row>
    );

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="出货仓库">{singleOrderDetail.fromwarehouse || ''}</Description>
        <Description term="发货状态"><span style={{color: singleOrderDetail.status == 1 ? 'red' : 'rgba(0,0,0,0.85)'}}>{singleOrderDetail.sendStatus || ''}</span></Description>
        <Description term="入货仓库">{singleOrderDetail.towarehouse || ''}</Description>
        <Description term="入货状态"><span style={{color: singleOrderDetail.status == 3 ? 'rgba(0,0,0,0.85)' : 'red'}}>{singleOrderDetail.buyStatus || ''}</span></Description>
        <Description term="备注">{singleOrderDetail.remark || ''}</Description>
      </DescriptionList>
    );

    const itemDetailColumns = [{
      title:'货号',
      dataIndex:'item_ref',
    },{
      title:'颜色',
      dataIndex:'color',
    },{
      title:'尺码',
      dataIndex:'size',
    },{
      title:'数量',
      dataIndex:'quantity',
      className: styles['numberRightMove'],
      render: (text,record) => record.quantity
    },{
      title:'备注',
      dataIndex:'remark',
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
        title={`单号: #${singleOrderDetail.number || '' }` }
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={action}
        extraContent={extra}
        content={description}
        breadcrumbList={breadcrumbList}
      >
        <Card title='商品清单' bordered={false} style={{marginBottom:30}}>
          <Table  columns={itemDetailColumns} rowKey='id' dataSource={singleOrderDetail.itemList || []} pagination={false}  expandedRowRender={this.handleExpandedRowRender}/>
        </Card>
        <Card title='操作记录' bordered={false}>
          <Table columns={operationColumns} rowKey='id' dataSource={singleOrderDetail.operationSource || []} pagination={false} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
