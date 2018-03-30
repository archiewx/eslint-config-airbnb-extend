import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames/bind';
import { Row, Col, Upload, Modal, Icon, Button } from 'antd';
import styles from './LightBoxImage.less';

const cx = classNames.bind(styles);

export default class LightBoxImage extends PureComponent {
  state = {
    previewImage: '',
    previewVisible: false,
  }

  handleOnPreview = (url) => {
    if (url) {
      this.setState({
        previewImage: url,
        previewVisible: true,
      });
    }
  }

  handleOnCancel = () => {
    this.setState({
      previewVisible: false,
    });
  }

  handleOnMoveLeft = () => {
    const imageSource = this.props.imageSource;
    const index = imageSource.findIndex(n => n.url == this.state.previewImage);
    if (index != 0) {
      this.setState({
        previewImage: imageSource[index - 1].url,
      });
    }
  }

  handleOnMoveRight = () => {
    const imageSource = this.props.imageSource;
    const index = imageSource.findIndex(n => n.url == this.state.previewImage);
    if (index != imageSource.length - 1) {
      this.setState({
        previewImage: imageSource[index + 1].url,
      });
    }
  }

  render() {
    const { imageSource, style } = this.props;
    const { previewVisible, previewImage } = this.state;
    console.log(imageSource)

    return (
      <div className={styles.picture} style={style}>
        {
          imageSource.map((item, index) => {
            return <div className={styles.pictureCard} key={index}><span className={styles.pictureSpan}><a onClick={this.handleOnPreview.bind(null, item.url)}><img src={item.url} key={item.id} alt="图片失效" /></a></span></div>;
          })
        }
        <Modal visible={previewVisible} footer={null} onCancel={this.handleOnCancel} className={cx({ modalClosePostion: true })} >
          {
            imageSource.length > 1 ? <Icon type="left" className={cx({ moveSize: true, moveLeftPosition: true })} onClick={this.handleOnMoveLeft} /> : null
          }
          {
            imageSource.length > 1 ? <Icon type="right" className={cx({ moveSize: true, moveRightPosition: true })} onClick={this.handleOnMoveRight} /> : null
          }
          <img alt="hello world" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
