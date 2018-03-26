import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames/bind';
import { Row, Col, Select, InputNumber, Input } from 'antd';

const Option = Select.Option;
const InputGroup = Input.Group;
export default class SelectInput extends PureComponent {
  state = {
    selectValue: '1',
    inputValue: null,
  }

  handleSelect = (value) => {
    this.setState({
      selectValue: value,
    });
  }

  handleInput = (value) => {
    this.setState({
      inputValue: value,
    });
    const current = [];
    current.push(this.state.selectValue, value);
    this.props.onChange(current);
  }

  render() {
    const { selectValue, inputValue } = this.state;

    return (
      <div>
        <InputGroup compact>
          <Select style={{ width: '48%' }} value={selectValue} onSelect={this.handleSelect} >
            <Option key="1">初始欠款</Option>
            <Option key="2">初始余额</Option>
          </Select>
          <InputNumber onChange={this.handleInput} value={inputValue} style={{ width: '52%', marginRight: 0 }} placeholder="请输入" />
        </InputGroup>
      </div>
    );
  }
}
