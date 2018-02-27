import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import CustomerGroupModal from './Modal'
import styles from './CustomerGroup.less'
@connect(state => ({
  customerGroup:state.customerGroup,
}))
export default class CustomerGroup extends PureComponent {

  state = {
    modalVisibel: false,
    modalType: '',
    formValue: {},
    parentItem:{},
  }

  componentDidMount(){
    this.props.dispatch({type:'customerGroup/getList'})
  }

  handleModalCreate = (key,item) => {
    this.setState({
      modalVisibel: true,
      modalType: key,
      formValue: {},
      parentItem: item
    })
  }

  handleModalCancel = () => {
    this.setState({
      modalVisibel: false
    })
  }

  handleModalEdit = (item,key) => {
    this.setState({
      modalVisibel: true,
      modalType: key,
      formValue: item,
    })
  }

  handleModalOk = (value) => {
    this.setState({
      modalVisibel: false
    })
    this.props.dispatch({type:`customerGroup/${ this.state.modalType.indexOf('Create') > -1 ? 'createSingle' : 'editSingle'}`,payload:value}).then(()=>{
      this.props.dispatch({type:'customerGroup/getList'})
    })
  }

  handleDeleteSingle = (item) => {
    this.props.dispatch({type:`customerGroup/deleteSingle`,payload:{
      id: item.uid ? item.uid : item.id
    }}).then(()=>{
      this.props.dispatch({type:'customerGroup/getList'})
    })
  }

  render() {
    const {customerGroups} = this.props.customerGroup;
    const {modalVisibel,modalType,formValue,parentItem} = this.state;
    const action = (
      <div>
        <Button>自定义排序</Button>
        <Button type='primary' onClick={this.handleModalCreate.bind(null,'groupCreate')}>新建客户分组</Button>
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
          <a onClick={this.handleModalCreate.bind(null,'entryCreate',record)} style={{visibility: record.uid ? 'hidden' : 'none'}}>添加</a>
          <Divider  type='vertical' style={{visibility: record.uid ? 'hidden' : 'none'}}/>
          <a onClick={this.handleModalEdit.bind(null,record, record.uid ? 'entryEdit' : 'groupEdit')}>编辑</a>
          <Divider  type='vertical' />
          <Popconfirm onConfirm={this.handleDeleteSingle.bind(null,record)} title={`${record.uid ? '确认删除此子分组' : '确认删除此客户分组'}`}><a >删除</a></Popconfirm>
        </div>
      )
    }]

    return (
      <PageHeaderLayout action={action} className={styles.actionExtra}>
        <Card>
          <Table dataSource={customerGroups} columns={columns} rowKey='id' pagination={false}/>
        </Card>
        <CustomerGroupModal type={modalType} visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel} sortGroupLength={customerGroups.length}  parentItem={parentItem}/>
      </PageHeaderLayout>
    );
  }
}
