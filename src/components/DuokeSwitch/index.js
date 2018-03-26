import React from 'react';
import { Switch, Icon } from 'antd';
import styles from './index.less';

let checkedDis;
const DuokeSwitchOption = ({ title = '', disname = 'icon', ...rest }) => {
  disname == 'text' ? checkedDis = { checkedChildren: '开', unCheckedChildren: '关' } : null;
  disname == 'icon' ? checkedDis = { checkedChildren: <Icon type="check" />, unCheckedChildren: <Icon type="cross" /> } : null;
  return <div className={styles.optionTitle}><span>{title}</span><Switch {...rest} {...checkedDis} className={styles.switchPosition} /></div>;
};

const DuokeSwitch = ({ title = '', disname = 'text', ...rest }) => {
  disname == 'text' ? checkedDis = { checkedChildren: '开', unCheckedChildren: '关' } : null;
  disname == 'icon' ? checkedDis = { checkedChildren: <Icon type="check" />, unCheckedChildren: <Icon type="cross" /> } : null;
  return <div className={styles.title}><span>{title}</span><Switch {...rest} {...checkedDis} className={styles.switchPosition} /></div>;
};

DuokeSwitch.Option = DuokeSwitchOption;

export default DuokeSwitch;
