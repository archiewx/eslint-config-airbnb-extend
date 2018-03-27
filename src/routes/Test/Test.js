import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, InputNumber, Form, Card, Button } from 'antd';
import DuokeIcon from '../../components/DuokeIcon';

export default class Test extends PureComponent {
  state = {
    q: null,
  }

  handleChange = (value) => {
    this.setState({
      q: value,
    });
  }

  handleFormat = (value) => {
    return (value.toString()).replace(/[^\d+(\.\d{2})?$]/, '');
  }

  handleParser = (value) => {
    return value;
  }

  render() {
    return (
      <Card>
        <div>
          <DuokeIcon type="unselected_com" />
          <DuokeIcon type="unselected_fin" />
          <DuokeIcon type="unselected_con" />
          <DuokeIcon type="version_number" />
          <DuokeIcon type="unselected_doc" />
          <DuokeIcon type="unselected_rel" />
        </div>
        <InputNumber precision={2} value={this.state.q} onChange={this.handleChange} formatter={this.handleFormat} parser={this.handleParser} />
      </Card>
    );
  }
}

