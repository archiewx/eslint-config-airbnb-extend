import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import SizeLibraryModal from './SizeLibraryModal'
import SizeGroupModal from './SizeGroupModal'
import styles from './Size.less'
const tabList = [{
  key: 'sizeLibrary',
  tab: '尺码库'
},{
  key: 'sizeGroup',
  tab: '尺码组'
}]
@connect(state => ({
  size:state.size,
}))
export default class Size extends PureComponent {

  state = {
    activeTabKey:'sizeLibrary',
    sizeLibraryModalVisibel: false,
    sizeLibraryModalType: '',
    sizeLibraryModalFormValue: {},
    sizeGroupModalVisibel: false,
    sizeGroupModalType: '',
    sizeGroupModalFormValue: {},
  }

  componentDidMount(){
    this.props.dispatch({type:'size/getList'})
  }

  handleSizeLibraryModalCreate = () => {
    this.setState({
      sizeLibraryModalVisibel: true,
      sizeLibraryModalType: 'create',
      sizeLibraryModalFormValue: {}
    })
  }

  handleSizeLibraryModalCancel = () => {
    this.setState({
      sizeLibraryModalVisibel: false
    })
  }

  handleSizeLibraryModalEdit = (item) => {
    this.setState({
      sizeLibraryModalVisibel: true,
      sizeLibraryModalType: 'edit',
      sizeLibraryModalFormValue: item
    })
  }

  handleSizeLibraryModalOk = (value) => {
    if(this.state.sizeLibraryModalType === 'create') {
      this.setState({
        sizeLibraryModalVisibel:false,
      })
      this.props.dispatch({type:'size/createSizeLibrarySingle',payload:value}).then(()=>{
        this.props.dispatch({type:'size/getSizeLibrary'})
      })
    }else if(this.state.sizeLibraryModalType === 'edit') {
      this.setState({
        sizeLibraryModalVisibel:false,
      })
      this.props.dispatch({type:'size/editSizeLibrarySingle',payload:value}).then(()=>{
        this.props.dispatch({type:'size/getSizeLibrary'})
      })
    }
  }

  handleSizeLibraryDeleteSingle = (item) => {
    this.props.dispatch({type:'size/deleteSizeLibrarySingle',payload:{
      id:item.id
    }}).then(()=>{
      this.props.dispatch({type:'size/getSizeLibrary'})
    })
  }

  handleSizeGroupModalCreate = () => {
    this.setState({
      sizeGroupModalVisibel: true,
      sizeGroupModalType: 'create',
      sizeGroupModalFormValue: {},
    })
  }

  handleSizeGroupModalEdit = (item) => {
    this.setState({
      sizeGroupModalVisibel: true,
      sizeGroupModalType: 'edit',
      sizeGroupModalFormValue: item,
    })
  }

  handleSizeGroupModalCancel = () => {
    this.setState({
      sizeGroupModalVisibel: false
    })
  }

  handleSizeGroupModalOk = (value) => {
    this.setState({
      sizeGroupModalVisibel:false
    })
    this.props.dispatch({type:`size/${ this.state.sizeGroupModalType == 'create' ? 'createSizeGroupSingle' : 'editSizeGroupSingle' }` ,payload: value}).then(()=>{
      this.props.dispatch({type:'size/getSizeGroup'})
    })
  }

  handleSizeGroupDeleteSingle = (item) => {
    this.props.dispatch({type:'size/deleteSizeGroupSingle',payload:{
      id:item.id
    }}).then(()=>{
      this.props.dispatch({type:'size/getSizeGroup'})
    })
  }

  handleTabChange = (key) => {
    this.setState({activeTabKey:key})
  }

  render() {
    const {sizeLibrarys,sizeGroups} = this.props.size;
    const {sizeLibraryModalVisibel,sizeLibraryModalType,sizeLibraryModalFormValue,sizeGroupModalVisibel,sizeGroupModalType,sizeGroupModalFormValue,activeTabKey} = this.state;

    const sizeLibraryAction = (
      <div>
        <Button style={{marginRight:10}}>自定义排序</Button>
        <Button type='primary' onClick={this.handleSizeLibraryModalCreate}>新建</Button>
      </div>
    )

    const sizeGroupAction = (
      <div>
        <Button type='primary' onClick={this.handleSizeGroupModalCreate}>新建尺码组</Button>
      </div>
    )

    const sizeLibraryColumns = [{
      title:'名称',
      dataIndex:'name'
    },{
      title:'操作',
      dataIndex:'operation',
      width:172,
      render:(text,record) => (
        <div>
          <a onClick={this.handleSizeLibraryModalEdit.bind(null,record)}>编辑</a>
          <Divider  type='vertical' />
          <Popconfirm onConfirm={this.handleSizeLibraryDeleteSingle.bind(null,record)} title='确认删除此尺码'><a >删除</a></Popconfirm>
        </div>
      )
    }]

    const sizeGroupColumns = [{
      title:'名称',
      dataIndex:'name',
      width:'15%'
    },{
      title:'包含的尺码',
      dataIndex:'includeSize',
      render:(text,record) => `${record.skuattributes.data.map( n => n.name).join('、')}`
    },{
      title:'操作',
      dataIndex:'operation',
      width:172,
      render:(text,record) => (
        <div>
          <a onClick={this.handleSizeGroupModalEdit.bind(null,record)}>编辑</a>
          <Divider  type='vertical' />
          <Popconfirm onConfirm={this.handleSizeGroupDeleteSingle.bind(null,record)} title='确认删除此尺码组'><a >删除</a></Popconfirm>
        </div>
      )
    }]

    return (
      <PageHeaderLayout tabList={tabList} activeTabKey={activeTabKey} onTabChange={this.handleTabChange}>
        <div style={{display:activeTabKey == 'sizeLibrary' ? 'block' : 'none'}}>
          <Card bordered={false} title='尺码库列表' extra={sizeLibraryAction}>
            <Table dataSource={sizeLibrarys} columns={sizeLibraryColumns} rowKey='id' pagination={false}/>
          </Card>
        </div>
        <div style={{display:activeTabKey == 'sizeGroup' ? 'block' : 'none'}}>
          <Card bordered={false} title='尺码组列表' extra={sizeGroupAction}>
            <Table dataSource={sizeGroups} columns={sizeGroupColumns} rowKey='id' pagination={false}/>
          </Card>
        </div>       
        <SizeLibraryModal type={sizeLibraryModalType} visible={sizeLibraryModalVisibel} formValue={sizeLibraryModalFormValue} onOk={this.handleSizeLibraryModalOk} onCancel={this.handleSizeLibraryModalCancel} sortLength={sizeLibrarys.length}/>
        <SizeGroupModal type={sizeGroupModalType} visible={sizeGroupModalVisibel} formValue={sizeGroupModalFormValue} onOk={this.handleSizeGroupModalOk} onCancel={this.handleSizeGroupModalCancel} optionSize ={sizeLibrarys}/>
      </PageHeaderLayout>
    );
  }
}
