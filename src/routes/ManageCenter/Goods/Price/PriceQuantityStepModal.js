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
export default class PriceQuantityStepModal extends PureComponent {

  state = {
    priceQuantityStep: '1 ~',
    quantityCollect:[1]
  }

  handleModalClose = ()=>{
    this.props.form.resetFields()
    this.setState({
      priceQuantityStep: '1 ~',
      quantityCollect:[1]
    })
  }

  handleConfirm = () => {
    const {validateFields,getFieldsValue} = this.props.form;
    const {onOk} = this.props;
    validateFields((err,value) =>{
      if(!err){
        let obj = {
          name: this.state.priceQuantityStep.replace(/\s/g,''),
          quantityranges: []
        }
        this.state.quantityCollect.forEach( (n,i,arr) => {
          obj.quantityranges.push({
            min: n,
            max: arr.length-1 == i ? -1 : arr[i+1]
          })
        })
        onOk && onOk( {
          ...obj,
        })
      }
    })
  }

  handleIncrease = () => {
    const {form} = this.props;
    if(form.getFieldValue('price')) {
      let priceQuantityStep = this.state.priceQuantityStep;
      let quantityCollect = this.state.quantityCollect;
      priceQuantityStep += ` ${form.getFieldValue('price')} ~`
      quantityCollect.push(form.getFieldValue('price'))
      this.setState({priceQuantityStep,quantityCollect})
      form.setFieldsValue({price:''})
    }
  }

  render() {
    const {visible,onOk,onCancel } = this.props;
    const {getFieldDecorator} = this.props.form;
    const {priceQuantityStep} = this.state;
    return (
      <Modal
        title= '新建价格阶梯'
        visible={visible}
        onOk={this.handleConfirm}
        onCancel={onCancel}
        afterClose={this.handleModalClose}
        >
        <Form layout='horizontal'>
          <div style={{marginBottom:20}}>
            <Row>
              <Col offset={2}><span style={{marginLeft:11}}>{`${priceQuantityStep}`}</span></Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col span={16} offset={2}>
                <FormItem label='价格' labelCol={{span:4}} wrapperCol={{span:20}}>
                  {getFieldDecorator('price')(
                    <Input placeholder='请输入' />
                  )}
                </FormItem>
              </Col>
              <Col span={4} offset={1}>
                <FormItem>
                  <a onClick={this.handleIncrease}>添加</a>
                </FormItem>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    )
  }
}
