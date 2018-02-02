import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Table,InputNumber,Form,Card,Button} from 'antd';
const FormItem = Form.Item;
@connect(({test,priceGrade}) => ({
  test,
  priceGrade
}))
@Form.create()
export default class Test extends PureComponent {

  componentWillReceiveProps() {

  }

  handleChange = (value) => {
    const {form} = this.props;
    let oldVal = form.getFieldValue('input1')
    console.log(oldVal,'old')
    setTimeout(() => {
      let val = form.getFieldValue('input1')
      console.log(val)
      // if(val == '') {
      //   form.setFieldsValue({input1:undefined})
      // }else {
      //   form.setFieldsValue({input1:val})
      // }
      if(oldVal == '') {
        form.setFieldsValue({input1:undefined})
      }
    }, 4)
  }

  // handleFormatter = (value) => {
  //   return value
  // }

  // handleParser = (value) => {
  //   return value
  // }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <div>
        <Form>
          <FormItem label='测试'>
            {getFieldDecorator('input1',{
              rules: [{required:true}],
              initialValue:''
            })(
              <InputNumber  
                onChange={this.handleChange}
                // formatter={this.handleFormatter}
                // parser={this.handleParser}
              />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}


