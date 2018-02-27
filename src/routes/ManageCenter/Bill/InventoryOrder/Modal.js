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
export default class InventoryModal extends PureComponent {

  handleModalClose = ()=>{
   this.props.form.resetFields()
  }

  handleConfirm = () => {
    const {validateFields,getFieldsValue} = this.props.form;
    const {onOk,formValue,approvers} = this.props;
    validateFields((err,value) =>{
      let current = {
        user_name: value.user_id && approvers.find( n => n.id == value.user_id).name 
      } 
      if(!err){
        onOk && onOk( {
          ...formValue,
          ...value,
          ...current
        })
      }
    })
  }

  render() {
    const {visible,formValue,onOk,onCancel,approvers } = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal
        title={`${formValue.warehouse_name}盘点单审批`}
        visible={visible}
        onOk={this.handleConfirm}
        onCancel={onCancel}
        afterClose={this.handleModalClose}
        >
        <Form layout='horizontal'>
          <FormItem label='审批人' {...formItemLayout}>
            {getFieldDecorator('user_id',{
              initialValue:formValue.user_id
            })(
              <Select placeholder='请选择'>
                {
                  approvers.map( n => {
                    return <Option key={n.id} value={n.id}>{n.name}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
