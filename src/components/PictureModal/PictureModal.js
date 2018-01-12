import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames/bind'
import { Row, Col, Upload, Modal, Icon } from 'antd';
import styles from './PictureModal.less'

export default class PictureModal extends PureComponent {

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: []
  }

  handleBeforeUpload = (file) => {
    console.log(file)
    file.url = URL.createObjectURL(file)
    this.setState(({fileList}) => ({
      fileList: [...fileList,file]
    }))
    // URL.revokeObjectURL(file.src)
    // this.props.onChange([...alreadyFileList,file])
    return false
  }

  handlePreview = (file) => {
    this.setState({
      previewVisible: !this.state.previewVisible,
      previewImage: file.url 
    })
  }

  handleCancel = () => {
    this.setState({
      previewVisible: !this.state.previewVisible
    })
  }

  hanldeRemove = (file) => {
    let alreadyFileList = this.state.fileList;
    const index = alreadyFileList.indexOf(file)
    alreadyFileList.splice(index,1)
    this.setState({
      fileList: [].concat(alreadyFileList)
    })
    // this.props.onChange(alreadyFileList)
  }

  render() {  
    const {selectColors,itemImageLevel} = this.props
    const {previewVisible,previewImage,fileList} = this.state

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <div>
        {
          itemImageLevel === 'item' ? (
            <div className={styles.pictureModal}>
              <Upload
                action = 'http://duoke3api.duoke.net/api/images'
                listType='picture-card'
                fileList={fileList}
                beforeUpload={this.handleBeforeUpload}
                onPreview={this.handlePreview}
                onRemove={this.hanldeRemove}
                multiple = {true}
              >
                {uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} > 
                <img alt="image" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
          ) : (
            <div>
              <Row>
                {
                  selectColors.map( item => {
                    return (
                      <Col span={12} key={item.id}>
                        <Upload
                          action = 'http://duoke3api.duoke.net/api/images'
                          listType='picture-card'
                          fileList={fileList}
                          beforeUpload={this.handleBeforeUpload}
                          onPreview={this.handlePreview}
                          onRemove={this.hanldeRemove}
                          multiple = {true}
                        >
                          {uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} > 
                          <img alt="image" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                      </Col>
                    )
                  })
                }
              </Row>
            </div>
          )
        }
      </div>
    )
  }
}
