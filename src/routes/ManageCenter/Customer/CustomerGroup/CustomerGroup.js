import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import breadCrumbList from '../../../../common/breadCrumbList';
import CustomerGroupModal from './Modal';
import styles from './CustomerGroup.less';
@connect(state => ({
  customerGroup: state.customerGroup,
}))
export default class CustomerGroup extends PureComponent {
  state = {
    modalVisibel: false,
    modalType: '',
    formValue: {},
    parentItem: {},
    isSort: false,
  }

  componentDidMount() {
    this.props.dispatch({ type: 'customerGroup/getList' });
  }

  handleModalCreate = (key, item) => {
    this.setState({
      modalVisibel: true,
      modalType: key,
      formValue: {},
      parentItem: item,
    });
  }

  handleModalCancel = () => {
    this.setState({
      modalVisibel: false,
    });
  }

  handleModalEdit = (item, key) => {
    this.setState({
      modalVisibel: true,
      modalType: key,
      formValue: item,
    });
  }

  handleModalOk = (value) => {
    this.setState({
      modalVisibel: false,
    });
    this.props.dispatch({ type: `customerGroup/${this.state.modalType.indexOf('Create') > -1 ? 'createSingle' : 'editSingle'}`, payload: value }).then((result) => {
      if (result.code != 0) {
        message.error(result.message);
      } else {
        this.props.dispatch({ type: 'customerGroup/getList' });
      }
    }).catch(()=>{
      this.state.modalType.indexOf('Create') ? message.error('新建失败') : message.error('编辑失败')
    });
  }

  handleDeleteSingle = (item) => {
    this.props.dispatch({ type: 'customerGroup/deleteSingle',
      payload: {
        id: item.uid ? item.uid : item.id,
      } }).then((result) => {
      if (result.code != 0) {
        message.error(result.message);
      } else {
        this.props.dispatch({ type: 'customerGroup/getList' });
      }
    }).catch(()=>{
      message.error('删除失败')
    });
  }

  handleSortStart = () => {
    this.setState({
      isSort: true,
    });
  }

  handleSortCancel = () => {
    this.setState({
      isSort: false,
    });
    this.props.dispatch({ type: 'customerGroup/getList' });
  }

  handleSortMove = (item, moveWay) => {
    this.props.dispatch({ type: 'customerGroup/setSortMove',
      payload: {
        item,
        moveWay,
      } });
  }

  handleSortOk = () => {
    this.props.dispatch({ type: 'customerGroup/editSort', payload: this.props.customerGroup.customerGroups }).then(() => {
      this.handleSortCancel();
    }).catch(()=>{
      message.error('排序失败')
      this.handleSortCancel();
    });
  }

  render() {
    const { customerGroups } = this.props.customerGroup;
    const { modalVisibel, modalType, formValue, parentItem, isSort } = this.state;
    const action = (
      <div>
        {
          isSort ? (
            <div>
              <Popconfirm title="确认取消自定义排序" onConfirm={this.handleSortCancel}>
                <Button >取消</Button>
              </Popconfirm>
              <Button type="primary" onClick={this.handleSortOk}>确认</Button>
            </div>
          ) : (
            <div>
              <Button onClick={this.handleSortStart}>自定义排序</Button>
              <Button type="primary" onClick={this.handleModalCreate.bind(null, 'groupCreate')}>新建客户分组</Button>
            </div>
          )
        }
      </div>
    );

    const columns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 172,
      render: (text, record) => (
        <div>
          {
            isSort ? (
              <div>
                {record.uid ? <a style={{ visibility: 'hidden' }}>你好</a> : null}
                {record.uid ? <Divider style={{ visibility: 'hidden' }} type="vertical" /> : null}
                <a onClick={this.handleSortMove.bind(null, record, 'up')} style={{ display: (customerGroups.findIndex(n => n.id == record.id) == 0 || record.uid && customerGroups.find(n => n.id == record.parent_id).children.findIndex(n => n.uid == record.uid) == 0) ? 'none' : 'inline-block' }}>上移</a>
                <Divider type="vertical" style={{ display: (customerGroups.findIndex(n => n.id == record.id) == 0 || customerGroups.findIndex(n => n.id == record.id) == customerGroups.length - 1 || record.uid && customerGroups.find(n => n.id == record.parent_id).children.findIndex(n => n.uid == record.uid) == 0 || record.uid && customerGroups.find(n => n.id == record.parent_id).children.findIndex(n => n.uid == record.uid) == customerGroups.find(n => n.id == record.parent_id).children.length - 1) ? 'none' : 'inline-block' }} />
                <a onClick={this.handleSortMove.bind(null, record, 'down')} style={{ display: (customerGroups.findIndex(n => n.id == record.id) == customerGroups.length - 1 || record.uid && customerGroups.find(n => n.id == record.parent_id).children.findIndex(n => n.uid == record.uid) == customerGroups.find(n => n.id == record.parent_id).children.length - 1) ? 'none' : 'inline-block' }}>下移</a>
              </div>
            ) : (
              <div>
                <a onClick={this.handleModalCreate.bind(null, 'entryCreate', record)} style={{ visibility: record.uid ? 'hidden' : 'none' }}>添加</a>
                <Divider type="vertical" style={{ visibility: record.uid ? 'hidden' : 'none' }} />
                <a onClick={this.handleModalEdit.bind(null, record, record.uid ? 'entryEdit' : 'groupEdit')}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm onConfirm={this.handleDeleteSingle.bind(null, record)} title={`${record.uid ? '确认删除此子分组' : '确认删除此客户分组'}`}><a >删除</a></Popconfirm>
              </div>
            )
          }
        </div>
      ),
    }];

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)} action={action} className={styles.actionExtra}>
        <Card>
          <Table dataSource={customerGroups} columns={columns} rowKey="id" pagination={false} />
        </Card>
        <CustomerGroupModal type={modalType} visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel} sortGroupLength={customerGroups.length} parentItem={parentItem} />
      </PageHeaderLayout>
    );
  }
}
