import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames/bind'
import { Row, Col, Button, InputNumber} from 'antd';
import styles from './PriceTable.less'
let cx = classNames.bind(styles);

export default class PriceTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableRow: [],
      tableCol: [],
      tableValue: {},
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tableRow:nextProps.priceGrades
    })
    if(nextProps.priceModel === '') {
      this.setState({
        tableValue: nextProps.value
      })
    }else if(nextProps.priceModel === 'shop') {
      this.setState({
        tableCol: nextProps.shops,
        tableValue: nextProps.value
      })
    }else if(nextProps.priceModel === 'unit') {
      this.setState({
        tableCol: nextProps.selectUnits,
        tableValue: Object.values(nextProps.value).length === Object.values(nextProps.priceTableValue).length ?  nextProps.value : nextProps.priceTableValue
      })
    }else if(nextProps.priceModel === 'quantityrange') {
      this.setState({
        tableCol: nextProps.selectQuantityStep,
        tableValue: Object.values(nextProps.value).length === Object.values(nextProps.priceTableValue).length ?  nextProps.value : nextProps.priceTableValue
      })
    } 
  }

  // handleCreateTableValue = (row = [],col = [],value = {}) => {
  //   let currentTableValue = {};
  //   const {usePricelelvel,priceModel} = this.props;
  //   if(usePricelelvel === 'yes') {
  //     if(priceModel === '') {
  //       row.forEach( item => {
  //         currentTableValue[`${item.id}`] = {
  //           pricelevel_id: item.id,
  //           price: null
  //         }
  //       })
  //     }else if(priceModel === 'shop') {
  //       col.forEach( item => {
  //         row.forEach( subItem => {
  //           currentTableValue[`${item.id}_${subItem.id}`] = {
  //             shop_id: item.id,
  //             pricelevel_id: subItem.id,
  //             price: null
  //           }
  //         })
  //       })
  //     }else if(priceModel === 'unit') {
  //       col.forEach( item => {
  //         row.forEach( subItem => {
  //           currentTableValue[`${item.id}_${subItem.id}`] = {
  //             unit_id: item.id,
  //             pricelevel_id: subItem.id,
  //             price: null,
  //           }
  //         })
  //       })
  //     }else if(priceModel === 'quantityrange') {
  //       col.forEach( item => {
  //         row.forEach( subItem => {
  //           currentTableValue[`${item.id}_${subItem.id}`] = {
  //             quantityrange_id: item.id,
  //             pricelevel_id: subItem.id,
  //             price: null,
  //           }
  //         })
  //       })
  //     }
  //   } else {
  //     if(priceModel === 'shop') {
  //       col.forEach( item => {
  //         currentTableValue[`${item.id}`] = {
  //           shop_id: item.id,
  //           price: null
  //         }
  //       })
  //     }else if(priceModel === 'unit') {
  //       col.forEach( item => {
  //         currentTableValue[`${item.id}`] = {
  //           unit_id: item.id,
  //           price: null
  //         }
  //       })
  //     }else if(priceModel === 'quantityrange') {
  //       col.forEach( item => {
  //         currentTableValue[`${item.id}`] = {
  //           quantityrange_id: item.id,
  //           price: null
  //         }
  //       })
  //     }
  //   }
  //   return currentTableValue
  // }

  handleChangeInput = (id,subId,value) => {
    let current = this.state.tableValue;
    const {usePricelelvel,priceModel} = this.props;
    if(usePricelelvel === 'yes') {
      if(priceModel !== '') {
        current[`${id}_${subId}`].price = value;
      }else {
        current[`${id}`].price = value
      }
    }else {
      current[`${id}`].price = value
    }
    this.setState({
      tableValue: {...current}
    })
    this.props.onChange(current)
  }

  render() {
    const {usePricelelvel,priceModel} = this.props
    const {tableRow,tableCol,tableValue} = this.state;
    const tableWidth = ((1/(tableRow.length+1))*100).toFixed(1);
    return (
      <div>
        {
          usePricelelvel === 'yes' ? (
            priceModel !== '' ? (
              <div>
                <table className={styles.priceGradeTable} style={{width:'100%'}}>
                  <thead className={cx({priceGradeTableHead:true})}>
                    <tr>
                      <td style={{width:`${tableWidth}%`}}></td>
                      {
                        tableRow.map( item => {
                          return <td key={item.id} style={{width:`${tableWidth}%`}}><span className={styles.spanRowTitlePostion}>{item.name}</span></td>
                        })
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tableCol.map( item => {
                        return (
                          <tr key={item.id}>
                            <td className={cx({priceGradeTableHead:true})}><span className={styles.spanColTitlePostion}>{item.name}</span></td>
                            {
                              tableRow.map( (subItem,subIndex) => {
                                return <td key={subItem.id}><InputNumber value={(tableValue[`${item.id}_${subItem.id}`] || {}).price} onChange={this.handleChangeInput.bind(null,item.id,subItem.id)} precision={2} min={0} placeholder='请输入' style={{textAlign:'right'}} className={styles.priceGradeInput} /></td>
                              })
                            }
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <table className={styles.priceGradeTable} style={{width:'100%'}}>
                  <thead className={cx({priceGradeTableHead:true})}>
                    <tr>
                      {
                        tableRow.map( item => {
                          return <td key={item.id}><span className={styles.spanRowTitlePostion}>{item.name}</span></td>
                        })
                      }
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {
                        tableRow.map( item => {
                          return <td key={item.id}><InputNumber value={(tableValue[`${item.id}`] || {}).price} onChange={this.handleChangeInput.bind(null,item.id,-1)} precision={2} min={0} placeholder='请输入' style={{textAlign:'right'}} className={styles.priceGradeInput} /></td>
                        })
                      }
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          ) : (
            priceModel !== '' ? (
              <div>
                <Row gutter={64}>
                  {
                    tableCol.map( item => {
                      return (
                        <Col span={8} key={item.id}>
                          <label className={styles.priceGradeLabelTitle}>{item.name}</label>
                          <InputNumber value={(tableValue[`${item.id}`] || {}).price} onChange={this.handleChangeInput.bind(null,item.id,-1)} placeholder='请输入' style={{width:'100%'}} min={0} precision={2}/>
                        </Col>
                      )
                    })
                  }
                </Row>
              </div>
            ) : null
          )
        }
      </div>
    )
  }
}
