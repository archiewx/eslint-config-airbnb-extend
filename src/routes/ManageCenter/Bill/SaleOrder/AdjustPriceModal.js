import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Button, Input, Form, Modal, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};
@Form.create()
export default class AdjustPriceModal extends PureComponent {
  handleModalClose = () => {
    this.props.form.resetFields();
  }

  handleConfirm = () => {
    const { validateFields, getFieldsValue } = this.props.form;
    const { onOk, formValue, sortLength, type } = this.props;
    validateFields((err, value) => {
      if (!err) {
        onOk && onOk({
          ...value,
          ...{ create: { sort: sortLength } }[type],
          ...{ edit: { id: formValue.id } }[type],
        });
      }
    });
  }

  render() {
    const { visible, type, formValue, onOk, onCancel } = this.props;
    const { getFieldDecorator } = this.props.form;
    let adjustPrice;
    formValue.value == 1 ? adjustPrice = '3' : (
      formValue.percent == 1 ? (
        formValue.percent_method == 1 ? adjustPrice = '1' : adjustPrice = '2'
      ) : ''
    );
    return (
      <Modal
        title={type == 'create' ? '新建调价方式' : '编辑调价方式'}
        visible={visible}
        onOk={this.handleConfirm}
        onCancel={onCancel}
        afterClose={this.handleModalClose}
      >
        <Form layout="horizontal">
          <FormItem label="名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: formValue.name,
              rules: [{ required: true, message: '名称不能为空' }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="调价" {...formItemLayout}>
            {getFieldDecorator('adjustPrice', {
              initialValue: adjustPrice,
              rules: [{ required: true, message: '调价不能为空' }],
            })(
              <Select placeholder="请选择">
                <Option key="1">折</Option>
                <Option key="2">百分比</Option>
                <Option key="3">减价</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
