import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '../../components/antd-pro/Login';
import styles from './Login.less';
import QRCode from 'qrcode'

@connect(state => ({
  login: state.login,
}))
export default class LoginPage extends Component {

  componentWillReceiveProps({login}) {
    QRCode.toDataURL(login.qrcode,{ errorCorrectionLevel: 'H',color:{light: '#F0F2F5'} ,width:220}).then((url)=>{
      let img = document.getElementById('login_qrcode')
      img.src = url;
    })
  }

  render() {
    const { qrcode } = this.props.login;
    return (
      <div className={styles.main}>
        <Login onSubmit={this.handleSubmit} >
          <div className={styles.loginQrcode}>
            <img id='login_qrcode' />
            <div style={{marginTop:35}}>
              <div className={styles.title}>扫码登录多客</div>
              <div>打开手机多客进入「更多 - 扫一扫」</div>
            </div>
          </div>
        </Login>
      </div>
    );
  }
}
