import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import { Row, Col, Button, Input,Form,Modal,Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {span:4},
  wrapperCol: {span:10}
};
@Form.create()
export default class CustomerMemberModal extends PureComponent {

  handleModalClose = ()=>{
   this.props.form.resetFields()
  }

  handleConfirm = () => {
    const {validateFields,getFieldsValue} = this.props.form;
    const {onOk,formValue,type,sortLength} = this.props;
    validateFields((err,value) =>{
      if(!err){
        onOk && onOk( {
          ...value,
          ...{create:{sort:sortLength}}[type],
          ...{edit:{id:formValue.id}}[type]
        })
      }
    })
  }

  render() {
    const {visible,type,formValue,onOk,onCancel,priceGrades } = this.props;
    const {getFieldDecorator} = this.props.form;
    const pricelevel_id = formValue.pricelevel && formValue.pricelevel.data.id
    const discount = formValue.discount && Number(formValue.discount).toFixed(2)
    return (
      <Modal
        title={type == 'create' ? '新建客户' : '编辑客户'}
        visible={visible}
        onOk={this.handleConfirm}
        onCancel={onCancel}
        afterClose={this.handleModalClose}
        >
        <Form layout='horizontal'>
          <FormItem label='名称' {...formItemLayout}>
            {getFieldDecorator('name',{
              initialValue:formValue.name,
              rules: [{required:true,message:'名称不能为空'}],
            })(
              <Input placeholder='请输入' />
            )}
          </FormItem>
          <FormItem label='价格等级' {...formItemLayout}>
            {getFieldDecorator('pricelevel_id',{
              initialValue: pricelevel_id
            })(
              <Select placeholder='请选择'>
                {
                  priceGrades.map( n => {
                    return <Option key={n.id} value={n.id}>{n.name}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem label='赊账额度' {...formItemLayout}>
            {getFieldDecorator('debt',{
              initialValue:formValue.debt,
            })(
              <Input placeholder='请输入' />
            )}
          </FormItem>
          <FormItem label='价格调整' {...formItemLayout}>
            {getFieldDecorator('discount',{
              initialValue: discount
            })(
              <Input placeholder='请输入' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
