import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider,Switch} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import PriceGradeModal from './PriceGradeModal'
import PriceQuantityStepModal from './PriceQuantityStepModal'
import styles from './Price.less'
const tabList = [{
  key: 'priceGrade',
  tab: '价格等级'
},{
  key: 'priceComposition',
  tab: '价格组成'
}]
@connect(state => ({
  priceGrade:state.priceGrade,
  priceQuantityStep:state.priceQuantityStep,
  configSetting:state.configSetting,
}))
export default class Size extends PureComponent {

  state = {
    activeTabKey:'priceGrade',
    priceGradeModalVisibel: false,
    priceGradeModalType: '',
    priceGradeModalFormValue: {},
    priceQuantityStepModalVisibel: false,
  }

  componentDidMount(){
    this.props.dispatch({type:'priceGrade/getList'})
    this.props.dispatch({type:'priceQuantityStep/getList'})
  }

  handlePriceGradeModalCreate = () => {
    this.setState({
      priceGradeModalVisibel: true,
      priceGradeModalType: 'create',
      priceGradeModalFormValue: {}
    })
  }

  handlePriceGradeModalModalCancel = () => {
    this.setState({
      priceGradeModalVisibel: false
    })
  }

  handlePriceGradeModalModalEdit = (item) => {
    this.setState({
      priceGradeModalVisibel: true,
      priceGradeModalType: 'edit',
      priceGradeModalFormValue: item
    })
  }

  handlePriceGradeModalModalOk = (value) => {
    this.setState({
      priceGradeModalVisibel:false
    })
    this.props.dispatch({type:`priceGrade/${this.state.priceGradeModalType == 'create' ? 'createSingle' : 'editSingle'}`,payload: value}).then(()=>{
      this.props.dispatch({type:'priceGrade/getList'})
    })
  }

  handlePriceGradeModalDeleteSingle = (item) => {
    this.props.dispatch({type:'priceGrade/deleteSingle',payload:{
      id:item.id
    }}).then(()=>{
      this.props.dispatch({type:'priceGrade/getList'})
    })
  }

  handleSwitchUsePriceLevel = () => {
    this.props.dispatch({type:'configSetting/switchUsePrice',payload:this.props.configSetting.usePricelelvel == 'yes' ? 'no' : 'yes'}).then(()=>{
      this.props.dispatch({type:'configSetting/getConfigSetting'})
    })
  }

  handleSwitchPriceModal = (key) => {
    let current ;
    if(key == 0) {
      if(this.props.configSetting.priceModel == 'shop') {
        current = ''
      }else {
        current = 'shop'
      }
    }else if(key == 1) {
      if(this.props.configSetting.priceModel == 'unit') {
        current = ''
      }else {
        current = 'unit'
      }
    }else if(key == 2) {
      if(this.props.configSetting.priceModel == 'quantityrange') {
        current = ''
      }else {
        current = 'quantityrange'
      }
    }
    this.props.dispatch({type:'configSetting/switchPriceModal',payload: current }).then(()=>{
      this.props.dispatch({type:'configSetting/getConfigSetting'})
    })
  }

  handlePriceQuantityStepModalCreate = () => {
    this.setState({
      priceQuantityStepModalVisibel: true,
    })
  }

  handlePriceQuantityStepModalEdit = (item) => {
    this.setState({
      priceQuantityStepModalVisibel: true,
    })
  }

  handlePriceQuantityStepModalCancel = () => {
    this.setState({
      priceQuantityStepModalVisibel: false
    })
  }

  handlePriceQuantityStepModalOk = (value) => {
    this.setState({
      priceQuantityStepModalVisibel:false
    })
    this.props.dispatch({type:'priceQuantityStep/createSingle',payload: value}).then(()=>{
      this.props.dispatch({type:'priceQuantityStep/getList'})
    })
  }

  handlePriceQuantityStepDeleteSingle = (item) => {
    this.props.dispatch({type:'priceQuantityStep/deleteSingle',payload:{
      id:item.id
    }}).then(()=>{
      this.props.dispatch({type:'priceQuantityStep/getList'})
    })
  }

  handleTabChange = (key) => {
    this.setState({activeTabKey:key})
  }

  render() {
    const {priceGrades} = this.props.priceGrade;
    const {priceQuantitySteps} = this.props.priceQuantityStep;
    const {usePricelelvel,priceModel} = this.props.configSetting;
    const {priceGradeModalVisibel,priceGradeModalType,priceGradeModalFormValue,priceQuantityStepModalVisibel,priceQuantityStepModalType,priceQuantityStepModalFormValue,activeTabKey} = this.state;

    const priceGradeAction = (
      <div>
        <Button style={{marginRight:10}}>自定义排序</Button>
        <Button type='primary' onClick={this.handlePriceGradeModalCreate} style={{marginRight:20}}>新建</Button>
        <Switch checkedChildren="开" unCheckedChildren="关"  onClick={this.handleSwitchUsePriceLevel} checked={usePricelelvel == 'yes'}/>
      </div>
    )

    const sizeGroupAction = (
      <div>
        <Button type='primary' onClick={this.handleSizeGroupModalCreate}>新建尺码组</Button>
      </div>
    )

    const priceGradeColumns = [{
      title:'名称',
      dataIndex:'name'
    },{
      title:'操作',
      dataIndex:'operation',
      width:172,
      render:(text,record) => (
        <div>
          <a onClick={this.handlePriceGradeModalModalEdit.bind(null,record)}>编辑</a>
          { record.default != '1' ? <Divider  type='vertical' /> : null } 
          { record.default != '1' ? <Popconfirm onConfirm={this.handlePriceGradeModalDeleteSingle.bind(null,record)} title='确认删除此价格等级'><a >删除</a></Popconfirm> : null }
        </div>
      )
    }]

    const priceQuantityStepColumns = [{
      title:'价格阶梯',
      dataIndex:'name',
    },{
      title:'操作',
      dataIndex:'operation',
      width:122,
      render:(text,record) => (
        <div>
          <Popconfirm onConfirm={this.handlePriceQuantityStepDeleteSingle.bind(null,record)} title='确认删除此价格阶梯'><a >删除</a></Popconfirm>
        </div>
      )
    }]

    return (
      <PageHeaderLayout tabList={tabList} activeTabKey={activeTabKey} onTabChange={this.handleTabChange}>
      <div style={{display:activeTabKey == 'priceGrade' ? 'block' : 'none'}}>
        <Card bordered={false} title='价格等级列表' extra={priceGradeAction}>
          <Table dataSource={priceGrades} columns={priceGradeColumns} rowKey='id' pagination={false}/>
        </Card>
      </div>
      <div style={{display:activeTabKey == 'priceComposition' ? 'block' : 'none'}}>
        <Card bordered={false} className={styles.cardBottom}>
          <div>
            <span className={styles.spanTitle}>按店铺区分价格</span><Switch onClick={this.handleSwitchPriceModal.bind(null,0)} checked={priceModel == 'shop'} className={styles.switchPosition} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}></Switch>
          </div>
        </Card>
        <Card bordered={false} className={styles.cardBottom}>
          <div>
            <span className={styles.spanTitle}>按单位区分价格</span><Switch onClick={this.handleSwitchPriceModal.bind(null,1)} checked={priceModel == 'unit'} className={styles.switchPosition} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}></Switch>
          </div>
        </Card>
        <Card bordered={false} >
          <div style={{marginBottom:32}}>
            <span className={styles.spanTitle}>按购买量区分价格</span>
            <span className={styles.switchPosition}><Button type='primary' style={{marginRight:24}} onClick={this.handlePriceQuantityStepModalCreate}>新建价格阶梯</Button><Switch onClick={this.handleSwitchPriceModal.bind(null,2)} checked={priceModel == 'quantityrange'} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}></Switch></span>
          </div>
          <Table dataSource={priceQuantitySteps} columns={priceQuantityStepColumns} rowKey='id' pagination={false}/>
        </Card>
      </div>  
      <PriceGradeModal type={priceGradeModalType} visible={priceGradeModalVisibel} formValue={priceGradeModalFormValue} onOk={this.handlePriceGradeModalModalOk} onCancel={this.handlePriceGradeModalModalCancel} sortLength={priceGrades.length}/>
      <PriceQuantityStepModal visible={priceQuantityStepModalVisibel}  onOk={this.handlePriceQuantityStepModalOk} onCancel={this.handlePriceQuantityStepModalCancel}/>
      </PageHeaderLayout>
    );
  }
}
