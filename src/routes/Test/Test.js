import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Table,InputNumber,Form,Card,Button} from 'antd';
import TagSelect from '../../components/DuokeTagSelect';
export default class Test extends PureComponent {

  handleOnChange = () => {
    console.log(this)
  }

  render() {

    const data = [{
      name: 'a',
      id: 1
    },{
      name: 'b',
      id: 2
    },{
      name: 'c',
      id: 3
    },{
      name: 'd',
      id: 4
    }]

    return (
      <Card>
        <div>
          1
        </div>
      </Card>
    );
  }
}




