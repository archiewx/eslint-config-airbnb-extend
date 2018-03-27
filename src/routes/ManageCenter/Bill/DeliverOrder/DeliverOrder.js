import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider, Switch } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import breadCrumbList from '../../../../common/breadCrumbList';
import DeliverOrderModal from './Modal';
import styles from './DeliverOrder.less';

const tabList = [{
  key: 'logistics',
  tab: '物流公司',
}];
@connect(state => ({
  logistics: state.logistics,
}))
export default class DeliverOrder extends PureComponent {
  state = {
    activeTabKey: 'logistics',
    modalVisibel: false,
    modalType: '',
    formValue: {},
    isSort: false,
  }

  componentDidMount() {
    this.props.dispatch({ type: 'logistics/getList' });
  }

  handleModalCreate = () => {
    this.setState({
      modalVisibel: true,
      modalType: 'create',
      formValue: {},
    });
  }

  handleModalCancel = () => {
    this.setState({
      modalVisibel: false,
    });
  }

  handleModalEdit = (item) => {
    this.setState({
      modalVisibel: true,
      modalType: 'edit',
      formValue: item,
    });
  }

  handleModalOk = (value) => {
    this.setState({
      modalVisibel: false,
    });
    this.props.dispatch({ type: `logistics/${value.id ? 'editSingle' : 'createSingle'}`, payload: value }).then((result) => {
      if (result.code != 0) {
        message.error(`${result.message}`);
      } else {
        this.props.dispatch({ type: 'logistics/getList' });
      }
    }).catch(()=>{
      value.id ? message.error('编辑失败') : message.error('新建失败')
    });
  }

  handleDeleteSingle = (item) => {
    this.props.dispatch({ type: 'logistics/deleteSingle',
      payload: {
        id: item.id,
      } }).then(() => {
      this.props.dispatch({ type: 'logistics/getList' });
    }).catch(()=>{
      message.error('删除失败')
    });
  }

  handleEditUse = (item) => {
    const current = {
      id: item.id,
      name: item.name,
      use: '',
    };
    item.use == 1 ? current.use = 0 : current.use = 1;
    this.props.dispatch({ type: 'logistics/editSingle', payload: current }).then(() => {
      this.props.dispatch({ type: 'logistics/getList' });
    }).catch(()=>{
      message.error('更改失败')
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
    this.props.dispatch({ type: 'logistics/getList' });
  }

  handleSortMove = (id, moveWay) => {
    this.props.dispatch({ type: 'logistics/setSortMove',
      payload: {
        currentId: id,
        moveWay,
      } });
  }

  handleSortOk = () => {
    this.props.dispatch({ type: 'logistics/editSort', payload: this.props.logistics.logistics }).then(() => {
      this.handleSortCancel();
    }).catch(()=>{
      message.error('排序失败')
      this.handleSortCancel();
    });
  }

  render() {
    const { logistics } = this.props.logistics;
    const { modalVisibel, modalType, formValue, activeTabKey, isSort } = this.state;

    const action = (
      <div>
        {
          isSort ? (
            <div>
              <Popconfirm title="确认取消自定义排序" onConfirm={this.handleSortCancel}>
                <Button style={{ marginRight: 10 }}>取消</Button>
              </Popconfirm>
              <Button type="primary" onClick={this.handleSortOk}>确认</Button>
            </div>
          ) : (
            <div>
              <Button style={{ marginRight: 10 }} onClick={this.handleSortStart}>自定义排序</Button>
              <Button type="primary" onClick={this.handleModalCreate}>新建物流公司</Button>
            </div>
          )
        }
      </div>
    );

    const columns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '显示状况',
      dataIndex: 'showStatus',
      render: (text, record) => (
        <Switch checked={record.use == 1} checkedChildren="开" unCheckedChildren="关" onClick={this.handleEditUse.bind(null, record)} />
      ),
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 172,
      render: (text, record) => (
        record.system == 1 ? null : (
          <div>
            <a onClick={this.handleModalEdit.bind(null, record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm onConfirm={this.handleDeleteSingle.bind(null, record)} title="确认删除此物流公司"><a >删除</a></Popconfirm>
          </div>
        )
      ),
    }];

    const sortColumns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 172,
      render: (text, record) => (
        <div>
          <a onClick={this.handleSortMove.bind(null, record.id, 'up')} style={{ display: logistics.findIndex(n => n.id == record.id) == 0 ? 'none' : 'inline-block' }}>上移</a>
          <Divider type="vertical" style={{ display: (logistics.findIndex(n => n.id == record.id) == 0 || logistics.findIndex(n => n.id == record.id) == logistics.length - 1) ? 'none' : 'inline-block' }} />
          <a onClick={this.handleSortMove.bind(null, record.id, 'down')} style={{ display: logistics.findIndex(n => n.id == record.id) == logistics.length - 1 ? 'none' : 'inline-block' }}>下移</a>
        </div>
      ),
    }];

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)} tabList={tabList} activeTabKey={activeTabKey}>
        <Card title="物流公司" extra={action}>
          <Table dataSource={logistics} columns={isSort ? sortColumns : columns} rowKey="id" pagination={false} />
        </Card>
        <DeliverOrderModal type={modalType} visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel} sortLength={logistics.length} />
      </PageHeaderLayout>
    );
  }
}
