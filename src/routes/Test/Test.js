import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Table,InputNumber,Form,Card,Button} from 'antd';
import DuokeIcon from '../../components/DuokeIcon'
export default class Test extends PureComponent {

  render() {

    return (
      <Card>
        <div>
          <DuokeIcon type='unselected_com'/>
          <DuokeIcon type='unselected_fin'/>
          <DuokeIcon type='unselected_con'/>
          <DuokeIcon type='version_number'/>
          <DuokeIcon type='unselected_doc'/>
          <DuokeIcon type='unselected_rel'/>
        </div>
      </Card>
    );
  }
}




