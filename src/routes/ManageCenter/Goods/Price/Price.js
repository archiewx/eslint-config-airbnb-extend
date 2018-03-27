import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider, Switch, Modal } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import PriceGradeModal from './PriceGradeModal';
import breadCrumbList from '../../../../common/breadCrumbList';
import PriceQuantityStepModal from './PriceQuantityStepModal';
import styles from './Price.less';

const tabList = [{
  key: 'priceGrade',
  tab: '价格等级',
}, {
  key: 'priceComposition',
  tab: '价格组成',
}];
@connect(state => ({
  priceGrade: state.priceGrade,
  priceQuantityStep: state.priceQuantityStep,
  configSetting: state.configSetting,
}))
export default class Size extends PureComponent {
  state = {
    activeTabKey: 'priceGrade',
    priceGradeModalVisibel: false,
    priceGradeModalType: '',
    priceGradeModalFormValue: {},
    priceQuantityStepModalVisibel: false,
    isSort: false,
  }

  componentDidMount() {
    this.props.dispatch({ type: 'priceGrade/getList' });
    this.props.dispatch({ type: 'priceQuantityStep/getList' });
  }

  handlePriceGradeModalCreate = () => {
    this.setState({
      priceGradeModalVisibel: true,
      priceGradeModalType: 'create',
      priceGradeModalFormValue: {},
    });
  }

  handlePriceGradeModalModalCancel = () => {
    this.setState({
      priceGradeModalVisibel: false,
    });
  }

  handlePriceGradeModalModalEdit = (item) => {
    this.setState({
      priceGradeModalVisibel: true,
      priceGradeModalType: 'edit',
      priceGradeModalFormValue: item,
    });
  }

  handlePriceGradeModalModalOk = (value) => {
    this.setState({
      priceGradeModalVisibel: false,
    });
    this.props.dispatch({ type: `priceGrade/${this.state.priceGradeModalType == 'create' ? 'createSingle' : 'editSingle'}`, payload: value }).then((result) => {
      if (result.code != 0) {
        message.error(result.message);
      } else {
        this.props.dispatch({ type: 'priceGrade/getList' });
      }
    }).catch(()=>{
      this.state.priceGradeModalType == 'create' ? message.error('新建失败') : message.error('编辑失败')
    });
  }

  handlePriceGradeDeleteSingle = (item) => {
    this.props.dispatch({ type: 'priceGrade/deleteSingle',
      payload: {
        id: item.id,
      } }).then(() => {
      this.props.dispatch({ type: 'priceGrade/getList' });
    }).catch(()=>{
      message.error('删除失败')
    });
  }

  handleSwitchUsePriceLevel = () => {
    this.props.dispatch({ type: 'configSetting/switchUsePrice', payload: this.props.configSetting.usePricelelvel == 'yes' ? 'no' : 'yes' }).then(() => {
      this.props.dispatch({ type: 'configSetting/getConfigSetting' });
    }).catch(()=>{
      message.error('更改失败')
    });
  }

  handleSwitchPriceModal = (key) => {
    let current;
    if (key == 0) {
      if (this.props.configSetting.priceModel == 'shop') {
        current = '';
      } else {
        current = 'shop';
      }
    } else if (key == 1) {
      if (this.props.configSetting.priceModel == 'unit') {
        current = '';
      } else {
        current = 'unit';
      }
    } else if (key == 2) {
      if (this.props.configSetting.priceModel == 'quantityrange') {
        current = '';
      } else {
        current = 'quantityrange';
      }
    }
    this.props.dispatch({ type: 'configSetting/switchPriceModal', payload: current }).then(() => {
      this.props.dispatch({ type: 'configSetting/getConfigSetting' });
    }).catch(()=>{
      message.error('更改失败')
    });
  }

  handlePriceQuantityStepModalCreate = () => {
    this.setState({
      priceQuantityStepModalVisibel: true,
    });
  }

  handlePriceQuantityStepModalEdit = (item) => {
    this.setState({
      priceQuantityStepModalVisibel: true,
    });
  }

  handlePriceQuantityStepModalCancel = () => {
    this.setState({
      priceQuantityStepModalVisibel: false,
    });
  }

  handlePriceQuantityStepModalOk = (value) => {
    this.setState({
      priceQuantityStepModalVisibel: false,
    });
    this.props.dispatch({ type: 'priceQuantityStep/createSingle', payload: value }).then(() => {
      this.props.dispatch({ type: 'priceQuantityStep/getList' });
    }).catch(()=>{
      message.error('新建失败')
    });
  }

  handlePriceQuantityStepDeleteSingle = (item) => {
    this.props.dispatch({ type: 'priceQuantityStep/deleteSingle',
      payload: {
        id: item.id,
      } }).then(() => {
      this.props.dispatch({ type: 'priceQuantityStep/getList' });
    }).catch(()=>{
      message.error('删除失败')
    });
  }

  handleTabChange = (key) => {
    this.setState({ activeTabKey: key });
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
    this.props.dispatch({ type: 'priceGrade/getList' });
  }

  handleSortMove = (id, moveWay) => {
    this.props.dispatch({ type: 'priceGrade/setSortMove',
      payload: {
        currentId: id,
        moveWay,
      } });
  }

  handleSortOk = () => {
    this.props.dispatch({ type: 'priceGrade/editSort', payload: this.props.priceGrade.priceGrades }).then(() => {
      this.handleSortCancel();
    }).catch(()=>{
      message.error('排序失败')
      this.handleSortCancel();
    });
  }

  handlePriceGradeConfirm = () => {
    Modal.confirm({
      title: '确认更改价格等级策略',
      onOk: () => {
        this.handleSwitchUsePriceLevel();
      },
    });
  }

  handlePriceCompositionConfirm = (key) => {
    Modal.confirm({
      title: '确认更改价格组成策略',
      onOk: () => {
        this.handleSwitchPriceModal(key);
      },
    });
  }

  render() {
    const { priceGrades } = this.props.priceGrade;
    const { priceQuantitySteps } = this.props.priceQuantityStep;
    const { usePricelelvel, priceModel } = this.props.configSetting;
    const { priceGradeModalVisibel, priceGradeModalType, priceGradeModalFormValue, priceQuantityStepModalVisibel, priceQuantityStepModalType, priceQuantityStepModalFormValue, activeTabKey, isSort } = this.state;

    const priceGradeAction = (
      <div>
        {
          isSort ? (
            <div>
              <Popconfirm title="确认取消自定义排序" onConfirm={this.handleSortCancel}>
                <Button style={{ marginRight: 10 }} >取消</Button>
              </Popconfirm>
              <Button type="primary" onClick={this.handleSortOk}>确认</Button>
            </div>
          ) : (
            <div>
              <Button style={{ marginRight: 10 }} onClick={this.handleSortStart}>自定义排序</Button>
              <Button type="primary" onClick={this.handlePriceGradeModalCreate} style={{ marginRight: 20 }}>新建价格等级</Button>
              <Switch checkedChildren="开" unCheckedChildren="关" onClick={this.handlePriceGradeConfirm} checked={usePricelelvel == 'yes'} />
            </div>
          )
        }
      </div>
    );

    const priceGradeColumns = [{
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
                <a onClick={this.handleSortMove.bind(null, record.id, 'up')} style={{ display: priceGrades.findIndex(n => n.id == record.id) == 0 ? 'none' : 'inline-block' }}>上移</a>
                <Divider type="vertical" style={{ display: (priceGrades.findIndex(n => n.id == record.id) == 0 || priceGrades.findIndex(n => n.id == record.id) == priceGrades.length - 1) ? 'none' : 'inline-block' }} />
                <a onClick={this.handleSortMove.bind(null, record.id, 'down')} style={{ display: priceGrades.findIndex(n => n.id == record.id) == priceGrades.length - 1 ? 'none' : 'inline-block' }}>下移</a>
              </div>
            ) : (
              <div>
                <a onClick={this.handlePriceGradeModalModalEdit.bind(null, record)}>编辑</a>
                { record.default != '1' ? <Divider type="vertical" /> : null }
                { record.default != '1' ? <Popconfirm onConfirm={this.handlePriceGradeDeleteSingle.bind(null, record)} title="确认删除此价格等级"><a >删除</a></Popconfirm> : null }
              </div>
            )
          }
        </div>
      ),
    }];

    const priceQuantityStepColumns = [{
      title: '价格阶梯',
      dataIndex: 'name',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 122,
      render: (text, record) => (
        <div>
          <Popconfirm onConfirm={this.handlePriceQuantityStepDeleteSingle.bind(null, record)} title="确认删除此价格阶梯"><a >删除</a></Popconfirm>
        </div>
      ),
    }];

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)} tabList={tabList} activeTabKey={activeTabKey} onTabChange={this.handleTabChange}>
        <div style={{ display: activeTabKey == 'priceGrade' ? 'block' : 'none' }}>
          <Card bordered={false} title="价格等级列表" extra={priceGradeAction}>
            <Table dataSource={priceGrades} columns={priceGradeColumns} rowKey="id" pagination={false} />
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'priceComposition' ? 'block' : 'none' }}>
          <Card bordered={false} className={styles.cardBottom}>
            <div>
              <span className={styles.spanTitle}>按店铺区分价格</span><Switch onClick={this.handlePriceCompositionConfirm.bind(null, 0)} checked={priceModel == 'shop'} className={styles.switchPosition} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
            </div>
          </Card>
          <Card bordered={false} className={styles.cardBottom}>
            <div>
              <span className={styles.spanTitle}>按单位区分价格</span><Switch onClick={this.handlePriceCompositionConfirm.bind(null, 1)} checked={priceModel == 'unit'} className={styles.switchPosition} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
            </div>
          </Card>
          <Card bordered={false} >
            <div style={{ marginBottom: 32 }}>
              <span className={styles.spanTitle}>按购买量区分价格</span>
              <span className={styles.switchPosition}><Button type="primary" style={{ marginRight: 24 }} onClick={this.handlePriceQuantityStepModalCreate}>新建价格阶梯</Button><Switch onClick={this.handlePriceCompositionConfirm.bind(null, 2)} checked={priceModel == 'quantityrange'} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} /></span>
            </div>
            <Table dataSource={priceQuantitySteps} columns={priceQuantityStepColumns} rowKey="id" pagination={false} />
          </Card>
        </div>
        <PriceGradeModal type={priceGradeModalType} visible={priceGradeModalVisibel} formValue={priceGradeModalFormValue} onOk={this.handlePriceGradeModalModalOk} onCancel={this.handlePriceGradeModalModalCancel} sortLength={priceGrades.length} />
        <PriceQuantityStepModal visible={priceQuantityStepModalVisibel} onOk={this.handlePriceQuantityStepModalOk} onCancel={this.handlePriceQuantityStepModalCancel} />
      </PageHeaderLayout>
    );
  }
}
