import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames/bind'
import { Row, Col, Select} from 'antd';
import styles from './Test.less'
const Option = Select.Option;

export default class Test extends PureComponent {

  state = {
    goodsGroupsId: {}
  }

  componentWillReceiveProps(nextProps) {
    let goodsGroupsId = {}
    nextProps.goodsGroups.forEach( item => {
      goodsGroupsId[`${item.id}`] =  nextProps.value ? nextProps.value[`${item.id}`] : []
    })
    this.setState({goodsGroupsId})
  }

  handleSelect = (id,value) => {
    let selectIds = this.state.goodsGroupsId;
    selectIds[`${id}`].push(value)
    this.setState({
      goodsGroupsId: {...selectIds}
    })
     this.props.onChange(selectIds)
  }

  handleDeSelect = (id,value) => {
    let selectIds = this.state.goodsGroupsId;
    selectIds[`${id}`].splice(selectIds[`${id}`].indexOf(value),1)
    this.setState({
      goodsGroupsId: {...selectIds}
    })
    this.props.onChange(selectIds)
  }

  render() {  
    const {goodsGroups } = this.props;
    const {goodsGroupsId} = this.state;
    return (
      <div>
        {
          goodsGroups.map( item => {
            return item.children.data.length === 0 ? null : (
              <Col span={8} key={item.id}>
                <div><label className={styles.SelectMultipleLabelTitle}>{item.name}</label></div>
                <Select mode='multiple' placeholder='请选择商品分组' value={goodsGroupsId[`${item.id}`]} onSelect={this.handleSelect.bind(null,item.id)} onDeselect={this.handleDeSelect.bind(null,item.id)}>
                  {
                    item.children.data.map( subItem => {
                      return (
                        <Option key={subItem.id} value={(subItem.id).toString()}>{subItem.name}</Option>
                      )
                    })
                  }
                </Select>
              </Col>
            )
          })
        }
      </div>
    )
  }
}
