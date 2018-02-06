import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames/bind'
import { Row, Col, Upload, Modal, Icon } from 'antd';
import styles from './GoodsPictureModal.less'

export default class GoodsPictureModal extends PureComponent {

  state = {
    previewVisible: false,
    previewImage: '',
    imageFileList: {}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      imageFileList:nextProps.value
    })
  }

  handleBeforeUpload = (id,file) => {
    if(file.type.indexOf('image') > -1) {
      file.url = URL.createObjectURL(file)
      let current = this.state.imageFileList;
      if(this.props.itemImageLevel === 'item') {
        current.fileList.push(file)
        this.setState({
          imageFileList: {...current}
        })
      }else {
        current[`${id}`].fileList.push(file)
        this.setState({
          imageFileList: {...current}
        })
      }
      URL.revokeObjectURL(file.src)
      this.props.onChange(current)
      return false
    }else {
      return false;
    }
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

  hanldeRemove = (id,file) => {
    let current = this.state.imageFileList;
    if(this.props.itemImageLevel === 'item') {
      const index = current.fileList.indexOf(file)
      current.fileList.splice(index,1)
      this.setState({
        imageFileList: {...current}
      })
    }else {
      const index = current[`${id}`].fileList.indexOf(file)
      current[`${id}`].fileList.splice(index,1)
      this.setState({
        imageFileList: {...current}
      })
    }
    this.props.onChange(current)
  }

  render() {  
    const {selectColors,itemImageLevel} = this.props
    const {previewVisible,previewImage,imageFileList} = this.state

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
              <Row>
                <Col span={2}><label className={styles.pictureModalTitle}>上传图片:</label></Col>
                <Col span={21}>
                  <Upload
                    action = 'http://duoke3api.duoke.net/api/images'
                    listType='picture-card'
                    fileList={imageFileList.fileList}
                    beforeUpload={this.handleBeforeUpload.bind(null,-1)}
                    onPreview={this.handlePreview}
                    onRemove={this.hanldeRemove.bind(null,-1)}
                    multiple = {true}
                  >
                    {uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} className={styles.modalClosePostion}> 
                    <img alt="image" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Col>
              </Row>
            </div>
          ) : (
            <div>
              <Row>
                {
                  selectColors.map( (item,index) => {
                    return (
                      <div key={item.id}>
                        <Col span={2}><label className={styles.pictureModalTitle}>{`${item.name}:`}</label></Col>
                        <Col span={10} style={{paddingTop: index > 1 ? 20 : 0}}>
                          <Upload
                            action = 'http://duoke3api.duoke.net/api/images'
                            listType='picture-card'
                            fileList={(imageFileList[`${item.id}`] || {}).fileList}
                            beforeUpload={this.handleBeforeUpload.bind(null,item.id)}
                            onPreview={this.handlePreview}
                            onRemove={this.hanldeRemove.bind(null,item.id)}
                            multiple = {true}
                          >
                            {uploadButton}
                          </Upload>
                          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} className={styles.modalClosePostion}> 
                            <img alt="image" style={{ width: '100%' }} src={previewImage} />
                          </Modal>
                        </Col>
                      </div>
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
