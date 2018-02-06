import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames/bind'
import { Row, Col, Button, InputNumber} from 'antd';
import styles from './PriceTextTable.less'
let cx = classNames.bind(styles);

export default class PriceTextTable extends React.Component {

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
      tableRow: nextProps.priceGrades || [],
      tableValue : nextProps.tableValue || {}
    })
    if(nextProps.priceModel == 'shop') {
      this.setState({
        tableCol: nextProps.shops || []
      })
    }else if(nextProps.priceModel == 'unit') {
      this.setState({
        tableCol: nextProps.units || []
      })
    }else if(nextProps.priceModel == 'quantityrange') {
      this.setState({
        tableCol: nextProps.quantityranges || []
      })
    }
  }

  render() {
    const {usePricelelvel,priceModel} = this.props
    const {tableRow,tableCol,tableValue} = this.state;
    const tableWidth = ((1/(tableRow.length+1))*100).toFixed(1);
    return (
      <div style={{paddingLeft:16,paddingRight:16}}>
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
                                return <td key={subItem.id}><div  className={cx({priceGradeInput:true,inputColor:(tableValue[`${item.id}_${subItem.id}`] || {}).price === 0})}>{(tableValue[`${item.id}_${subItem.id}`] || {}).price} </div></td>
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
                          return <td key={item.id}><div className={cx({priceGradeInput:true,inputColor:(tableValue[`${item.id}_${subItem.id}`] || {}).price === 0})}>{(tableValue[`${item.id}`] || {}).price}</div>></td>
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
                          <div className={cx({priceGradeInput:true,inputColor:(tableValue[`${item.id}_${subItem.id}`] || {}).price === 0})}>{(tableValue[`${item.id}`] || {}).price}</div>
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
