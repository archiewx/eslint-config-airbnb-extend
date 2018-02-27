import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table,Icon,Popconfirm,Divider} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import PurchaseOrderLableModal from './Modal'
// import styles from './GoodsLabel.less'
const tabList = [{
  key:'purchase_label',
  tab:'进货单标签'
}]
@connect(state => ({
  label:state.label,
}))
export default class PurchaseOrderLabel extends PureComponent {

  state = {
    activeTabKey:'purchase_label',
    modalVisibel: false,
    formValue: {},
  }

  componentDidMount(){
    this.props.dispatch({type:'label/getPurchaseOrderLabel'})
  }

  handleModalOpen = (item) => {
    this.setState({
      modalVisibel: true,
      formValue: item
    })
  }

  handleModalCancel = () => {
    this.setState({
      modalVisibel: false
    })
  }

  handleModalOk = (value) => {
    this.setState({
      modalVisibel:false,
    })
    this.props.dispatch({type:'label/editPurchaseOrderLabel',payload:value}).then(()=>{
      this.props.dispatch({type:'label/getPurchaseOrderLabel'})
    })
  }

  render() {
    const {purchaseLabels} = this.props.label;
    const {modalVisibel,formValue,activeTabKey} = this.state;

    const columns = [{
      title:' ',
      dataIndex:'color',
      width:30,
      render:(text,record) => <div style={{width:24,height:24,borderRadius:12,background:`#${record.color}`}}></div>
    },{
      title:'名称',
      dataIndex:'name'
    },{
      title:'操作',
      dataIndex:'operation',
      width:172,
      render:(text,record) => <a onClick={this.handleModalOpen.bind(null,record)}>编辑</a>
    }]

    return (
      <PageHeaderLayout tabList={tabList} activeTabKey={activeTabKey}>
        <Card>
          <Table dataSource={purchaseLabels} columns={columns} rowKey='id' pagination={false}/>
        </Card>
        <PurchaseOrderLableModal visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel}/>
      </PageHeaderLayout>
    );
  }
}
