import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import currency from 'currency.js'
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider,Menu,Dropdown,Popover} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/antd-pro/DescriptionList';
import styles from './InventoryOrderDetail.less'
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const NCNI = value => currency(value, { symbol: "", precision: 0});
const ButtonGroup = Button.Group;
const { Description } = DescriptionList;
@connect(state => ({
  inventoryOrderDetail:state.inventoryOrderDetail,
}))
export default class InventoryOrderDetail extends PureComponent {

  handleDeleteSingle = (id) => {
    this.props.dispatch({type:'inventoryOrderDetail/deleteSingle',payload:id}).then(()=>{
      this.props.dispatch(routerRedux.push('/bill/inventory-order'))
    })
  }

  handlePrint = (id) => {
    this.props.dispatch({type:'inventoryOrderDetail/printSaleOrder',payload:{
      id:id,
      round:1
    }})
  }

  handleExpandedRowRender = (record) => {
    const itemExtraList = this.props.inventoryOrderDetail.singleOrderDetail.itemExtraList[`${record.item_id}`] || []
    const expandDetailColumns = [{
      title:'货号',
      dataIndex:'item_ref',
      width:'15%',
      render:() => ''
    },{
      title:'颜色',
      dataIndex:'color',
      width:'18%',
    },{
      title:'尺码',
      dataIndex:'size',
      width:'15%',
    },{
      title:'盘前数量',
      dataIndex:'before_number',
      width:'15%',
      className: styles['numberRightMove'],
      render: (text,record) => NCNI(record.before_number).format(true)
    },{
      title:'盘后数量',
      dataIndex:'after_number',
      width:'15%',
      className: styles['numberRightMove'],
      render: (text,record) => NCNI(record.after_number).format(true)
    },{
      title:'备注',
      dataIndex:'remark',
      width:'18%',
    }]
    if(record.colorId) {
      if(itemExtraList.length) {
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
                            <td key={i}><Popover content={<div><p>{`备注：${m.remark}`}</p></div>}>{m.name}</Popover></td>
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
      }else {
        return <div>空</div>
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
    const {singleOrderDetail} = this.props.inventoryOrderDetail;

    const breadcrumbList = [{
      title:'单据',
    },{
      title:'盘点单',
    },{
      title:`#${singleOrderDetail.number  || ''}`
    }]

    const menu = (
      <Menu>
        <Menu.Item key='1'>
          <Popconfirm title="确认删除此盘点单?" placement='bottom' onConfirm={this.handleDeleteSingle.bind(null,singleOrderDetail.id)}>删除</Popconfirm>
        </Menu.Item>
      </Menu>
    )

    const action = (
      <div>
        <ButtonGroup>
          <Popconfirm title='确认打印盘点单' placement='bottom' onConfirm={this.handlePrint.bind(null,singleOrderDetail.id)}><Button >打印</Button></Popconfirm>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button><Icon type="ellipsis" /></Button>
          </Dropdown>
        </ButtonGroup>
      </div>
    )

    const extra = (
      <Row>
        <Col span='6'>
          <div className={styles.textSecondary}>盘亏数量</div>
          <div className={styles.heading}>{singleOrderDetail.losses_quantity || ''}</div>
        </Col>
        <Col span='6'>
          <div className={styles.textSecondary}>盘亏价值</div>
          <div className={styles.heading}>{singleOrderDetail.losses_amount || ''}</div>
        </Col>
        <Col span='6'>
          <div className={styles.textSecondary}>盘盈数量</div>
          <div className={styles.heading}>{singleOrderDetail.profit_quantity || ''}</div>
        </Col>
        <Col span='6'>
          <div className={styles.textSecondary}>盘盈价值</div>
          <div className={styles.heading}>{singleOrderDetail.profit_amount || ''}</div>
        </Col>
      </Row>
    );

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="1">
        <Description term="备注">{singleOrderDetail.remark || ''}</Description>
      </DescriptionList>
    );

    const itemDetailColumns = [{
      title:'货号',
      dataIndex:'item_ref',
    },{
      title:'颜色',
      dataIndex:'color',
      width:'18%',
    },{
      title:'尺码',
      dataIndex:'size',
      width:'15%',
    },{
      title:'盘前数量',
      dataIndex:'before_number',
      width:'15%',
      className: styles['numberRightMove'],
      render: (text,record) => NCNI(record.before_number).format(true)
    },{
      title:'盘后数量',
      dataIndex:'after_number',
      width:'15%',
      className: styles['numberRightMove'],
      render: (text,record) => NCNI(record.after_number).format(true)
    },{
      title:'备注',
      dataIndex:'remark',
      width:'18%',
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
