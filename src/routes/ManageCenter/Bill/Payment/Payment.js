import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import breadCrumbList from '../../../../common/breadCrumbList';
import PaymentModal from './Modal';
import styles from './Payment.less';
@connect(state => ({
  payment: state.payment,
}))
export default class Payment extends PureComponent {
  state = {
    modalVisibel: false,
    modalType: '',
    formValue: {},
    isSort: false,
  }

  componentDidMount() {
    this.props.dispatch({ type: 'payment/getList' });
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
    this.props.dispatch({ type: `payment/${value.id ? 'editSingle' : 'createSingle'}`, payload: value }).then((result) => {
      if (result.code != 0) {
        message.error(result.message);
      } else {
        this.props.dispatch({ type: 'payment/getList' });
      }
    }).catch(()=>{
      value.id ? message.error('编辑失败') : message.error('新建失败')
    });
  }

  handleDeleteSingle = (item) => {
    this.props.dispatch({ type: 'payment/deleteSingle',
      payload: {
        id: item.id,
      } }).then(() => {
      this.props.dispatch({ type: 'payment/getList' });
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
    this.props.dispatch({ type: 'payment/getList' });
  }

  handleSortMove = (id, moveWay) => {
    this.props.dispatch({ type: 'payment/setSortMove',
      payload: {
        currentId: id,
        moveWay,
      } });
  }

  handleSortOk = () => {
    this.props.dispatch({ type: 'payment/editSort', payload: this.props.payment.payments }).then(() => {
      this.handleSortCancel();
    }).catch(()=>{
      message.error('排序失败')
      this.handleSortCancel();
    });
  }

  render() {
    const { payments } = this.props.payment;
    const { modalVisibel, modalType, formValue, isSort } = this.state;
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
              <Button type="primary" onClick={this.handleModalCreate}>新建支付方式</Button>
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
                <a onClick={this.handleSortMove.bind(null, record.id, 'up')} style={{ display: payments.findIndex(n => n.id == record.id) == 0 ? 'none' : 'inline-block' }}>上移</a>
                <Divider type="vertical" style={{ display: (payments.findIndex(n => n.id == record.id) == 0 || payments.findIndex(n => n.id == record.id) == payments.length - 1) ? 'none' : 'inline-block' }} />
                <a onClick={this.handleSortMove.bind(null, record.id, 'down')} style={{ display: payments.findIndex(n => n.id == record.id) == payments.length - 1 ? 'none' : 'inline-block' }}>下移</a>
              </div>
            ) : (
              <div>
                <a onClick={this.handleModalEdit.bind(null, record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm onConfirm={this.handleDeleteSingle.bind(null, record)} title="确认删除此支付方式"><a >删除</a></Popconfirm>
              </div>
            )
          }
        </div>
      ),
    }];

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)} action={action} className={styles.actionExtra}>
        <Card>
          <Table dataSource={payments} columns={columns} rowKey="id" pagination={false} />
        </Card>
        <PaymentModal type={modalType} visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel} sortLength={payments.length} />
      </PageHeaderLayout>
    );
  }
}
