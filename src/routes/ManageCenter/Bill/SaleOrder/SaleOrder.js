import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider, Switch, Modal } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import breadCrumbList from '../../../../common/breadCrumbList';
import DuokeSwitch from '../../../../components/DuokeSwitch';
import AdjustPriceModal from './AdjustPriceModal';
import SaleLabelModal from './SaleLabelModal';
import styles from './SaleOrder.less';

const tabList = [{
  key: 'adjust_price',
  tab: '调价方式',
}, {
  key: 'default_deliver_way',
  tab: '默认发货方式',
}, {
  key: 'default_price',
  tab: '默认价格',
}, {
  key: 'sale_label',
  tab: '销售单标签',
}];
@connect(state => ({
  adjustPrice: state.adjustPrice,
  configSetting: state.configSetting,
  label: state.label,
}))
export default class SaleOrder extends PureComponent {
  state = {
    activeTabKey: 'adjust_price',
    modalAdjustPriceVisibel: false,
    modalAdjustPriceType: '',
    formAdjustPriceValue: {},
    modalLabelVisibel: false,
    formLabelValue: {},
    isSort: false,
  }

  componentDidMount() {
    this.props.dispatch({ type: 'adjustPrice/getList' });
    this.props.dispatch({ type: 'label/getSaleOrderLabel' });
  }

  handleModalAdjustPriceCreate = () => {
    this.setState({
      modalAdjustPriceVisibel: true,
      modalAdjustPriceType: 'create',
      formAdjustPriceValue: {},
    });
  }

  handleModalAdjustPriceCancel = () => {
    this.setState({
      modalAdjustPriceVisibel: false,
    });
  }

  handleModalAdjustPriceEdit = (item) => {
    this.setState({
      modalAdjustPriceVisibel: true,
      modalAdjustPriceType: 'edit',
      formAdjustPriceValue: item,
    });
  }

  handleModaAdjustPricelOk = (value) => {
    // 折扣
    if (value.adjustPrice == '1') {
      value.value = 0;
      value.percent = 1;
      value.percent_method = 1;
    // 百分比
    } else if (value.adjustPrice == '2') {
      value.value = 0;
      value.percent = 1;
      value.percent_method = 0;
    // 减价
    } else if (value.adjustPrice == '3') {
      value.value = 1;
      value.percent = 0;
      value.percent_method = 0;
    }
    delete value.adjustPrice;
    this.setState({
      modalAdjustPriceVisibel: false,
    });
    this.props.dispatch({ type: `adjustPrice/${value.id ? 'editSingle' : 'createSingle'}`, payload: value }).then((result) => {
      if (result.code != 0) {
        message.error(result.message);
      } else {
        this.props.dispatch({ type: 'adjustPrice/getList' });
      }
    }).catch(()=>{
      value.id ? message.error('编辑失败') : message.error('新建失败')
    });
  }

  handleDeleteSingle = (item) => {
    this.props.dispatch({ type: 'adjustPrice/deleteSingle',
      payload: {
        id: item.id,
      } }).then((res) => {
        if(res.code !== 0) {
          message.error(res.message);
        }
      this.props.dispatch({ type: 'adjustPrice/getList' });
    }).catch(()=>{
      message.error('删除失败')
    });
  }

  handleLabelModalOpen = (item) => {
    this.setState({
      modalLabelVisibel: true,
      formLabelValue: item,
    });
  }

  handleLabelModalCancel = () => {
    this.setState({
      modalLabelVisibel: false,
    });
  }

  handleLabelModalOk = (value) => {
    this.setState({
      modalLabelVisibel: false,
    });
    this.props.dispatch({ type: 'label/editSaleOrderLabel', payload: value }).then(() => {
      this.props.dispatch({ type: 'label/getSaleOrderLabel' });
    }).catch(()=>{
      message.error('编辑失败')
    });
  }

  handleTabChange = (key) => {
    this.setState({
      activeTabKey: key,
    });
  }

  handleSwitchDefaultDeliverWay = (key) => {
    this.props.dispatch({ type: 'configSetting/switchDefaultDeleiverWay', payload: key }).then(() => {
      this.props.dispatch({ type: 'configSetting/getConfigSetting' });
    }).catch(()=>{
      message.error('更改失败')
    });
  }

  handleSwitchDefaultPrice = (key) => {
    if (key == 1) {
      this.props.dispatch({ type: 'configSetting/switchUsePrice', payload: 'no' }).then(() => {
        this.props.dispatch({ type: 'configSetting/switchHistoryPrice', payload: 'no' }).then(() => {
          this.props.dispatch({ type: 'configSetting/getConfigSetting' });
        }).catch(()=>{
          message.error('更改失败')
        });
      });
    } else if (key == 2) {
      this.props.dispatch({ type: 'configSetting/switchUsePrice', payload: 'yes' }).then(() => {
        this.props.dispatch({ type: 'configSetting/switchHistoryPrice', payload: 'no' }).then(() => {
          this.props.dispatch({ type: 'configSetting/getConfigSetting' });
        }).catch(()=>{
          message.error('更改失败')
        });
      });
    } else if (key == 3) {
      this.props.dispatch({ type: 'configSetting/switchHistoryPrice', payload: 'yes' }).then(() => {
        this.props.dispatch({ type: 'configSetting/getConfigSetting' });
      }).catch(()=>{
        message.error('更改失败')
      });
    }
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
    this.props.dispatch({ type: 'adjustPrice/getList' });
  }

  handleSortMove = (id, moveWay) => {
    this.props.dispatch({ type: 'adjustPrice/setSortMove',
      payload: {
        currentId: id,
        moveWay,
      } });
  }

  handleSortOk = () => {
    this.props.dispatch({ type: 'adjustPrice/editSort', payload: this.props.adjustPrice.adjustPrices }).then(() => {
      this.handleSortCancel();
    }).catch(()=>{
      message.error('排序失败')
      this.handleSortCancel();
    });
  }

  handleDeliverConfirm = (key) => {
    Modal.confirm({
      title: '确认更改默认发货方式策略',
      onOk: () => {
        this.handleSwitchDefaultDeliverWay(key);
      },
    });
  }

  handleDefaultConfirm = (key) => {
    Modal.confirm({
      title: '确认更改默认价格策略',
      onOk: () => {
        this.handleSwitchDefaultPrice(key);
      },
    });
  }

  render() {
    const { adjustPrices } = this.props.adjustPrice;
    const { defaultDeliveryWay, usePricelelvel, useHistoryPrice } = this.props.configSetting;
    const { saleLabels } = this.props.label;
    const { modalAdjustPriceVisibel, modalAdjustPriceType, formAdjustPriceValue, activeTabKey, modalLabelVisibel, formLabelValue, isSort } = this.state;

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
              <Button type="primary" onClick={this.handleModalAdjustPriceCreate}>新建调价方式</Button>
            </div>
          )
        }
      </div>
    );

    const adjustPriceColumns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '调价',
      dataIndex: 'adjustprice',
      render: (text, record) => (
        record.value == 1 ? '减价' : (
          record.percent == 1 ? (
            record.percent_method == 1 ? '折' : '百分比'
          ) : '-'
        )
      ),
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 172,
      render: (text, record) => (
        <div>
          <a onClick={this.handleModalAdjustPriceEdit.bind(null, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm onConfirm={this.handleDeleteSingle.bind(null, record)} title="确认删除此调价方式"><a >删除</a></Popconfirm>
        </div>
      ),
    }];

    const sortAdjustPriceColumns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 172,
      render: (text, record) => (
        <div>
          <a onClick={this.handleSortMove.bind(null, record.id, 'up')} style={{ display: adjustPrices.findIndex(n => n.id == record.id) == 0 ? 'none' : 'inline-block' }}>上移</a>
          <Divider type="vertical" style={{ display: (adjustPrices.findIndex(n => n.id == record.id) == 0 || adjustPrices.findIndex(n => n.id == record.id) == adjustPrices.length - 1) ? 'none' : 'inline-block' }} />
          <a onClick={this.handleSortMove.bind(null, record.id, 'down')} style={{ display: adjustPrices.findIndex(n => n.id == record.id) == adjustPrices.length - 1 ? 'none' : 'inline-block' }}>下移</a>
        </div>
      ),
    }];

    const saleLabelColumns = [{
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
      render: (text, record) => <a onClick={this.handleLabelModalOpen.bind(null, record)}>编辑</a>,
    }];

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)} tabList={tabList} activeTabKey={activeTabKey} onTabChange={this.handleTabChange}>
        <div style={{ display: activeTabKey == 'adjust_price' ? 'block' : 'none' }}>
          <Card title="调价方式列表" extra={action}>
            <Table dataSource={adjustPrices} columns={isSort ? sortAdjustPriceColumns : adjustPriceColumns} rowKey="id" pagination={false} />
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'default_deliver_way' ? 'block' : 'none' }}>
          <Card bordered={false}>
            <DuokeSwitch title="现场自提" onClick={this.handleDeliverConfirm.bind(null, 1)} checked={defaultDeliveryWay == 1} disname="icon" />
          </Card>
          <Divider style={{ margin: 0, width: 0 }} />
          <Card bordered={false}>
            <DuokeSwitch title="稍后自提" onClick={this.handleDeliverConfirm.bind(null, 2)} checked={defaultDeliveryWay == 2} disname="icon" />
          </Card>
          <Divider style={{ margin: 0, width: 0 }} />
          <Card bordered={false}>
            <DuokeSwitch title="稍后拼包" onClick={this.handleDeliverConfirm.bind(null, 4)} checked={defaultDeliveryWay == 4} disname="icon" />
          </Card>
          <Divider style={{ margin: 0, width: 0 }} />
          <Card bordered={false}>
            <DuokeSwitch title="物流运输" onClick={this.handleDeliverConfirm.bind(null, 3)} checked={defaultDeliveryWay == 3} disname="icon" />
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'default_price' ? 'block' : 'none' }}>
          <Card bordered={false}>
            <DuokeSwitch title="标准价" onClick={this.handleDefaultConfirm.bind(null, 1)} checked={usePricelelvel == 'no' && useHistoryPrice == 'no'} disname="icon" />
          </Card>
          <Divider style={{ margin: 0, width: 0 }} />
          <Card bordered={false}>
            <DuokeSwitch title="客户价" onClick={this.handleDefaultConfirm.bind(null, 2)} checked={usePricelelvel == 'yes' && useHistoryPrice == 'no'} disname="icon" />
          </Card>
          <Divider style={{ margin: 0, width: 0 }} />
          <Card bordered={false}>
            <DuokeSwitch title="历史购买价" onClick={this.handleDefaultConfirm.bind(null, 3)} checked={useHistoryPrice == 'yes'} disname="icon" />
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'sale_label' ? 'block' : 'none' }}>
          <Card bordered={false}>
            <Table dataSource={saleLabels} columns={saleLabelColumns} rowKey="id" pagination={false} />
          </Card>
        </div>
        <SaleLabelModal visible={modalLabelVisibel} formValue={formLabelValue} onOk={this.handleLabelModalOk} onCancel={this.handleLabelModalCancel} />
        <AdjustPriceModal type={modalAdjustPriceType} visible={modalAdjustPriceVisibel} formValue={formAdjustPriceValue} onOk={this.handleModaAdjustPricelOk} onCancel={this.handleModalAdjustPriceCancel} sortLength={adjustPrices.length} />
      </PageHeaderLayout>
    );
  }
}
