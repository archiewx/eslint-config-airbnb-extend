import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import breadCrumbList from '../../../../common/breadCrumbList';
import GoodsLabelModal from './Modal';
import styles from './GoodsLabel.less';
@connect(state => ({
  label: state.label,
}))
export default class GoodsLabel extends PureComponent {
  state = {
    modalVisibel: false,
    formValue: {},
  }

  componentDidMount() {
    this.props.dispatch({ type: 'label/getItemLabel' });
  }

  handleModalOpen = (item) => {
    this.setState({
      modalVisibel: true,
      formValue: item,
    });
  }

  handleModalCancel = () => {
    this.setState({
      modalVisibel: false,
    });
  }

  handleModalOk = (value) => {
    this.setState({
      modalVisibel: false,
    });
    this.props.dispatch({ type: 'label/editItemLableSingle', payload: value }).then(() => {
      this.props.dispatch({ type: 'label/getItemLabel' });
    }).catch(()=>{
      message.error('编辑失败')
    });
  }

  render() {
    const { itemLabels } = this.props.label;
    const { modalVisibel, formValue } = this.state;

    const columns = [{
      title: ' ',
      dataIndex: 'color',
      width: 30,
      render: (text, record) => <div style={{ width: 24, height: 24, borderRadius: 12, background: `#${record.color}` }} />,
    }, {
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 172,
      render: (text, record) => <a onClick={this.handleModalOpen.bind(null, record)}>编辑</a>,
    }];

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)}>
        <Card>
          <Table dataSource={itemLabels} columns={columns} rowKey="id" pagination={false} />
        </Card>
        <GoodsLabelModal visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel} />
      </PageHeaderLayout>
    );
  }
}
