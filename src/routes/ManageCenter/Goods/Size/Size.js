import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, message, Table, Icon, Popconfirm, Divider, Popover } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import SizeLibraryModal from './SizeLibraryModal';
import breadCrumbList from '../../../../common/breadCrumbList';
import SizeGroupModal from './SizeGroupModal';
import styles from './Size.less';

const tabList = [{
  key: 'sizeLibrary',
  tab: '尺码库',
}, {
  key: 'sizeGroup',
  tab: '尺码组',
}];
@connect(state => ({
  size: state.size,
}))
export default class Size extends PureComponent {
  state = {
    activeTabKey: 'sizeLibrary', 
    sizeLibraryModalVisibel: false,
    sizeLibraryModalType: '',
    sizeLibraryModalFormValue: {},
    sizeGroupModalVisibel: false,
    sizeGroupModalType: '',
    sizeGroupModalFormValue: {},
    isSort: false,
  }

  componentDidMount() {
    this.props.dispatch({ type: 'size/getList' });
  }

  // 尺码库model新建
  handleSizeLibraryModalCreate = () => {
    this.setState({
      sizeLibraryModalVisibel: true,
      sizeLibraryModalType: 'create',
      sizeLibraryModalFormValue: {},
    });
  }

  // 尺码库model取消
  handleSizeLibraryModalCancel = () => {
    this.setState({
      sizeLibraryModalVisibel: false,
    });
  }

  // 尺码库model编辑
  handleSizeLibraryModalEdit = (item) => {
    this.setState({
      sizeLibraryModalVisibel: true,
      sizeLibraryModalType: 'edit',
      sizeLibraryModalFormValue: item,
    });
  }

  // 尺码库model完成
  handleSizeLibraryModalOk = (value) => {
    this.setState({
      sizeLibraryModalVisibel: false,
    });
    this.props.dispatch({type: `size/${this.state.sizeLibraryModalType === 'create' ? 'createSizeLibrarySingle' : 'editSizeLibrarySingle'}` ,payload: value}).then( result => {
      if (result.code != 0) {
        message.error(`${result.message}`);
      } else {
        this.props.dispatch({ type: 'size/getSizeLibrary' });
      }
    })
  }

  // 尺码库删除
  handleSizeLibraryDeleteSingle = (item) => {
    this.props.dispatch({ type: 'size/deleteSizeLibrarySingle',
      payload: {
        id: item.id,
      } }).then((result) => {
      if (result.code != 0) {
        message.error(result.message);
      } else {
        this.props.dispatch({ type: 'size/getSizeLibrary' });
      }
    });
  }

  // 尺码组modal新建
  handleSizeGroupModalCreate = () => {
    this.setState({
      sizeGroupModalVisibel: true,
      sizeGroupModalType: 'create',
      sizeGroupModalFormValue: {},
    });
  }

  // 尺码组modal新建
  handleSizeGroupModalEdit = (item) => {
    this.setState({
      sizeGroupModalVisibel: true,
      sizeGroupModalType: 'edit',
      sizeGroupModalFormValue: item,
    });
  }

  // 尺码组modal取消
  handleSizeGroupModalCancel = () => {
    this.setState({
      sizeGroupModalVisibel: false,
    });
  }

  // 尺码组modal完成
  handleSizeGroupModalOk = (value) => {
    this.setState({
      sizeGroupModalVisibel: false,
    });
    this.props.dispatch({ type: `size/${this.state.sizeGroupModalType == 'create' ? 'createSizeGroupSingle' : 'editSizeGroupSingle'}`, payload: value }).then((result) => {
      if (result.code != 0) {
        message.error(`${result.message}`);
      } else {
        this.props.dispatch({ type: 'size/getSizeGroup' });
      }
    });
  }

  // 尺码组删除
  handleSizeGroupDeleteSingle = (item) => {
    this.props.dispatch({ type: 'size/deleteSizeGroupSingle',
      payload: {
        id: item.id,
      } }).then(() => {
      this.props.dispatch({ type: 'size/getSizeGroup' });
    });
  }

  // 切换尺码组 尺码库
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
    this.props.dispatch({ type: 'size/getSizeLibrary' });
  }

  handleSortMove = (id, moveWay) => {
    this.props.dispatch({ type: 'size/setSortMove',
      payload: {
        currentId: id,
        moveWay,
      } });
  }

  handleSortOk = () => {
    this.props.dispatch({ type: 'size/editSort', payload: this.props.size.sizeLibrarys }).then(() => {
      this.handleSortCancel();
    });
  }

  render() {
    const { sizeLibrarys, sizeGroups } = this.props.size;
    const { sizeLibraryModalVisibel, sizeLibraryModalType, sizeLibraryModalFormValue, sizeGroupModalVisibel, sizeGroupModalType, sizeGroupModalFormValue, activeTabKey, isSort } = this.state;

    const sizeLibraryAction = (
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
              <Button type="primary" onClick={this.handleSizeLibraryModalCreate}>新建尺码库</Button>
            </div>
          )
        }
      </div>
    );

    const sizeGroupAction = (
      <div>
        <Button type="primary" onClick={this.handleSizeGroupModalCreate}>新建尺码组</Button>
      </div>
    );

    const sizeLibraryColumns = [{
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
                <a onClick={this.handleSortMove.bind(null, record.id, 'up')} style={{ display: sizeLibrarys.findIndex(n => n.id == record.id) == 0 ? 'none' : 'inline-block' }}>上移</a>
                <Divider type="vertical" style={{ display: (sizeLibrarys.findIndex(n => n.id == record.id) == 0 || sizeLibrarys.findIndex(n => n.id == record.id) == sizeLibrarys.length - 1) ? 'none' : 'inline-block' }} />
                <a onClick={this.handleSortMove.bind(null, record.id, 'down')} style={{ display: sizeLibrarys.findIndex(n => n.id == record.id) == sizeLibrarys.length - 1 ? 'none' : 'inline-block' }}>下移</a>
              </div>
            ) : (
              <div>
                <a onClick={this.handleSizeLibraryModalEdit.bind(null, record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm onConfirm={this.handleSizeLibraryDeleteSingle.bind(null, record)} title="确认删除此尺码"><a >删除</a></Popconfirm>
              </div>
            )
          }
        </div>
      ),
    }];

    const sizeGroupColumns = [{
      title: '名称',
      dataIndex: 'name',
      width: '15%',
    }, {
      title: '包含的尺码',
      dataIndex: 'includeSize',
      render: (text, record) => (
        <Popover content={`${record.skuattributes.data.map(n => n.name).join('、')}`} title="包含的尺码">
          {`${record.skuattributes.data.map(n => n.name).join('、')}`}
        </Popover>
      ),
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 172,
      render: (text, record) => (
        <div>
          <a onClick={this.handleSizeGroupModalEdit.bind(null, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm onConfirm={this.handleSizeGroupDeleteSingle.bind(null, record)} title="确认删除此尺码组"><a >删除</a></Popconfirm>
        </div>
      ),
    }];

    return (
      <PageHeaderLayout breadcrumbList={breadCrumbList(this.props.history.location.pathname)} tabList={tabList} activeTabKey={activeTabKey} onTabChange={this.handleTabChange}>
        <div style={{ display: activeTabKey == 'sizeLibrary' ? 'block' : 'none' }}>
          <Card bordered={false} title="尺码库列表" extra={sizeLibraryAction}  >
            <Table dataSource={sizeLibrarys} columns={sizeLibraryColumns} rowKey="id" pagination={false} />
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'sizeGroup' ? 'block' : 'none' }}>
          <Card bordered={false} title="尺码组列表" extra={sizeGroupAction} className={styles.cardStyle}>
            <Table dataSource={sizeGroups} columns={sizeGroupColumns} rowKey="id" pagination={false} />
          </Card>
        </div>
        <SizeLibraryModal type={sizeLibraryModalType} visible={sizeLibraryModalVisibel} formValue={sizeLibraryModalFormValue} onOk={this.handleSizeLibraryModalOk} onCancel={this.handleSizeLibraryModalCancel} sortLength={sizeLibrarys.length} />
        <SizeGroupModal type={sizeGroupModalType} visible={sizeGroupModalVisibel} formValue={sizeGroupModalFormValue} onOk={this.handleSizeGroupModalOk} onCancel={this.handleSizeGroupModalCancel} optionSize={sizeLibrarys} />
      </PageHeaderLayout>
    );
  }
}
