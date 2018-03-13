import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import breadCrumbList from '../../../../common/breadCrumbList'
import CustomerMemberModal from './Modal'
import styles from './CustomerMember.less'
@connect(state => ({
  priceGrade:state.priceGrade,
  customerMember:state.customerMember,
}))
export default class CustomerMember extends PureComponent {

  state = {
    modalVisibel: false,
    modalType: '',
    formValue: {},
    isSort:false
  }

  componentDidMount(){
    this.props.dispatch({type:'priceGrade/getList'})
    this.props.dispatch({type:'customerMember/getList'})
  }

  handleModalCreate = () => {
    this.setState({
      modalVisibel: true,
      modalType: 'create',
      formValue: {}
    })
  }

  handleModalCancel = () => {
    this.setState({
      modalVisibel: false
    })
  }

  handleModalEdit = (item) => {
    this.setState({
      modalVisibel: true,
      modalType: 'edit',
      formValue: item
    })
  }

  handleModalOk = (value) => {
    this.setState({
      modalVisibel:false
    })
    this.props.dispatch({type:`customerMember/${value.id ? 'editSingle':'createSingle' }`,payload:value}).then((result)=>{
      if(result.code != 0) {
        message.error(`${result.message}`)
      }else {
        this.props.dispatch({type:'customerMember/getList'})  
      }
    })
  }

  handleDeleteSingle = (item) => {
    this.props.dispatch({type:'customerMember/deleteSingle',payload:{
      id:item.id
    }}).then(()=>{
      this.props.dispatch({type:'customerMember/getList'})
    })
  }

  handleSortStart = () => {
    this.setState({
      isSort:true
    })
  }

  handleSortCancel = () => {
    this.setState({
      isSort:false
    })
    this.props.dispatch({type:'customerMember/getList'})
  }

  handleSortMove = (id,moveWay) => {
    this.props.dispatch({type:'customerMember/setSortMove',payload:{
      currentId:id,
      moveWay:moveWay,
    }})
  }

  handleSortOk = () => {
    this.props.dispatch({type:'customerMember/editSort',payload:this.props.customerMember.customerMembers}).then(()=>{
      this.handleSortCancel()
    })
  }

  render() {
    const {customerMembers} = this.props.customerMember;
    const {priceGrades} = this.props.priceGrade;
    const {modalVisibel,modalType,formValue,isSort} = this.state;
    const action = (
      <div>
        {
          isSort ? (
            <div>
              <Popconfirm title='确认取消自定义排序' onConfirm={this.handleSortCancel}>
                <Button >取消</Button>
              </Popconfirm>
              <Button type='primary' onClick={this.handleSortOk}>确认</Button>
            </div>
          ) : (
            <div>
              <Button onClick={this.handleSortStart}>自定义排序</Button> 
              <Button type='primary' onClick={this.handleModalCreate}>新建客户等级</Button>
            </div>
          )
        }
      </div>
    )

    const columns = [{
      title:'名称',
      dataIndex:'name',
      width:'20%'
    },{
      title:'关联的价格等级',
      dataIndex: 'relationPriceGrade',
      render:(text,record) => `${record.pricelevel.data.name}`
    },{
      title:'赊账额度',
      dataIndex: 'debt',
      className: styles['numberRightMove'],
      width:'18%',
      render: (text,record) => `${record.debt}`
    },{
      title: '价格调整',
      dataIndex: 'discount',
      className: styles['numberRightMove'],
      width:'28%',
      render:(text,record) =>  `${Number(record.discount).toFixed(2)}%`
    },{
      title:'操作',
      dataIndex:'operation',
      width:172,
      render:(text,record) => (
        <div>
          <a onClick={this.handleModalEdit.bind(null,record)}>编辑</a>
          <Divider  type='vertical' />
          <Popconfirm onConfirm={this.handleDeleteSingle.bind(null,record)} title='确认删除此客户等级'><a>删除</a></Popconfirm>
        </div>
      )
    }]

    const sortColumns = [{
      title:'名称',
      dataIndex:'name',
    },,{
      title:'操作',
      dataIndex:'operation',
      width:172,
      render:(text,record) => (
        <div>
          <a onClick={this.handleSortMove.bind(null,record.id,'up')} style={{display: priceGrades.findIndex( n => n.id == record.id) == 0 ? 'none' : 'inline-block'}}>上移</a>
          <Divider  type='vertical' style={{display: (priceGrades.findIndex( n => n.id == record.id) == 0 || priceGrades.findIndex( n => n.id == record.id) == priceGrades.length -1) ? 'none' : 'inline-block'}}/>
          <a onClick={this.handleSortMove.bind(null,record.id,'down')} style={{display: priceGrades.findIndex( n => n.id == record.id) == priceGrades.length - 1 ? 'none' : 'inline-block'}}>下移</a>
        </div>
      )
    }]

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)} action={action} className={styles.actionExtra}>
        <Card>
          <Table dataSource={customerMembers} columns={ isSort ? sortColumns :  columns} rowKey='id' pagination={false}/>
        </Card>
        <CustomerMemberModal type={modalType} visible={modalVisibel} formValue={formValue} priceGrades={priceGrades} onOk={this.handleModalOk} onCancel={this.handleModalCancel} sortLength={customerMembers.length}/>
      </PageHeaderLayout>
    );
  }
}
