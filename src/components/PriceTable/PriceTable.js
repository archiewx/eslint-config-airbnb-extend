import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames/bind';
import { Row, Col, Button, InputNumber } from 'antd';
import styles from './PriceTable.less';

const cx = classNames.bind(styles);

export default class PriceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableRow: [],
      tableCol: [],
      tableValue: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tableRow: nextProps.priceGrades,
    });
    if (nextProps.priceModel === '') {
      this.setState({
        tableValue: nextProps.value,
      });
    } else if (nextProps.priceModel === 'shop') {
      this.setState({
        tableCol: nextProps.shops,
        tableValue: nextProps.value,
      });
    } else if (nextProps.priceModel === 'unit') {
      this.setState({
        tableCol: nextProps.selectUnits,
        tableValue: nextProps.value,
      });
    } else if (nextProps.priceModel === 'quantityrange') {
      this.setState({
        tableCol: nextProps.selectQuantityStep,
        tableValue: nextProps.value,
      });
    }
  }

  handleChangeInput = (id, subId, value) => {
    const current = this.state.tableValue;
    const { usePricelelvel, priceModel } = this.props;
    if (usePricelelvel === 'yes') {
      if (priceModel !== '') {
        current[`${id}_${subId}`].price = value;
      } else {
        current[`${id}`].price = value;
      }
    } else {
      current[`${id}`].price = value;
    }
    this.setState({
      tableValue: { ...current },
    });
    this.props.onChange(current);
  }

  render() {
    const { usePricelelvel, priceModel } = this.props;
    const { tableRow, tableCol, tableValue } = this.state;
    const tableWidth = ((1 / (tableRow.length + 1)) * 100).toFixed(1);
    return (
      <div>
        {
          usePricelelvel === 'yes' ? (
            priceModel !== '' ? (
              <div>
                <table className={styles.priceGradeTable} style={{ width: '100%' }}>
                  <thead className={cx({ priceGradeTableHead: true })}>
                    <tr>
                      <td style={{ width: `${tableWidth}%` }} />
                      {
                        tableRow.map((item) => {
                          return <td key={item.id} style={{ width: `${tableWidth}%` }}><span className={styles.spanRowTitlePostion}>{item.name}</span></td>;
                        })
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tableCol.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td className={cx({ priceGradeTableHead: true })}><span className={styles.spanColTitlePostion}>{item.name}</span></td>
                            {
                              tableRow.map((subItem, subIndex) => {
                                return <td key={subItem.id}><InputNumber value={(tableValue[`${item.id}_${subItem.id}`] || {}).price} onChange={this.handleChangeInput.bind(null, item.id, subItem.id)} precision={2} min={0} placeholder="请输入" style={{ textAlign: 'right' }} className={cx({ priceGradeInput: true, inputColor: (tableValue[`${item.id}_${subItem.id}`] || {}).price === 0 })} /></td>;
                              })
                            }
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <table className={styles.priceGradeTable} style={{ width: '100%' }}>
                  <thead className={cx({ priceGradeTableHead: true })}>
                    <tr>
                      {
                        tableRow.map((item) => {
                          return <td key={item.id}><span className={styles.spanRowTitlePostion}>{item.name}</span></td>;
                        })
                      }
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {
                        tableRow.map((item) => {
                          return <td key={item.id}><InputNumber value={(tableValue[`${item.id}`] || {}).price} onChange={this.handleChangeInput.bind(null, item.id, -1)} precision={2} min={0} placeholder="请输入" style={{ textAlign: 'right' }} className={cx({ priceGradeInput: true, inputColor: (tableValue[`${item.id}}`] || {}).price === 0 })} /></td>;
                        })
                      }
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          ) : (
            priceModel !== '' ? (
              <div style={{width:'100%'}}>
                <Row gutter={64}>
                  {
                    tableCol.map((item) => {
                      return (
                        <Col span={8} key={item.id}>
                          <label className={styles.priceGradeLabelTitle}>{item.name}</label>
                          <InputNumber value={(tableValue[`${item.id}`] || {}).price} onChange={this.handleChangeInput.bind(null, item.id, -1)} placeholder="请输入" style={{ width: '100%' }} min={0} precision={2} className={cx({ inputColor: (tableValue[`${item.id}`] || {}).price === 0 })} />
                        </Col>
                      );
                    })
                  }
                </Row>
              </div>
            ) : null
          )
        }
      </div>
    );
  }
}
