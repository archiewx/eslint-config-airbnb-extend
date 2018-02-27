import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import PaymentModal from './Modal'
import styles from './Payment.less'
@connect(state => ({
  payment:state.payment,
}))
export default class Payment extends PureComponent {

  state = {
    modalVisibel: false,
    modalType: '',
    formValue: {},
  }

  componentDidMount(){
    this.props.dispatch({type:'payment/getList'})
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
      modalVisibel:false,
    })
    this.props.dispatch({type:`payment/${value.id ? 'editSingle' : 'createSingle'}`,payload:value}).then(()=>{
      this.props.dispatch({type:'payment/getList'})
    })
  }

  handleDeleteSingle = (item) => {
    this.props.dispatch({type:'payment/deleteSingle',payload:{
      id:item.id
    }}).then(()=>{
      this.props.dispatch({type:'payment/getList'})
    })
  }

  render() {
    const {payments} = this.props.payment;
    const {modalVisibel,modalType,formValue} = this.state;
    const action = (
      <div>
        <Button>自定义排序</Button>
        <Button type='primary' onClick={this.handleModalCreate}>新建支付方式</Button>
      </div>
    )

    const columns = [{
      title:'名称',
      dataIndex:'name'
    },{
      title:'操作',
      dataIndex:'operation',
      width:172,
      render:(text,record) => (
        <div>
          <a onClick={this.handleModalEdit.bind(null,record)}>编辑</a>
          <Divider  type='vertical' />
          <Popconfirm onConfirm={this.handleDeleteSingle.bind(null,record)} title='确认删除此支付方式'><a >删除</a></Popconfirm>
        </div>
      )
    }]

    return (
      <PageHeaderLayout action={action} className={styles.actionExtra}>
        <Card>
          <Table dataSource={payments} columns={columns} rowKey='id' pagination={false}/>
        </Card>
        <PaymentModal type={modalType} visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel} sortLength={payments.length}/>
      </PageHeaderLayout>
    );
  }
}
