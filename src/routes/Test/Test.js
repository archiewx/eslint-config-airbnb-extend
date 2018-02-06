import React, { PureComponent } from 'react';
import {apiBase,token} from '../../common/index'
import { connect } from 'dva';
import {Table,InputNumber,Form,Card,Button,Upload, Icon, Modal} from 'antd';
const FormItem = Form.Item;
// @connect(({test,priceGrade}) => ({
//   test,
//   priceGrade
// }))
class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="http://duoke3api.duoke.net/api/images"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          name={'image_file'}
          headers={ {"Authorization": token} }
          data={(file)=>({image_name:file.name})}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default class Test extends PureComponent {

  render() {
    return (
      <div>
        <PicturesWall />
      </div>
    );
  }
}




