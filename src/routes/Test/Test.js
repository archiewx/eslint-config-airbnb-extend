import React, { PureComponent } from 'react';
import {apiBase,token} from '../../common/index'
import { connect } from 'dva';
import LightBoxImage from '../../components/LightBoxImage/LightBoxImage'
import {Table,InputNumber,Form,Card,Button,Upload, Icon, Modal} from 'antd';

export default class Test extends PureComponent {

  state = {
    image: [{
      id:1,
      name:'4650127881518330387718.jpeg',
      url:'http://duoke3-image.oss-cn-hangzhou.aliyuncs.com/4650127881518330387718.jpeg',
    },{
      id:2,
      name:'42378897481518330387718.jpeg',
      url:'http://duoke3-image.oss-cn-hangzhou.aliyuncs.com/42378897481518330387718.jpeg',
    },{
      id:3,
      name:'26335412401518058368712.jpeg',
      url:'http://duoke3-image.oss-cn-hangzhou.aliyuncs.com/26335412401518058368712.jpeg',
    },{
      id:4,
      name:'15781127171518058368712.jpeg',
      url:'http://duoke3-image.oss-cn-hangzhou.aliyuncs.com/15781127171518058368712.jpeg',
    }]
  }

  render() {
    return (
      <Card>
        <div>
          <LightBoxImage imageSource={this.state.image}/>
        </div>
      </Card>
    );
  }
}




