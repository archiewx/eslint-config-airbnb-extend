import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Button, Input ,Icon,Select,Form,Modal,Cascader} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input
const formItemLayout = {
  labelCol: {span:4},
  wrapperCol: {span:10}
};
const specialFormItemLayout = {
  labelCol: {span:4},
  wrapperCol: {span:16}
};
@Form.create()
export default class CustomerModal extends PureComponent {

  handleModalClose = ()=>{
   this.props.form.resetFields()
  }

  handleConfirm = () => {
    const {validateFields,getFieldsValue} = this.props.form;
    const {onOk,uid,country,addresses,formValue,type} = this.props;
    validateFields((err,value) =>{
      if(!err){
        onOk && onOk( {
          ...value,
          ...{create:{uid:uid},edit:{uid:formValue.uid}}[type],
          ...{create:{default:addresses.length == 0 ? 1 : 0},edit: {default:formValue.default}}[type],
          ...{edit:{sid:formValue.sid}}[type]
        })
      }
    })
  }

  render() {
    const {visible,type,formValue,onOk,onCancel,country } = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal
        title={type == 'create' ? '新建地址' : '编辑地址'}
        visible={visible}
        onOk={this.handleConfirm}
        onCancel={onCancel}
        afterClose={this.handleModalClose}
        >
        <Form layout='horizontal'>
          <FormItem label='收货人' {...formItemLayout}>
            {getFieldDecorator('name',{
              initialValue:formValue.name,
              rules: [{required:true,message:'收货人不能为空'}],
            })(
              <Input placeholder='请输入' />
            )}
          </FormItem>
          <FormItem label='手机号' {...formItemLayout}>
            {getFieldDecorator('phone',{
              initialValue:formValue.phone,
            })(
              <Input placeholder='请输入' />
            )}
          </FormItem>
          <FormItem label='所在地区' {...formItemLayout}>
            {getFieldDecorator('location',{
              initialValue:formValue.location,
            })(
              <Cascader options={country} placeholder='请选择' />
            )}
          </FormItem>
          <FormItem label='收货地址' {...specialFormItemLayout}>
            {getFieldDecorator('address',{
              initialValue:formValue.address,
            })(
              <TextArea placeholder='请输入' rows={4}/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
