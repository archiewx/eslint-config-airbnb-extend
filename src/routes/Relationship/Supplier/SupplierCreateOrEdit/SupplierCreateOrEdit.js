import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Button, Input, Table, Icon, Select, Menu, Dropdown, Popconfirm, Divider, Form, InputNumber, Spin, Radio } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../../components/antd-pro/FooterToolbar';
import TagSelect from '../../../../components/antd-pro/TagSelect';
import SelectInput from '../../../../components/SelectInput/SelectInput';
import SelectMultiple from '../../../../components/SelectMultiple/SelectMultiple';
import SupplierPictureModal from '../../../../components/RelationPictureModal/RelationPictureModal';
import SupplierModal from './SupplierModal';
import styles from './SupplierCreateOrEdit.less';

const ButtonGroup = Button.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const breadcrumbList = [{
  title: '关系',
}, {
  title: '供应商',
}];
@Form.create()
@connect(state => ({
  supplierCreateOrEdit: state.supplierCreateOrEdit,
  country: state.country,
}))
export default class SupplierCreateOrEdit extends PureComponent {
  state = {
    modalVisibel: false,
    modalType: '',
    formValue: {},
    addresses: [],
    uid: 1,
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.addresses.length && nextProps.supplierCreateOrEdit.showData.addresses) {
      this.setState({
        addresses: JSON.parse(JSON.stringify(nextProps.supplierCreateOrEdit.showData.addresses)) || [],
      });
    }
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
    const addresses = this.state.addresses;
    if (addresses.some(item => item.uid == value.uid)) {
      const detail = JSON.parse(localStorage.getItem('country')).map( n => {
        if(n.value == value.location[0]) {
          return `${n.label}${n.children.find( m => m.value == value.location[1]).label}`
        }
      }).filter( _ => _)[0]
      value.detailCity = detail
      addresses[addresses.findIndex(item => item.uid == value.uid)] = value;
      this.setState({
        addresses: [...addresses],
        modalVisibel: false,
      });
    } else {
      const uid = ++this.state.uid;
      const detail = JSON.parse(localStorage.getItem('country')).map( n => {
        if(n.value == value.location[0]) {
          return `${n.label}${n.children.find( m => m.value == value.location[1]).label}`
        }
      }).filter( _ => _)[0]
      value.detailCity = detail
      addresses.push(value);
      this.setState({
        addresses: [...addresses],
        modalVisibel: false,
        uid,
      });
    }
    this.props.form.getFieldDecorator('addresses', { initialValue: addresses });
  }

  handleRadioSelect = (uid, e) => {
    const addresses = this.state.addresses;
    addresses.forEach((item) => {
      item.default = 0;
    });
    addresses[addresses.findIndex(item => item.uid == uid)].default = 1;
    this.setState({
      addresses: [...addresses],
    });
    this.props.form.getFieldDecorator('addresses', { initialValue: addresses });
  }

  handleDeleteAddress = (item) => {
    const addresses = this.state.addresses;
    if (addresses.find(n => n.uid == item.uid).default == 1) {
      addresses[0].default = 1;
    }
    addresses.splice(addresses.findIndex(n => n.uid == item.uid), 1);
    if (addresses.length == 1) {
      addresses[0].default = 1;
    }
    this.setState({ addresses: [...addresses] });
    this.props.form.getFieldDecorator('addresses', { initialValue: addresses });
  }

  handleSubmit = (e) => {
    const { validateFields, getFieldDecorator, getFieldsValue } = this.props.form;
    e.preventDefault();
    if (!getFieldsValue().addresses) getFieldDecorator('addresses', { initialValue: this.state.addresses });
    validateFields((err, value) => {
      if (!err) {
        if (this.props.supplierCreateOrEdit.showData.id) {
          this.props.dispatch({ type: 'supplierCreateOrEdit/setServerData', payload: value });
          this.props.dispatch({ type: 'supplierCreateOrEdit/editSingle',
            payload: {
              serverData: this.props.supplierCreateOrEdit.serverData,
              imageFile: this.props.supplierCreateOrEdit.imageFile,
              id: this.props.supplierCreateOrEdit.showData.id,
            } }).then(() => {
            this.props.dispatch(routerRedux.push('/relationship/supplier-list'));
          });
        } else {
          this.props.dispatch({ type: 'supplierCreateOrEdit/setServerData', payload: value });
          this.props.dispatch({ type: 'supplierCreateOrEdit/createSingle',
            payload: {
              serverData: this.props.supplierCreateOrEdit.serverData,
              imageFile: this.props.supplierCreateOrEdit.imageFile,
            } }).then(() => {
            this.props.dispatch(routerRedux.push('/relationship/supplier-list'));
          });
        }
      }
    });
  }

  handleSupplierCancel = () => {
    this.props.dispatch(routerRedux.push('/relationship/supplier-list'));
  }

  render() {
    const { modalVisibel, formValue, addresses, modalType, uid } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { showData } = this.props.supplierCreateOrEdit;
    const { country } = this.props.country;

    const menu = (
      <Menu>
        <Menu.Item key="1">删除</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout
        title={showData.id ? '编辑供应商' : '新建供应商'}
        breadcrumbList={breadcrumbList}
      >
        <Spin size="large" spinning={false}>
          <Card bordered={false} title="基本资料" className={styles.bottomCardDivided}>
            <Form layout="vertical">
              <Row gutter={64}>
                <Col span={8}>
                  <FormItem label="名称" hasFeedback>
                    {getFieldDecorator('name', {
                      initialValue: showData.name || '',
                      rules: [{ required: true, message: '名称不能为空' }],
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="手机号">
                    {getFieldDecorator('phone', {
                      initialValue: showData.phone || '',
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="微信号">
                    {getFieldDecorator('wechat', {
                      initialValue: showData.wechat || '',
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={64}>
                {/*                <Col span={8}>
                  <Row>
                    <FormItem label='初始金额'>
                      {getFieldDecorator('select',{

                      })(
                        <SelectInput />
                      )}
                    </FormItem>
                  </Row>
                </Col> */}
                <Col span={8}>
                  <FormItem label="备注">
                    {getFieldDecorator('remark1', {
                      initialValue: showData.remark1,
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card bordered={false} title="附件" className={styles.bottomCardDivided}>
            <Form layout="horizontal">
              <FormItem>
                {getFieldDecorator('filelist', {
                  initialValue: (showData.imageFile && showData.imageFile.length == 0 ? null : showData.imageFile),
                })(
                  <SupplierPictureModal />
                )}
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false} title="地址">
            <Button
              style={{ width: '100%' }}
              type="dashed"
              icon="plus"
              onClick={this.handleModalCreate}
            >
            新增地址
            </Button>
          </Card>
          <Card bordered={false}>
            {
              !!addresses.length && addresses.map((item, index) => {
                return (
                  <div key={item.uid}>
                    { index > 0 ? <Divider style={{ marginBottom: 32 }} /> : null}
                    <Row>
                      <Col span={5}>
                        <label className={styles.labelTitle}>收货人：</label><span>{item.name}</span>
                      </Col>
                      <Col span={6}>
                        <label className={styles.labelTitle}>手机号：</label><span>{item.phone}</span>
                      </Col>
                      <Col span={13}>
                        <label className={styles.labelTitle}>收货地址：</label><span>{item.detailCity}{item.address}</span>
                      </Col>
                    </Row>
                    <div style={{ marginTop: 24 }}>
                      <Radio checked={item.default == 1} onChange={this.handleRadioSelect.bind(null, item.uid)}>默认地址</Radio>
                      <ButtonGroup style={{ float: 'right', marginTop: -11 }}>
                        <Button onClick={this.handleModalEdit.bind(null, item)}>编辑</Button>
                        <Button onClick={this.handleDeleteAddress.bind(null, item)}>删除</Button>
                      </ButtonGroup>
                    </div>
                  </div>
                );
              })
            }
          </Card>
          <SupplierModal type={modalType} visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel} country={country} uid={uid} addresses={addresses} />
          <FooterToolbar>
            <div id="noScroll">
              <Popconfirm getPopupContainer={() => document.getElementById('noScroll')} title={showData.id ? '确认取消编辑供应商?' : '确认取消新建供应商?'} onConfirm={this.handleSupplierCancel}><Button>取消</Button></Popconfirm>
              <Button type="primary" onClick={this.handleSubmit}>
                确认
              </Button>
            </div>
          </FooterToolbar>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
