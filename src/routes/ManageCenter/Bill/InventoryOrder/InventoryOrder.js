import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider, Switch } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import breadCrumbList from '../../../../common/breadCrumbList';
import InventoryModal from './Modal';
import styles from './InventoryOrder.less';

const tabList = [{
  key: 'inventroy',
  tab: '盘点审批',
}];
@connect(state => ({
  inventoryApprover: state.inventoryApprover,
  configSetting: state.configSetting,
}))
export default class Inventory extends PureComponent {
  state = {
    activeTabKey: 'inventroy',
    modalVisibel: false,
    modalType: '',
    formValue: {},
  }

  componentDidMount() {
    // this.props.dispatch({type:'color/getList'})
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
    const inventoryApprover = { ...this.props.configSetting.inventoryApprover };
    for (const key in inventoryApprover) {
      if (value.warehouse_id == inventoryApprover[key].warehouse_id) {
        inventoryApprover[key] = value;
      }
    }
    this.setState({
      modalVisibel: false,
    });
    this.props.dispatch({ type: 'configSetting/switchInventoryApprover', payload: Object.values(inventoryApprover) }).then(() => {
      this.props.dispatch({ type: 'configSetting/getConfigSetting' });
    });
  }

  handleSwitchCurrentWarehouse = (item) => {
    const inventoryApprover = { ...this.props.configSetting.inventoryApprover };
    if (item.user_id) {
      for (const key in inventoryApprover) {
        if (item.warehouse_id == inventoryApprover[key].warehouse_id) {
          delete inventoryApprover[key].user_name;
          delete inventoryApprover[key].user_id;
        }
      }
    } else {
      for (const key in inventoryApprover) {
        if (item.warehouse_id == inventoryApprover[key].warehouse_id) {
          inventoryApprover[key].user_id = this.props.inventoryApprover.approvers[0].id;
          inventoryApprover[key].user_name = this.props.inventoryApprover.approvers[0].name;
        }
      }
    }
    this.props.dispatch({ type: 'configSetting/switchInventoryApprover', payload: Object.values(inventoryApprover) }).then(() => {
      this.props.dispatch({ type: 'configSetting/getConfigSetting' });
    });
  }

  render() {
    const { approvers } = this.props.inventoryApprover;
    const { inventoryApprover } = this.props.configSetting;
    const { modalVisibel, modalType, formValue, activeTabKey } = this.state;

    const columns = [{
      title: '名称',
      dataIndex: 'warehouse_name',
    }, {
      title: '审批人',
      dataIndex: 'user_name',
      render: (text, record) => record.user_name || '-',
    }, {
      title: '需要审批',
      dataIndex: 'needInventory',
      render: (text, record) => <Switch checkedChildren="开" unCheckedChildren="关" checked={!!record.user_name} onClick={this.handleSwitchCurrentWarehouse.bind(null, record)} />,
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 172,
      render: (text, record) => (<a onClick={this.handleModalOpen.bind(null, record)}>编辑</a>),
    }];

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)} tabList={tabList} activeTabKey={activeTabKey}>
        <Card>
          <Table dataSource={inventoryApprover} columns={columns} rowKey="warehouse_id" pagination={false} />
        </Card>
        <InventoryModal visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel} approvers={approvers} />
      </PageHeaderLayout>
    );
  }
}
