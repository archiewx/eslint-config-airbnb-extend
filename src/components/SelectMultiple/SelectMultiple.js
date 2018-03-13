import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames/bind'
import { Row, Col, Select} from 'antd';
import styles from './SelectMultiple.less'
const Option = Select.Option;

export default class SelectMultiple extends PureComponent {

  state = {
    goodsGroupsIds: {}
  }

  componentWillReceiveProps(nextProps) {
    let goodsGroupsIds = {}
    if(!Object.values(nextProps.value).length) {
      nextProps.goodsGroups.forEach( item => {
        goodsGroupsIds[`${item.id}`] = []
      })  
    }else {
      goodsGroupsIds = nextProps.value
    }
    this.setState({goodsGroupsIds})
  }

  handleSelect = (id,value) => {
    let selectIds = this.state.goodsGroupsIds;
    selectIds[`${id}`].push(value)
    this.setState({
      goodsGroupsIds:{...selectIds}
    })
     this.props.onChange(selectIds)
  }

  handleDeSelect = (id,value) => {
    let selectIds = this.state.goodsGroupsIds;
    selectIds[`${id}`].splice(selectIds[`${id}`].indexOf(value),1)
    this.setState({
      goodsGroupsIds: {...selectIds}
    })
    this.props.onChange(selectIds)
  }

  render() {  
    const {goodsGroups } = this.props;
    const {goodsGroupsIds} = this.state;
    return (
      <div>
        <Row gutter={64}>
          {
            goodsGroups.map( item => {
              return item.children.length === 0 ? null : (
                <Col span={8} key={item.id}>
                  <div><label className={styles.SelectMultipleLabelTitle}>{item.name}</label></div>
                  <Select mode='multiple' placeholder='请选择商品分组' value={goodsGroupsIds[`${item.id}`]} onSelect={this.handleSelect.bind(null,item.id)} onDeselect={this.handleDeSelect.bind(null,item.id)}>
                    {
                      item.children.map( subItem => {
                        return (
                          <Option key={(subItem.uid)} value={(subItem.uid)}>{subItem.name}</Option>
                        )
                      })
                    }
                  </Select>
                </Col>
              )
            })
          }
        </Row>
      </div>
    )
  }
}
