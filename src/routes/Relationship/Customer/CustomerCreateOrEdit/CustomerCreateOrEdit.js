import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { Row, Col, Card, Button, Input, Table,Icon,Select,Menu,Dropdown,Popconfirm,Divider,Form,InputNumber,Spin,Radio} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../../components/antd-pro/FooterToolbar';
import TagSelect from '../../../../components/antd-pro/TagSelect';
import SelectInput from '../../../../components/SelectInput/SelectInput';
import SelectMultiple from '../../../../components/SelectMultiple/SelectMultiple'
import CustomerPictureModal from '../../../../components/RelationPictureModal/RelationPictureModal'
import CustomerModal from './CustomerModal'
import styles from './CustomerCreateOrEdit.less'
const ButtonGroup = Button.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const breadcrumbList = [{
  title:'关系'
},{
  title:'客户'
}]
@Form.create()
@connect(state => ({
  customerCreateOrEdit: state.customerCreateOrEdit,
  staff: state.staff,
  customerMember: state.customerMember,
  customerGroup: state.customerGroup,
  country: state.country
}))
export default class CustomerCreateOrEdit extends PureComponent {

  state = {
    modalVisibel: false,
    modalType: '',
    formValue: {},
    addresses:[],
    uid:1,
  }

  componentDidMount() {
    (async () => {
      this.props.dispatch({type:'customerCreateOrEdit/setState',payload:{
        showData:{}
      }})
      const match = pathToRegexp('/relationship/customer-edit/:id').exec(this.props.history.location.pathname)
      if(match) {
        this.props.dispatch({type:'customerCreateOrEdit/getSingle',payload:{id:match[1]}})
      }
    })().then(()=>{
      this.props.dispatch({type:'staff/getList'})
      this.props.dispatch({type:'customerMember/getList'})
      this.props.dispatch({type:'customerGroup/getList'})
    })
  }

  componentWillReceiveProps(nextProps) {
    if(!this.state.addresses.length && nextProps.customerCreateOrEdit.showData.addresses) {
      this.setState({
        addresses: JSON.parse(JSON.stringify(nextProps.customerCreateOrEdit.showData.addresses))|| []
      })  
    }
  }

  handleModalCreate = () => {
    this.setState({
      modalVisibel: true,
      modalType: 'create',
      formValue: {},
    })
  }

  handleModalCancel = () => {
    this.setState({
      modalVisibel: false
    })
  }

  handleModalEdit = (item) => {
    this.setState({
      modalVisibel: true,
      modalType: 'edit',
      formValue: item
    })
  }

  handleModalOk = (value) => {
    let addresses = this.state.addresses;
    if(addresses.some( item => item.uid == value.uid)) {
      addresses[addresses.findIndex( item => item.uid == value.uid)] = value
      this.setState({
        addresses:[...addresses],
        modalVisibel:false
      })
    }else {
      let uid = ++ this.state.uid ;
      addresses.push(value)
      this.setState({
        addresses: [...addresses],
        modalVisibel: false,
        uid: uid
      })
    }
    this.props.form.getFieldDecorator('addresses', { initialValue: addresses });
  }

  handleRadioSelect = (uid,e) => {
    let addresses = this.state.addresses;
    addresses.forEach( item => {
      item.default = 0
    })
    addresses[addresses.findIndex( item => item .uid == uid)].default =  1
    this.setState({
      addresses: [...addresses]
    })
    this.props.form.getFieldDecorator('addresses', { initialValue: addresses });
  }

  handleDeleteAddress = (item) => {
    let addresses = this.state.addresses;
    if(addresses.find( n => n.uid == item.uid).default == 1) {
      addresses[0].default = 1
    }
    addresses.splice(addresses.findIndex(n => n.uid == item.uid),1)
    if(addresses.length == 1) {
      addresses[0].default = 1
    }
    this.setState({addresses:[...addresses]})
    this.props.form.getFieldDecorator('addresses', { initialValue: addresses });
  }

  handleSubmit = (e) => {
    const {validateFields,setFieldsValue,getFieldDecorator,getFieldsValue} = this.props.form
    e.preventDefault();
    if(!getFieldsValue().addresses) getFieldDecorator('addresses',{initialValue:this.state.addresses})
    validateFields((err,value) =>{
      if(!err){
        this.props.dispatch({type:'customerCreateOrEdit/setServerData',payload:value})
        if(this.props.customerCreateOrEdit.showData.id) {
          this.props.dispatch({type:'customerCreateOrEdit/editSingle',payload:{
            serverData:this.props.customerCreateOrEdit.serverData,
            id:this.props.customerCreateOrEdit.showData.id,
            imageFile:this.props.customerCreateOrEdit.imageFile
          }}).then(()=>{
            this.props.dispatch(routerRedux.push('/relationship/customer-list'))
          })
        }else {
          this.props.dispatch({type:'customerCreateOrEdit/createSingle',payload:{
            serverData:this.props.customerCreateOrEdit.serverData,
            imageFile:this.props.customerCreateOrEdit.imageFile
          }}).then(()=>{
            this.props.dispatch(routerRedux.push('/relationship/customer-list'))
          })
        }
      }
    })
  }

  handleCustomerCancel = () => {
    this.props.dispatch(routerRedux.push('/relationship/customer-list'))
  }

  render() {
    const {modalVisibel,formValue,addresses,modalType,uid} = this.state;
    const {getFieldDecorator,getFieldValue} = this.props.form;
    const {showData} = this.props.customerCreateOrEdit;
    const {staffs} = this.props.staff;
    const {customerMembers} = this.props.customerMember;
    const {customerGroups} = this.props.customerGroup;
    const {country} = this.props.country;
    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        title={showData.id ? '编辑客户' : '新建客户'}
        >
        <Card bordered={false} title='基本资料' className={styles.bottomCardDivided}>
          <Form layout='vertical'>
            <Row gutter={64}>
              <Col span={8}>
                <FormItem label='名称' hasFeedback>
                  {getFieldDecorator('name',{
                    initialValue: showData.name || '',
                    rules: [{required:true,message:'名称不能为空'}],
                  })(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label='手机号'>
                  {getFieldDecorator('phone',{
                    initialValue: showData.phone || ''
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label='微信号'>
                  {getFieldDecorator('wechat',{
                    initialValue: showData.wechat || ''
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
              </Col>*/}
              <Col span={8}>
                <FormItem label='专属导购'>
                  {getFieldDecorator('seller_id',{
                    initialValue: showData.seller_id || undefined
                  })(
                    <Select placeholder='请选择'>
                      {
                        staffs.map( item => {
                          return <Option key={item.id}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label='客户等级'>
                  {getFieldDecorator('vip_id',{
                    initialValue: showData.vip_id || undefined
                  })(
                    <Select placeholder='请选择'>
                      {
                        customerMembers.map( item => {
                          return <Option key={item.id}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label='备注'>
                  {getFieldDecorator('remark1',{
                    initialValue: showData.remark1 
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={64}>
              {
                customerGroups.map( item => {
                  return (
                    <Col span={8} key={item.id}>
                      <FormItem label={`${item.name}`}>
                        {getFieldDecorator(`customerGroup_${item.id}`,{
                          initialValue: (showData.customerGroup || {})[`${item.id}`] || undefined
                        })(
                          <Select placeholder='请选择客户分组'>
                            {
                              item.children && item.children.map( subItem => {
                                return (
                                  <Option key={subItem.id}>{subItem.name}</Option>
                                )
                              })
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  )
                })
              }
{/*                <Col span={8}>
                <FormItem label='备注'>
                  {getFieldDecorator('remark1',{
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>*/}
            </Row>
          </Form>
        </Card>
        <Card bordered={false} title='附件' className={styles.bottomCardDivided}>
          <Form layout='horizontal'>
            <FormItem>
              {getFieldDecorator('filelist',{
                 initialValue: (showData.imageFile && showData.imageFile.length == 0 ? null : showData.imageFile)
              })(
                <CustomerPictureModal />
              )}
            </FormItem>
          </Form>
        </Card>
        <Card bordered={false} title='地址'>
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
            !!addresses.length && addresses.map( (item,index) => {
              return (
                <div key={item.uid}>
                  { index > 0 ?  <Divider style={{ marginBottom: 32 }} />  : null}
                  <Row>
                    <Col span={5}>
                      <label className={styles.labelTitle}>收货人：</label><span>{item.name}</span>
                    </Col>
                    <Col span={6}>
                      <label className={styles.labelTitle}>手机号：</label><span>{item.phone}</span>
                    </Col>
                    <Col span={13}>
                      <label className={styles.labelTitle}>收货地址：</label><span>{item.address}</span>
                    </Col>
                  </Row>
                  <div style={{marginTop:24}}>
                    <Radio checked={item.default == 1} onChange={this.handleRadioSelect.bind(null,item.uid)}>默认地址</Radio> 
                    <ButtonGroup style={{float:'right',marginTop:-11}}>
                      <Button onClick={this.handleModalEdit.bind(null,item)}>编辑</Button>
                      <Button onClick={this.handleDeleteAddress.bind(null,item)}>删除</Button>
                    </ButtonGroup>
                  </div>
                </div>
              )
            })
          }
        </Card>
        <CustomerModal type={modalType} visible={modalVisibel} formValue={formValue} onOk={this.handleModalOk} onCancel={this.handleModalCancel} country={country} uid={uid} addresses={addresses}/>
        <FooterToolbar>
          <div id="noScroll">
            <Popconfirm getPopupContainer={() => document.getElementById('noScroll')} title={ showData.id ? '确认取消编辑客户?':'确认取消新建客户?'} onConfirm={this.handleCustomerCancel} placement='top'><Button>取消</Button></Popconfirm>
            <Button type="primary" onClick={this.handleSubmit}>
              确认
            </Button>
            </div>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
