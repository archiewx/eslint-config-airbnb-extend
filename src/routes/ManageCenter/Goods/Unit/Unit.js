import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import UnitModal from './Modal'
import styles from './Unit.less'
@connect(state => ({
  unit:state.unit,
}))
export default class Unit extends PureComponent {

  state = {
    modalVisibel: false,
    modalType: '',
    formValue: {},
    isSort:false
  }

  componentDidMount(){
    this.props.dispatch({type:'unit/getList'})
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
    if(this.state.modalType === 'create') {
      this.setState({
        modalVisibel:false,
      })
      this.props.dispatch({type:'unit/createSingle',payload:value}).then(()=>{
        this.props.dispatch({type:'unit/getList'})
      })
    }else if(this.state.modalType === 'edit') {
      this.setState({
        modalVisibel:false,
      })
      this.props.dispatch({type:'unit/editSingle',payload:value}).then(()=>{
        this.props.dispatch({type:'unit/getList'})
      })
    }
  }

  handleDeleteSingle = (item) => {
    this.props.dispatch({type:'unit/deleteSingle',payload:{
      id:item.id
    }}).then(()=>{
      this.props.dispatch({type:'unit/getList'})
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
    this.props.dispatch({type:'unit/getList'})
  }

  handleSortMove = (id,moveWay) => {
    this.props.dispatch({type:'unit/setSortMove',payload:{
      currentId:id,
      moveWay:moveWay,
    }})
  }

  handleSortOk = () => {
    this.props.dispatch({type:'unit/editSort',payload:this.props.unit.units}).then(()=>{
      this.handleSortCancel()
    })
  }


  render() {
    const {units} = this.props.unit;
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
          ): (
            <div>
              <Button onClick={this.handleSortStart}>自定义排序</Button>
              <Button type='primary' onClick={this.handleModalCreate}>新建单位</Button>
            </div>
          )
        }
      </div>
    )

    const columns = [{
      title:'名称',
      dataIndex:'name'
    },{
      title:'数量',
      dataIndex:'number'
    },{
      title:'操作',
      dataIndex:'operation',
      width:172,
      render:(text,record) => (
        <div>
          {
            isSort ? (
              <div>
                <a onClick={this.handleSortMove.bind(null,record.id,'up')} style={{display: units.findIndex( n => n.id == record.id) == 0 ? 'none' : 'inline-block'}}>上移</a>
                <Divider  type='vertical' style={{display: (units.findIndex( n => n.id == record.id) == 0 || units.findIndex( n => n.id == record.id) == units.length -1) ? 'none' : 'inline-block'}}/>
                <a onClick={this.handleSortMove.bind(null,record.id,'down')} style={{display: units.findIndex( n => n.id == record.id) == units.length - 1 ? 'none' : 'inline-block'}}>下移</a>
              </div>
            ) : (
              <div>
                <a onClick={this.handleModalEdit.bind(null,record)} >编辑</a>
                <Divider  type='vertical' style={{display:record.default ==1 ? 'none' : 'inline-block'}}/>
                <Popconfirm onConfirm={this.handleDeleteSingle.bind(null,record)} title='确认删除此单位' ><a style={{display:record.default ==1 ? 'none' : 'inline-block'}}>删除</a></Popconfirm>
              </div>
            )
          }
        </div>
      )
    }]

    return (
      <PageHeaderLayout action={action} className={styles.actionExtra}>
        <Card>
          <Table dataSource={units} columns={columns} rowKey='id' pagination={false}/>
        </Card>
        <UnitModal type={modalType} visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel} sortLength={units.length}/>
      </PageHeaderLayout>
    );
  }
}
