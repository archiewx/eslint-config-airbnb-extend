import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider,Switch} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DeliverOrderModal from './Modal'
import styles from './DeliverOrder.less'
const tabList = [{
  key:'logistics',
  tab:'物流公司'  
}]
@connect(state => ({
  logistics:state.logistics,
}))
export default class DeliverOrder extends PureComponent {

  state = {
    activeTabKey:'logistics',
    modalVisibel: false,
    modalType: '',
    formValue: {},
  }

  componentDidMount(){
    this.props.dispatch({type:'logistics/getList'})
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
    this.props.dispatch({type:`logistics/${value.id ? 'editSingle' : 'createSingle'}`,payload:value}).then(()=>{
      this.props.dispatch({type:'logistics/getList'})
    })
  }

  handleDeleteSingle = (item) => {
    this.props.dispatch({type:'logistics/deleteSingle',payload:{
      id:item.id
    }}).then(()=>{
      this.props.dispatch({type:'logistics/getList'})
    })
  }

  handleEditUse = (item) => {
    let current = {
      id: item.id,
      name:item.name,
      use: ''
    }
    item.use == 1 ? current.use = 0 : current.use = 1
    this.props.dispatch({type:'logistics/editSingle',payload: current }).then(()=>{
      this.props.dispatch({type:'logistics/getList'})
    })
  }

  render() {
    const {logistics} = this.props.logistics;
    const {modalVisibel,modalType,formValue,activeTabKey} = this.state;

    const action = (
      <div>
        <Button style={{marginRight:10}}>自定义排序</Button>
        <Button type='primary' onClick={this.handleModalCreate}>新建物流公司</Button>
      </div>
    )

    const columns = [{
      title:'名称',
      dataIndex:'name'
    },{
      title:'显示状况',
      dataIndex:'showStatus',
      render:(text,record) => (
        <Switch checked={record.use == 1} checkedChildren="开" unCheckedChildren="关" onClick={this.handleEditUse.bind(null,record)}/>
      )
    },{
      title:'操作',
      dataIndex:'operation',
      width:172,
      render:(text,record) => (
        record.system == 1 ? null : (
          <div>
            <a onClick={this.handleModalEdit.bind(null,record)}>编辑</a>
            <Divider  type='vertical' />
            <Popconfirm onConfirm={this.handleDeleteSingle.bind(null,record)} title='确认删除此物流公司'><a >删除</a></Popconfirm>
          </div>
        )
      )
    }]

    return (
      <PageHeaderLayout tabList={tabList} activeTabKey={activeTabKey}>
        <Card title='物流公司' extra={action}>
          <Table dataSource={logistics} columns={columns} rowKey='id' pagination={false}/>
        </Card>
        <DeliverOrderModal type={modalType} visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel} sortLength={logistics.length}/>
      </PageHeaderLayout>
    );
  }
}
