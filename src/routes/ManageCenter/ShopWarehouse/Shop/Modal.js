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
export default class ShopModal extends PureComponent {

  handleModalClose = ()=>{
   this.props.form.resetFields()
  }

  handleConfirm = () => {
    const {validateFields,getFieldsValue} = this.props.form;
    const {onOk,formValue} = this.props;
    validateFields((err,value) =>{
      if(!err){
        onOk && onOk( {
          ...value,
          ...{id:formValue.id}
        })
      }
    })
  }

  render() {
    const {visible,formValue,onOk,onCancel,goodsGroups,warehouses } = this.props;
    const {getFieldDecorator} = this.props.form;
    const groupIds = {};
    formValue.itemgroups && formValue.itemgroups.forEach( n => {
      groupIds[`${n.id}`] = [];
      n.children.forEach( m => {
        groupIds[`${n.id}`].push(m.id)
      })
    })
    return (
      <Modal
        title='编辑店铺'
        visible={visible}
        onOk={this.handleConfirm}
        onCancel={onCancel}
        afterClose={this.handleModalClose}
        >
        <Form layout='horizontal'>
          <FormItem label='仓库' {...formItemLayout}>
            {getFieldDecorator('warehouse_id',{
              initialValue:formValue.warehouses && formValue.warehouses.data[0].id,
            })(
              <Select placeholder='请选择'>
                {warehouses.map( n => {
                  return <Option key={n.id} value={n.id}>{n.name}</Option>
                })}
              </Select>
            )}
          </FormItem>
          {
            goodsGroups.map( n => {
              return (
                <FormItem key={n.id} label={n.name} {...formItemLayout}>
                  {getFieldDecorator(`group_${n.id}`,{
                    initialValue: groupIds[`${n.id}`]
                  })(
                    <Select placeholder='请选择' mode='multiple'>
                      {
                        n.children.map( m => {
                          return <Option key={m.uid} value={m.uid}>{m.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              )
            })
          }
        </Form>
      </Modal>
    )
  }
}
