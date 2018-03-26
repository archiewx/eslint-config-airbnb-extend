import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Button, Input, Form, Modal, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
@Form.create()
export default class SizeLibraryModal extends PureComponent {
  handleModalClose = () => {
    this.props.form.resetFields();
  }

  handleConfirm = () => {
    const { validateFields, getFieldsValue } = this.props.form;
    const { onOk, formValue, type, sortLength } = this.props;
    validateFields((err, value) => {
      const skuattributes = value.skuattributes && value.skuattributes.map((n) => { return { id: n }; });
      if (!err) {
        onOk && onOk({
          ...value,
          ...{ skuattributetype_id: '2' },
          ...{ edit: { id: formValue.id } }[type],
          ...{ skuattributes },
        });
      }
    });
  }

  render() {
    const { visible, type, formValue, onOk, onCancel, optionSize } = this.props;
    const { getFieldDecorator } = this.props.form;
    const selected = formValue.skuattributes && formValue.skuattributes.data.map(n => n.id) || [];
    return (
      <Modal
        title={type == 'create' ? '新建尺码组' : '编辑尺码组'}
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
          <FormItem label="尺码" {...formItemLayout}>
            {getFieldDecorator('skuattributes', {
              initialValue: selected,
            })(
              <Select mode="multiple">
                {
                  optionSize.map((n) => {
                    return <Option key={n.id} value={n.id}>{n.name}</Option>;
                  })
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
