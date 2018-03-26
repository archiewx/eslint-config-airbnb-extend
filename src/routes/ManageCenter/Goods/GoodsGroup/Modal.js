import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Button, Input, Form, Modal } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};
@Form.create()
export default class GoodsGroupModal extends PureComponent {
  handleModalClose = () => {
    this.props.form.resetFields();
  }

  handleConfirm = () => {
    const { validateFields, getFieldsValue } = this.props.form;
    const { onOk, formValue, type, sortGroupLength, parentItem } = this.props;
    validateFields((err, value) => {
      if (!err) {
        onOk && onOk({
          ...value,
          ...{ groupCreate: { sort: sortGroupLength } }[type],
          ...{ groupEdit: { id: formValue.id } }[type],
          ...{ entryCreate: { parent_id: parentItem.id, sort: parentItem.children ? parentItem.children.length : 0 } }[type],
          ...{ entryEdit: { parent_id: formValue.parent_id, id: formValue.uid } }[type],
        });
      }
    });
  }

  render() {
    const { visible, type, formValue, onOk, onCancel } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={{ groupCreate: '新建商品分组', groupEdit: '编辑商品分组', entryCreate: '新建子分组', entryEdit: '编辑子分组' }[type]}
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
        </Form>
      </Modal>
    );
  }
}
